"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#040B1C",color:"#fff",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",textAlign:"center"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;}`}</style>

      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 50%,rgba(239,68,68,0.06) 0%,transparent 70%)",pointerEvents:"none"}}/>

      <div style={{position:"relative",zIndex:1,maxWidth:480}}>
        <div style={{fontSize:64,marginBottom:16}}>⚠️</div>
        <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"clamp(22px,4vw,32px)",letterSpacing:"-1px",marginBottom:14,color:"#fff"}}>
          Something went wrong
        </h1>
        <p style={{fontSize:15,color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:36}}>
          We hit an unexpected error. Our team has been notified. Please try again or contact support if the problem persists.
        </p>

        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={reset} style={{padding:"12px 28px",background:"linear-gradient(135deg,#22C55E,#16A34A)",color:"#fff",border:"none",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 6px 20px rgba(34,197,94,0.35)"}}>
            Try Again
          </button>
          <a href="/" style={{padding:"12px 24px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.10)",color:"rgba(255,255,255,0.7)",borderRadius:12,fontWeight:600,fontSize:14}}>
            Go Home
          </a>
          <a href="/contact" style={{padding:"12px 24px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.10)",color:"rgba(255,255,255,0.7)",borderRadius:12,fontWeight:600,fontSize:14}}>
            Contact Support
          </a>
        </div>

        {error.digest && (
          <p style={{marginTop:24,fontSize:11,color:"rgba(255,255,255,0.2)",fontFamily:"monospace"}}>Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
