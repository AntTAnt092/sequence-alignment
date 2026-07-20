import { C } from "../constants";

export default function Sidebar({ page, setPage, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:50}}/>
      )}
      <div style={{
        position:"fixed", top:0, left:0, height:"100vh", width:260,
        background:"#ffffff", borderRight:`1px solid ${C.border}`,
        zIndex:60, transform:sidebarOpen?"translateX(0)":"translateX(-260px)",
        transition:"transform 0.3s ease", display:"flex", flexDirection:"column",
        padding:"24px 0", overflow:"hidden",
        boxShadow:"4px 0 20px rgba(0,0,0,0.08)",
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');`}</style>
        <div style={{padding:"0 20px 24px", borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,letterSpacing:"0.3em",color:C.muted,marginBottom:4}}></div>
          <div style={{fontFamily:"'Orbitron',sans-serif", fontSize:14, fontWeight:600, color:"#1a1a2e", letterSpacing:2}}>SequenceAlignment</div>
        </div>

        <nav style={{padding:"16px 12px", display:"flex", flexDirection:"column", gap:6}}>
          {[
            {id:"app", icon:"⬡", label:"Aplikacija", desc:""},
            {id:"algorithms", icon:"◈", label:"Dokumentacija", desc:""},
          ].map(item=>(
            <button key={item.id} onClick={()=>{setPage(item.id);setSidebarOpen(false);}} style={{
              display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
              borderRadius:10, border:`1px solid ${page===item.id?C.green:C.border}`,
              background:page===item.id?`${C.green}10`:"transparent",
              cursor:"pointer", fontFamily:"'IBM Plex Mono',monospace", textAlign:"left",
            }}>
              <span style={{fontSize:18, color:page===item.id?C.green:C.muted}}>{item.icon}</span>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:page===item.id?C.green:"#333"}}>{item.label}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>{item.desc}</div>
              </div>
            </button>
          ))}
        </nav>

        <div style={{marginTop:"auto",padding:"16px 20px",borderTop:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.dim}}>v1.4 · NW + SW · Diplomski projekt</div>
        </div>
      </div>
    </>
  );
}