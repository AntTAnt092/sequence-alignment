import { detectMutations } from "../data";

export default function MutationPanel({ a1, a2, example }) {
  const muts = detectMutations(a1, a2);
  if (!example || muts.length === 0) return null;
  const orange = "#c05000";

  return (
    <div style={{marginTop:14, background:"rgba(200,80,0,0.05)", border:"1px solid rgba(200,80,0,0.2)", borderRadius:12, padding:16}}>
      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:12}}>
        <span style={{fontSize:16}}>⚠</span>
        <span style={{fontSize:12, fontWeight:700, color:orange, letterSpacing:"0.1em"}}>MUTACIJA DETEKTIRANA</span>
      </div>
      {muts.map((m,i) => (
        <div key={i} style={{marginBottom:10}}>
          <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:6}}>
            <span style={{background:"rgba(200,80,0,0.1)", color:orange, fontSize:11, padding:"3px 10px", borderRadius:6, fontWeight:700}}>
              Pozicija {m.pos}
            </span>
            <span style={{background:"rgba(10,138,92,0.1)", color:"#0a8a5c", fontSize:11, padding:"3px 10px", borderRadius:6}}>
              Referentni: {m.from}
            </span>
            <span style={{background:"rgba(192,57,43,0.1)", color:"#c0392b", fontSize:11, padding:"3px 10px", borderRadius:6}}>
              Pacijent: {m.to}
            </span>
            <span style={{background:"rgba(0,0,0,0.05)", color:"rgba(0,0,0,0.5)", fontSize:11, padding:"3px 10px", borderRadius:6}}>
              {m.from}→{m.to} supstitucija
            </span>
          </div>
        </div>
      ))}
      <div style={{borderTop:"1px solid rgba(200,80,0,0.15)", paddingTop:12, marginTop:4}}>
        <div style={{fontSize:11, color:orange, marginBottom:4, fontWeight:700}}>Gen: {example.gene} · {example.disease}</div>
        <div style={{fontSize:11, color:"rgba(0,0,0,0.5)", lineHeight:1.8}}>{example.effect}</div>
      </div>
    </div>
  );
}