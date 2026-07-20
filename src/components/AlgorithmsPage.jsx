import { C, s } from "../constants";

export default function AlgorithmsPage({ onBack }) {
  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:45,overflowY:"auto",padding:"32px 24px"}}>
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <button onClick={onBack} style={{
          display:"flex",alignItems:"center",gap:8,marginBottom:28,
          background:"#fff",border:`1px solid ${C.border}`,borderRadius:8,
          padding:"8px 16px",color:C.muted,cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:12,
          boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
        }}>← Natrag na aplikaciju</button>

        <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');`}</style>
        <div style={{fontSize:10,letterSpacing:"0.3em",color:C.muted,marginBottom:8}}>DOKUMENTACIJA</div>
        <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:24,fontWeight:600,marginBottom:4,color:"#1a1a2e",letterSpacing:2}}>
          O algoritmima
        </h1>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.8,marginBottom:32}}>
          
        </p>

        {[
          { title:"Needleman-Wunsch", tag:"Globalno", col:C.green,
            rows:[
              [],
              [],
              [],
              [],
              [],
            ]
          },
          { title:"Smith-Waterman", tag:"Lokalno", col:C.blue,
            rows:[
              [],
              [],
              [],
              [],
              [],
            ]
          },
        ].map(alg=>(
          <div key={alg.title} style={{...s.card, marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:alg.col,marginBottom:4}}>{alg.title}</div>
                <div style={{fontSize:11,color:C.muted}}>{alg.tag}</div>
              </div>
              <span style={{fontSize:11,padding:"4px 10px",borderRadius:6,background:"#f0f2f5",color:C.muted,fontFamily:"'IBM Plex Mono',monospace"}}>O(n×m)</span>
            </div>
            {alg.rows.map(([t,d])=>(
              <div key={t} style={{borderTop:`1px solid ${C.border}`,padding:"12px 0",display:"flex",gap:16}}>
                <div style={{fontSize:11,fontWeight:700,color:alg.col,minWidth:120,flexShrink:0}}>{t}</div>
                <div style={{fontSize:12,color:"#444",lineHeight:1.7}}>{d}</div>
              </div>
            ))}
          </div>
        ))}

        <div style={{...s.card}}>
          <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:16}}>Usporedba algoritama</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0}}>
            {[
              [],
              [],
              [],
              [],
              [],
              [],
              [],
            ].map((row,i)=>(
              row.map((cell,j)=>(
                <div key={j} style={{
                  padding:"10px 12px",
                  borderBottom:`1px solid ${C.border}`,
                  borderRight:j<2?`1px solid ${C.border}`:"none",
                  fontSize:11,
                  fontWeight:i===0||j===0?700:400,
                  color:j===0?C.muted:j===1?C.green:C.blue,
                  background:i===0?"#f8f9fa":"transparent",
                }}>{cell}</div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}