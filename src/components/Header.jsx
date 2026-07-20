import { C, s } from "../constants";

export default function Header({ page, sidebarOpen, setSidebarOpen }) {
  return (
    <header style={s.header}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');
      `}</style>
      <div style={{display:"flex", alignItems:"center", gap:16}}>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{
          width:36, height:36, borderRadius:8, border:`1px solid ${C.border}`,
          background:"transparent", cursor:"pointer", color:"#333",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4,
        }}>
          <div style={{width:16,height:2,background:sidebarOpen?C.green:"#333",borderRadius:1,transition:"all 0.2s"}}/>
          <div style={{width:16,height:2,background:sidebarOpen?C.green:"#333",borderRadius:1,transition:"all 0.2s"}}/>
          <div style={{width:16,height:2,background:sidebarOpen?C.green:"#333",borderRadius:1,transition:"all 0.2s"}}/>
        </button>
        <div style={{fontFamily:"'Orbitron',sans-serif", fontSize:18, fontWeight:600, color:"#1a1a2e", letterSpacing:2}}>
          SequenceAlignment
        </div>
      </div>
      <div style={{fontSize:11, color:C.muted, display:"flex", alignItems:"center", gap:6}}>
        <span>demo v1.4</span>
      </div>
    </header>
  );
}