import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://enatalk.com"),
  title: {
    default: "EnaTalk — WhatsApp Automation Platform for Indian Businesses",
    template: "%s | EnaTalk",
  },
  description: "EnaTalk helps businesses automate WhatsApp messaging for leads, bookings, support and sales. Built on official WhatsApp Business Cloud API by Meta. Free to start.",
  keywords: ["WhatsApp automation", "WhatsApp Business API", "WhatsApp marketing India", "WhatsApp chatbot", "bulk WhatsApp", "EnaTalk"],
  authors: [{ name: "EnaTalk", url: "https://enatalk.com" }],
  creator: "EnaTalk",
  publisher: "EnaTalk",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://enatalk.com",
    siteName: "EnaTalk",
    title: "EnaTalk — WhatsApp Automation Platform for Indian Businesses",
    description: "Send campaigns, birthday wishes & festival offers via WhatsApp — from your phone, in minutes. Official Meta API. Free to start.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EnaTalk — WhatsApp Automation Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EnaTalk — WhatsApp Automation for Indian Businesses",
    description: "Send WhatsApp campaigns, birthday wishes & festival offers in minutes. Official Meta API. Free to start.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
  

  google: "1VtXs3OAVfOcrWypSXSI0rhlDz7AwYoYIiA3saS8HPk",




    // Add Google Search Console verification here when ready
    // google: "your-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
