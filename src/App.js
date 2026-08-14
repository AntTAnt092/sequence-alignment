import { useState, useEffect, useRef } from "react";
import { C, s } from "./constants";
import { needlemanWunsch, smithWaterman, clean } from "./algorithms";
import { MEDICAL_EXAMPLES } from "./data";
import Header from "./components/Header";
import Matrix from "./components/Matrix";
import AlignmentResult from "./components/AlignmentResult";
import MutationPanel from "./components/MutationPanel";
import UniProtPanel from "./components/UniProtPanel";
import FastaUpload from "./components/FastaUpload";

const MATRIX_LIMIT = 110; // preko ove duljine matrica se ne prikazuje

export default function App() {
  const [seq1, setSeq1] = useState("ATGCAT");
  const [seq2, setSeq2] = useState("ATGTCAT");
  const [algo, setAlgo] = useState("NW");
  const [matchPts, setMatchPts] = useState(2);
  const [mmPts, setMmPts] = useState(-1);
  const [gapPts, setGapPts] = useState(-2);
  const [result, setResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showAlignment, setShowAlignment] = useState(false);
  const [activeMedical, setActiveMedical] = useState(null);
  const animRef = useRef(null);
  const resultRef = useRef(null);

  const loadMedical = (ex) => {
    setSeq1(ex.ref);
    setSeq2(ex.patient);
    setActiveMedical(ex);
    setAlgo("NW");
    setResult(null);
    setShowResult(false);
  };

  const run = () => {
    const s1=clean(seq1), s2=clean(seq2);
    if(!s1||!s2) return;
    clearInterval(animRef.current);
    setShowResult(false); setRevealCount(0); setAnimating(true);
    setShowMatrix(false); setShowAlignment(false);

    const fn = algo==="NW" ? needlemanWunsch : smithWaterman;
    const res = fn(s1, s2, matchPts, mmPts, gapPts);
    setResult(res);

    if(compareMode){
      const fn2 = algo==="NW" ? smithWaterman : needlemanWunsch;
      setCompareResult(fn2(s1, s2, matchPts, mmPts, gapPts));
    } else {
      setCompareResult(null);
    }

    const total=(s1.length+1)*(s2.length+1);
    const step=Math.max(1,Math.floor(total/50));
    let count=0;
    animRef.current=setInterval(()=>{
      count+=step;
      setRevealCount(count);
      if(count>=total){
        clearInterval(animRef.current);
        setRevealCount(total);
        setAnimating(false);
        setTimeout(()=>{
          setShowResult(true);
          resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
        },300);
      }
    },35);
  };

  useEffect(()=>()=>clearInterval(animRef.current),[]);
  const fmt = v => v>0?`+${v}`:String(v);

  // Duljina najduže sekvence — koristi se za odluku o prikazu matrice
  const maxSeqLen = Math.max(clean(seq1).length, clean(seq2).length);
  const matrixTooBig = maxSeqLen > MATRIX_LIMIT;

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600;700&family=Syne:wght@700;800;900&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        input:focus { border-color: rgba(10,138,92,0.5) !important; }
        ::-webkit-scrollbar { width:10px; height:10px; }
        ::-webkit-scrollbar-track { background:#e8eaed; border-radius:6px; }
        ::-webkit-scrollbar-thumb { background:#aab0bb; border-radius:6px; border: 2px solid #e8eaed; }
        ::-webkit-scrollbar-thumb:hover { background:#888; }
        ::-webkit-scrollbar-corner { background:#e8eaed; }

        input[type=range] { pointer-events: none; }
        input[type=range]::-webkit-slider-thumb {
          pointer-events: auto;
          -webkit-appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: #1a6eb5; cursor: pointer;
          border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        input[type=range]::-moz-range-thumb {
          pointer-events: auto;
          width: 16px; height: 16px; border-radius: 50%;
          background: #1a6eb5; cursor: pointer; border: 2px solid #fff;
        }
      `}</style>

      <Header/>

      <main style={s.main}>

        {/* Input card */}
        <div style={{...s.card, width:"100%"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <span style={{...s.label,margin:0}}>Unos sekvenci</span>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["DNA","AGTACGCA","TATGC"],["Protein","HEAGAWGHEE","PAWHEAE"]].map(([lbl,e1,e2])=>(
                <button key={lbl} onClick={()=>{setSeq1(e1);setSeq2(e2);setActiveMedical(null);}} style={{
                  fontSize:11,padding:"6px 12px",borderRadius:8,border:`1px solid ${C.border}`,
                  background:"transparent",color:C.muted,cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace"
                }}>{lbl} primjer</button>
              ))}
            </div>
          </div>

          {/* Medical examples */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,letterSpacing:"0.2em",color:"#ffaa44",marginBottom:8}}>MEDICINSKI PRIMJERI — DETEKCIJA MUTACIJA</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {MEDICAL_EXAMPLES.map((ex)=>(
                <button key={ex.gene} onClick={()=>loadMedical(ex)} style={{
                  fontSize:11,padding:"7px 14px",borderRadius:8,
                  border:`1px solid ${activeMedical?.gene===ex.gene?"rgba(255,150,50,0.7)":C.border}`,
                  background:activeMedical?.gene===ex.gene?"rgba(255,100,50,0.1)":"transparent",
                  color:activeMedical?.gene===ex.gene?"#ffaa44":C.muted,
                  cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",transition:"all 0.2s"
                }}>⚠ {ex.label}</button>
              ))}
            </div>
          </div>

          {/* Sequence inputs */}
          <div style={s.row}>
            {[["Sekvenca 1",seq1,setSeq1,C.green,activeMedical?"Referentni genom":null],
              ["Sekvenca 2",seq2,setSeq2,C.blue,activeMedical?"Sekvenca pacijenta":null]
            ].map(([lbl,val,set,col,sublbl])=>(
              <div key={lbl}>
                <label style={{...s.label,color:col}}>
                  {lbl}
                  {sublbl && <span style={{color:"#ffaa44",marginLeft:8,fontSize:9}}>({sublbl})</span>}
                </label>
                <input value={val} onChange={e=>{set(e.target.value.toUpperCase());setActiveMedical(null);}} style={s.input} placeholder="npr. ATGCAT"/>
              </div>
            ))}
          </div>

          {/* UniProt + FASTA */}
          <div style={s.row}>
            <div>
              <UniProtPanel seqNum={1} onLoad={v=>{setSeq1(v);setActiveMedical(null);}}/>
              <FastaUpload seqNum={1} onLoad={v=>{setSeq1(v);setActiveMedical(null);}}/>
            </div>
            <div>
              <UniProtPanel seqNum={2} onLoad={v=>{setSeq2(v);setActiveMedical(null);}}/>
              <FastaUpload seqNum={2} onLoad={v=>{setSeq2(v);setActiveMedical(null);}}/>
            </div>
          </div>

          {/* Algorithm selector */}
          <div style={{marginTop:20}}>
            <label style={s.label}>Algoritam</label>
            <div style={s.algoRow}>
              {[["NW","Needleman-Wunsch","Globalno poravnanje",C.green],
                ["SW","Smith-Waterman","Lokalno poravnanje",C.blue]
              ].map(([id,name,desc,col])=>(
                <button key={id} onClick={()=>setAlgo(id)} style={s.algoBtn(compareMode||algo===id,col)}>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{name}</div>
                  <div style={{fontSize:10,opacity:0.6}}>{desc}</div>
                  {compareMode && <div style={{fontSize:9,marginTop:4,opacity:0.5}}>uključeno</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div style={{marginTop:20}}>
            <label style={s.label}>Parametri bodovanja</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[["Match",matchPts,setMatchPts,C.green],
                ["Mismatch",mmPts,setMmPts,C.red],
                ["Gap",gapPts,setGapPts,C.blue]
              ].map(([lbl,val,set,col])=>(
                <div key={lbl} style={s.paramBox}>
                  <div style={{fontSize:10,color:col,marginBottom:8,letterSpacing:"0.15em"}}>{lbl.toUpperCase()}</div>
                  <div style={s.paramRow}>
                    <button onClick={()=>set(v=>v-1)} style={s.paramBtn}>−</button>
                    <span style={{flex:1,textAlign:"center",fontWeight:700,fontSize:15}}>{fmt(val)}</span>
                    <button onClick={()=>set(v=>v+1)} style={s.paramBtn}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:20,flexWrap:"wrap",gap:12}}>
            <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <button onClick={()=>setCompareMode(v=>!v)} style={s.toggle(compareMode)}>
                <div style={s.toggleDot(compareMode)}/>
              </button>
              <span style={{fontSize:12,color:C.muted}}>Usporedni mod (NW vs SW)</span>
            </label>
            <button onClick={run} disabled={animating} style={s.runBtn(animating)}>
              {animating?"⟳ Računam...":"▶ Pokreni"}
            </button>
          </div>
        </div>

        {/* Results — ista širina kao input kartica */}
        {result && (
          <div ref={resultRef} style={{display:"grid",gridTemplateColumns:"1fr",gap:20,width:"100%"}}>
            {[
              {res:result, label:algo==="NW"?"Needleman-Wunsch":"Smith-Waterman", isMain:true},
              ...(compareMode&&compareResult?[{res:compareResult,label:algo==="NW"?"Smith-Waterman":"Needleman-Wunsch",isMain:false}]:[])
            ].map(({res,label,isMain})=>(
              <div key={label} style={s.card}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:isMain?C.green:C.blue}}>{label}</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:2}}>{label.includes("Needle")?"Globalno":"Lokalno"} poravnanje</div>
                  </div>
                  <div style={{padding:"6px 14px",borderRadius:20,background:`rgba(${isMain?"79,255,176":"91,184,255"},0.1)`,border:`1px solid ${isMain?C.green:C.blue}`,color:isMain?C.green:C.blue,fontSize:12,fontWeight:700}}>
                    Score: {res.score}
                  </div>
                </div>

                {/* Matrix collapsible */}
                <div style={{background:"rgba(0,0,0,0.3)",borderRadius:12,border:`1px solid ${C.border}`,marginBottom:12,overflow:"hidden"}}>
                  <button onClick={()=>setShowMatrix(v=>!v)} style={{
                    width:"100%",padding:"12px 16px",display:"flex",alignItems:"center",
                    justifyContent:"space-between",background:"transparent",border:"none",
                    cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",
                  }}>
                    <span style={{fontSize:9,letterSpacing:"0.25em",color:C.dim}}>MATRICA DINAMIČKOG PROGRAMIRANJA</span>
                    <span style={{fontSize:11,padding:"4px 12px",borderRadius:6,border:`1px solid ${C.border}`,
                      background:showMatrix?"rgba(79,255,176,0.1)":"rgba(255,255,255,0.04)",
                      color:showMatrix?C.green:C.muted,transition:"all 0.2s"}}>
                      {showMatrix?"▲ Sakrij matricu":"▼ Prikaži matricu"}
                    </span>
                  </button>
                  {showMatrix && (
                    <div style={{padding:"0 12px 12px"}}>
                      {matrixTooBig ? (
                        <div style={{padding:"20px 16px",textAlign:"center",fontSize:12,color:C.muted,lineHeight:1.7}}>
                          ⚠ Matrica se ne prikazuje za sekvence duže od {MATRIX_LIMIT} aa<br/>
                          <span style={{fontSize:11,color:C.dim}}>
                            Trenutna duljina: {maxSeqLen} aa · matrica bi imala {(clean(seq1).length * clean(seq2).length / 1000).toFixed(0)}k+ ćelija.
                            Skratite raspon sekvence za prikaz matrice.
                          </span>
                        </div>
                      ) : (
                        <Matrix matrix={res.matrix} seq1={clean(seq1)} seq2={clean(seq2)} revealCount={isMain?revealCount:res.matrix.length*res.matrix[0].length}/>
                      )}
                    </div>
                  )}
                </div>

                {/* Alignment collapsible */}
                {showResult && (
                  <div style={{background:"rgba(0,0,0,0.3)",borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                    <button onClick={()=>setShowAlignment(v=>!v)} style={{
                      width:"100%",padding:"12px 16px",display:"flex",alignItems:"center",
                      justifyContent:"space-between",background:"transparent",border:"none",
                      cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",
                    }}>
                      <span style={{fontSize:9,letterSpacing:"0.25em",color:C.dim}}>REZULTAT PORAVNANJA</span>
                      <span style={{fontSize:11,padding:"4px 12px",borderRadius:6,border:`1px solid ${C.border}`,
                        background:showAlignment?"rgba(79,255,176,0.1)":"rgba(255,255,255,0.04)",
                        color:showAlignment?C.green:C.muted,transition:"all 0.2s"}}>
                        {showAlignment?"▲ Sakrij rezultat":"▼ Prikaži rezultat"}
                      </span>
                    </button>
                    {showAlignment && (
                      <div style={{padding:"0 12px 12px"}}>
                        <AlignmentResult a1={res.aligned1} a2={res.aligned2}
                          start1={res.start1} end1={res.end1} start2={res.start2} end2={res.end2}/>
                        {isMain && <MutationPanel a1={res.aligned1} a2={res.aligned2} example={activeMedical}/>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{borderTop:`1px solid ${C.border}`,padding:"16px 24px",textAlign:"center",fontSize:11,color:C.dim,marginTop:8}}>
        Sequence Alignment Tool · Algoritmi u Bioinformatici · Diplomski projekt
      </footer>
    </div>
  );
}