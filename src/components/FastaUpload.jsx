import { useRef, useState } from "react";
import { C } from "../constants";
import { parseFasta } from "../data";

export default function FastaUpload({ onLoad, seqNum }) {
  const ref = useRef();
  const [info, setInfo] = useState("");

  const handle = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const { name, seq } = parseFasta(ev.target.result);
      onLoad(seq.slice(0, 60));
      setInfo(`✓ ${file.name} · ${name.slice(0,40)} (${seq.length} aa)`);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{marginTop:8}}>
      <input ref={ref} type="file" accept=".fasta,.fa,.txt" onChange={handle} style={{display:"none"}}/>
      <button onClick={()=>ref.current.click()} style={{
        width:"100%", padding:"8px", borderRadius:8,
        border:`1px dashed rgba(255,255,255,0.15)`,
        background:"transparent", color:C.muted,
        cursor:"pointer", fontFamily:"'IBM Plex Mono',monospace", fontSize:11
      }}>
        📂 Upload .fasta datoteke za sekvencu {seqNum}
      </button>
      {info && <div style={{fontSize:10, color:C.green, marginTop:4}}>{info}</div>}
    </div>
  );
}
