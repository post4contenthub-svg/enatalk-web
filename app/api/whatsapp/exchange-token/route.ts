// app/api/whatsapp/exchange-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { code, userId } = await req.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: "Missing code or userId" },
        { status: 400 }
      );
    }

    // ── Step 1: Exchange the code for a User Access Token ──
    // Meta Embedded Signup returns a short-lived code
    // We exchange it for an access token using our App ID + Secret
    const tokenRes = await fetch(
      `https://graph.facebook.com/v22.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_META_APP_ID!,
          client_secret: process.env.META_APP_SECRET!,
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/customer/app/connect-whatsapp`,
        }),
      { method: "GET" }
    );

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      console.error("Token exchange error:", tokenData);
      return NextResponse.json(
        { error: tokenData.error?.message || "Failed to exchange token" },
        { status: 400 }
      );
    }

    const accessToken: string = tokenData.access_token;

    // ── Step 2: Get the WhatsApp Business Accounts linked to this user ──
    const wabaRes = await fetch(
      `https://graph.facebook.com/v22.0/me/businesses?` +
        new URLSearchParams({ access_token: accessToken }),
      { method: "GET" }
    );

    const wabaData = await wabaRes.json();

    if (!wabaRes.ok || !wabaData.data?.length) {
      console.error("WABA fetch error:", wabaData);
      return NextResponse.json(
        { error: "No WhatsApp Business Account found. Please complete the Meta signup." },
        { status: 400 }
      );
    }

    const businessId: string = wabaData.data[0].id;

    // ── Step 3: Get WhatsApp accounts under this business ──
    const phoneRes = await fetch(
      `https://graph.facebook.com/v22.0/${businessId}/owned_whatsapp_business_accounts?` +
        new URLSearchParams({
          access_token: accessToken,
          fields: "id,name,phone_numbers",
        }),
      { method: "GET" }
    );

    const phoneData = await phoneRes.json();

    if (!phoneRes.ok || !phoneData.data?.length) {
      console.error("Phone number fetch error:", phoneData);
      return NextResponse.json(
        { error: "No WhatsApp phone number found. Please add a number in Meta." },
        { status: 400 }
      );
    }

    const wabaAccount = phoneData.data[0];
    const wabaId: string = wabaAccount.id;
    const phoneNumbers = wabaAccount.phone_numbers?.data || [];
    const phoneNumberId: string = phoneNumbers[0]?.id || "";
    const phoneNumber: string = phoneNumbers[0]?.display_phone_number || "";

    if (!phoneNumberId) {
      return NextResponse.json(
        { error: "No phone number ID found. Please register a phone number in Meta Business." },
        { status: 400 }
      );
    }

    // ── Step 4: Save to Supabase ──
    // Check if already connected
    const { data: existing } = await supabaseAdmin
      .from("tenant_whatsapp_accounts")
      .select("id")
      .eq("tenant_id", userId)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabaseAdmin
        .from("tenant_whatsapp_accounts")
        .update({
          waba_id: wabaId,
          phone_number_id: phoneNumberId,
          phone_number: phoneNumber,
          access_token: accessToken,
          connected_at: new Date().toISOString(),
        })
        .eq("tenant_id", userId);

      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabaseAdmin
        .from("tenant_whatsapp_accounts")
        .insert({
          tenant_id: userId,
          waba_id: wabaId,
          phone_number_id: phoneNumberId,
          phone_number: phoneNumber,
          access_token: accessToken,
          connected_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;
    }

    console.log("✅ WhatsApp connected for user:", userId, {
      wabaId,
      phoneNumberId,
      phoneNumber,
    });

    return NextResponse.json({
      success: true,
      wabaId,
      phoneNumberId,
      phoneNumber,
    });

  } catch (err: any) {
    console.error("exchange-token error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
