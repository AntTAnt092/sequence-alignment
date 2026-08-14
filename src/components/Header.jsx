import { C, s } from "../constants";

export default function Header() {
  return (
    <header style={s.header}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');
      `}</style>
      <div style={{display:"flex", alignItems:"center", gap:16}}>
        <div style={{fontFamily:"'Orbitron',sans-serif", fontSize:20, fontWeight:600, color:"#1a1a2e", letterSpacing:2}}>
          SequenceAlignment
        </div>
      </div>
      <div style={{fontSize:11, color:C.muted, display:"flex", alignItems:"center", gap:6}}>
        <span>demo v1.4</span>
      </div>
    </header>
  );
}