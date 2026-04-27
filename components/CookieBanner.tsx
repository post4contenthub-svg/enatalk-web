"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [animOut, setAnimOut] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("enatalk_cookie_consent");
    if (!consent) setTimeout(() => setVisible(true), 1500);
  }, []);

  function accept() {
    localStorage.setItem("enatalk_cookie_consent", "accepted");
    dismiss();
  }

  function decline() {
    localStorage.setItem("enatalk_cookie_consent", "declined");
    dismiss();
  }

  function dismiss() {
    setAnimOut(true);
    setTimeout(() => setVisible(false), 350);
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideDown{from{opacity:1;transform:translateY(0);}to{opacity:0;transform:translateY(24px);}}
        .cookie-wrap{animation:${animOut?"slideDown":"slideUp"} .35s cubic-bezier(.16,1,.3,1) both;}
        @media(max-width:600px){.cookie-inner{flex-direction:column!important;gap:14px!important;}.cookie-btns{width:100%!important;}}
      `}</style>
      <div className="cookie-wrap" style={{
        position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",
        zIndex:9999,width:"calc(100% - 48px)",maxWidth:720,
        background:"rgba(8,16,36,0.97)",
        border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:16,padding:"16px 20px",
        boxShadow:"0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.06) inset",
        backdropFilter:"blur(20px)",
      }}>
        <div className="cookie-inner" style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:16}}>🍪</span>
              <span style={{fontSize:14,fontWeight:700,color:"#fff",fontFamily:"'DM Sans',sans-serif"}}>Cookie notice</span>
            </div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.48)",lineHeight:1.65,fontFamily:"'DM Sans',sans-serif",margin:0}}>
              We use essential cookies to keep you logged in and secure your session. No tracking or advertising cookies.
              See our <a href="/privacy-policy" style={{color:"#22C55E",textDecoration:"none",fontWeight:600}}>Privacy Policy</a> for details.
            </p>
          </div>
          <div className="cookie-btns" style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={decline} style={{
              padding:"9px 16px",background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.10)",color:"rgba(255,255,255,0.55)",
              borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,
              fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",
            }}>Decline</button>
            <button onClick={accept} style={{
              padding:"9px 20px",
              background:"linear-gradient(135deg,#22C55E,#16A34A)",
              border:"none",color:"#fff",borderRadius:10,cursor:"pointer",
              fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",
              boxShadow:"0 4px 14px rgba(34,197,94,0.35)",whiteSpace:"nowrap",
            }}>Accept</button>
          </div>
        </div>
      </div>
    </>
  );
}
