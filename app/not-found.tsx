import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#040B1C",color:"#fff",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",textAlign:"center"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;}`}</style>

      {/* Glow */}
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 50%,rgba(34,197,94,0.07) 0%,transparent 70%)",pointerEvents:"none"}}/>

      <div style={{position:"relative",zIndex:1,maxWidth:480}}>
        <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"clamp(80px,15vw,140px)",letterSpacing:"-6px",lineHeight:1,background:"linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>404</div>

        <h1 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"clamp(22px,4vw,32px)",letterSpacing:"-1px",marginBottom:14,color:"#fff"}}>
          Page not found
        </h1>
        <p style={{fontSize:15,color:"rgba(255,255,255,0.45)",lineHeight:1.8,marginBottom:36}}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <Link href="/" style={{padding:"12px 28px",background:"linear-gradient(135deg,#22C55E,#16A34A)",color:"#fff",borderRadius:12,fontWeight:700,fontSize:14,boxShadow:"0 6px 20px rgba(34,197,94,0.35)"}}>
            ← Back to Home
          </Link>
          <Link href="/contact" style={{padding:"12px 24px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.10)",color:"rgba(255,255,255,0.7)",borderRadius:12,fontWeight:600,fontSize:14}}>
            Contact Support
          </Link>
        </div>

        <div style={{marginTop:48,display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
          {[["Home","/"],["Privacy Policy","/privacy-policy"],["Terms","/terms"],["Contact","/contact"]].map(([l,h])=>(
            <Link key={l} href={h} style={{fontSize:13,color:"rgba(255,255,255,0.3)",fontWeight:500}}>{l}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
