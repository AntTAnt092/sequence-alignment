import { useState, useEffect } from "react";
import { C, s } from "../constants";
import { fetchUniProt, searchUniProt } from "../data";

export default function UniProtPanel({ onLoad, seqNum }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [loaded, setLoaded] = useState("");
  const [lastSeq, setLastSeq] = useState(null);   // cijela dohvaćena sekvenca
  const [lastName, setLastName] = useState("");
  const [rangeStart, setRangeStart] = useState(0); // od (0-indeksirano)
  const [rangeEnd, setRangeEnd] = useState(60);    // do (isključivo)

  const isUniProtId = (q) => /^[A-Z][0-9][A-Z0-9]{3}[0-9]$/.test(q.trim());
  const fullLen = lastSeq ? lastSeq.length : 200;

  // Kad se raspon ili sekvenca promijene — izreži i pošalji podniz
  useEffect(() => {
    if (!lastSeq) return;
    const sliced = lastSeq.slice(rangeStart, rangeEnd);
    onLoad(sliced);
    setLoaded(`✓ ${lastName} — aa ${rangeStart + 1}–${rangeEnd} (${sliced.length} od ${lastSeq.length})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeStart, rangeEnd, lastSeq]);

  const loadSeq = (seq, name) => {
    setLastSeq(seq);
    setLastName(name);
    setRangeStart(0);
    setRangeEnd(Math.min(60, seq.length));   // default: prvih 60
  };

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(""); setResults([]); setLoaded("");
    try {
      if (isUniProtId(query)) {
        const { name, seq } = await fetchUniProt(query);
        loadSeq(seq, name);
      } else {
        const hits = await searchUniProt(query);
        if (hits.length === 0) throw new Error("Nema rezultata.");
        setResults(hits);
      }
    } catch (e) {
      setError("❌ " + e.message);
    }
    setLoading(false);
  };

  const pick = (hit) => {
    loadSeq(hit.seq, `${hit.gene} · ${hit.name}`);
    setResults([]); setQuery(hit.id);
  };

  const step = fullLen > 800 ? 10 : fullLen > 300 ? 5 : 1;

  // Sprječava da se ručke prekriže (min razmak = 5 aa)
  const onStart = (val) => setRangeStart(Math.min(val, rangeEnd - 5));
  const onEnd   = (val) => setRangeEnd(Math.max(val, rangeStart + 5));

  const pctStart = (rangeStart / fullLen) * 100;
  const pctEnd   = (rangeEnd / fullLen) * 100;
  const selLen = rangeEnd - rangeStart;

  return (
    <div style={{ marginTop: 8, background: "rgba(91,184,255,0.04)",
      border: `1px solid rgba(91,184,255,0.15)`, borderRadius: 10, padding: 12 }}>

      <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.blue, marginBottom: 8 }}>
        UNIPROT — pretraga po imenu ili ID-u
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          placeholder="npr. TP53  ili  hemoglobin  ili  P04637"
          style={{ ...s.input, fontSize: 12, padding: "8px 12px", flex: 1 }}
        />
        <button onClick={search} disabled={loading} style={{
          padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.blue}`,
          background: loading ? "transparent" : `rgba(91,184,255,0.1)`,
          color: C.blue, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'IBM Plex Mono',monospace", fontSize: 11
        }}>
          {loading ? "⟳" : "↓ Traži"}
        </button>
      </div>

      {/* Dvostruki (range) slider — od / do */}
      <div style={{ marginBottom: 8, opacity: lastSeq ? 1 : 0.4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: C.muted }}>Raspon (od–do)</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.blue }}>
            {lastSeq ? `aa ${rangeStart + 1}–${rangeEnd} · ${selLen} aa` : "—"}
          </span>
        </div>

        {/* Dvije ručke preklopljene preko iste trake */}
        <div style={{ position: "relative", height: 24 }}>
          {/* Pozadinska traka */}
          <div style={{ position: "absolute", top: 10, left: 0, right: 0, height: 4,
            borderRadius: 2, background: "rgba(0,0,0,0.1)" }} />
          {/* Odabrani raspon (istaknut) */}
          <div style={{ position: "absolute", top: 10, height: 4, borderRadius: 2,
            background: C.blue, left: `${pctStart}%`, width: `${pctEnd - pctStart}%` }} />

          {/* START ručka */}
          <input type="range" min={0} max={fullLen} step={step} value={rangeStart}
            disabled={!lastSeq}
            onChange={e => onStart(Number(e.target.value))}
            style={rangeInputStyle} />
          {/* END ručka */}
          <input type="range" min={0} max={fullLen} step={step} value={rangeEnd}
            disabled={!lastSeq}
            onChange={e => onEnd(Number(e.target.value))}
            style={rangeInputStyle} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: C.dim, marginTop: 2 }}>
          <span>1</span>
          <span>{lastSeq ? `${fullLen} aa (cijeli protein)` : "učitaj protein"}</span>
        </div>
      </div>

      {selLen > 400 && (
        <div style={{ fontSize: 9, color: "#c05000", marginBottom: 6, lineHeight: 1.5 }}>
          ⚠ Odabir od {selLen} aa — matrica može biti spora za prikaz.
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 6 }}>
          {results.map(hit => (
            <button key={hit.id} onClick={() => pick(hit)} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`,
              background: "transparent", cursor: "pointer", textAlign: "left",
              fontFamily: "'IBM Plex Mono',monospace"
            }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.blue }}>{hit.gene || hit.id}</span>
                <span style={{ fontSize: 10, color: C.muted, marginLeft: 8 }}>{hit.name.slice(0, 45)}</span>
              </div>
              <span style={{ fontSize: 10, color: C.dim }}>{hit.length} aa</span>
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["TP53", "BRCA1", "insulin", "hemoglobin", "EGFR"].map(ex => (
          <button key={ex} onClick={() => { setQuery(ex); }} style={{
            fontSize: 10, padding: "3px 8px", borderRadius: 6,
            border: `1px solid ${C.border}`, background: "transparent",
            color: C.muted, cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace"
          }}>{ex}</button>
        ))}
      </div>

      {loaded && <div style={{ fontSize: 10, color: C.green, marginTop: 6 }}>{loaded}</div>}
      {error && <div style={{ fontSize: 10, color: C.red, marginTop: 6 }}>{error}</div>}
    </div>
  );
}

// Stil za preklopljene range inpute — providni, samo ručka hvata klik
const rangeInputStyle = {
  position: "absolute",
  top: 0, left: 0,
  width: "100%",
  height: 24,
  margin: 0,
  background: "transparent",
  pointerEvents: "none",
  WebkitAppearance: "none",
  appearance: "none",
  accentColor: "#1a6eb5",
};