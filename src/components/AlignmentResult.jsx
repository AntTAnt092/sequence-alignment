import { C } from "../constants";
import { calcStats } from "../algorithms";

export default function AlignmentResult({ a1, a2, start1 = 1, end1, start2 = 1, end2 }) {
  const stats = calcStats(a1, a2);
  const BLOCK = 60;              // znakova po redu
  const charSize = 15, charFont = 11;

  // Ako end pozicije nisu proslijeđene, izračunaj iz broja stvarnih znakova
  const realLen1 = a1.replace(/-/g, "").length;
  const realLen2 = a2.replace(/-/g, "").length;
  const e1 = end1 ?? (start1 + realLen1 - 1);
  const e2 = end2 ?? (start2 + realLen2 - 1);

  // Razbij poravnanje u blokove od BLOCK znakova
  const blocks = [];
  for (let i = 0; i < a1.length; i += BLOCK) {
    blocks.push({ start: i, s1: a1.slice(i, i + BLOCK), s2: a2.slice(i, i + BLOCK) });
  }

  const cellStyle = (isGap, isMatch) => ({
    width: charSize, height: charSize,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 3, fontSize: charFont, fontWeight: 700, flexShrink: 0,
    background: isGap ? "rgba(0,0,0,0.05)" : isMatch ? "rgba(10,138,92,0.12)" : "rgba(192,57,43,0.12)",
    color: isGap ? C.dim : isMatch ? C.green : C.red,
  });

  return (
    <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginTop: 12 }}>

      {/* Zaglavlje s rasponom pozicija u proteinu */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12, fontSize: 11 }}>
        <span style={{ color: C.green, fontWeight: 700 }}>S1: aa {start1}–{e1}</span>
        <span style={{ color: C.blue, fontWeight: 700 }}>S2: aa {start2}–{e2}</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        {blocks.map((b, bi) => {
          // Pozicija u originalnom proteinu na početku ovog bloka
          const real1Before = a1.slice(0, b.start).replace(/-/g, "").length;
          const real2Before = a2.slice(0, b.start).replace(/-/g, "").length;
          const pos1 = start1 + real1Before;
          const pos2 = start2 + real2Before;

          return (
            <div key={bi} style={{ marginBottom: 14, minWidth: "max-content" }}>
              {/* S1 red */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 10, color: C.green, width: 22, flexShrink: 0, fontWeight: 700 }}>S1</span>
                <span style={{ fontSize: 9, color: C.dim, width: 40, textAlign: "right", flexShrink: 0 }}>{pos1}</span>
                <div style={{ display: "flex", gap: 1 }}>
                  {b.s1.split("").map((ch, k) => {
                    const isGap = ch === "-";
                    const isMatch = !isGap && b.s2[k] === ch && b.s2[k] !== "-";
                    return <span key={k} style={cellStyle(isGap, isMatch)}>{ch}</span>;
                  })}
                </div>
              </div>

              {/* Traka podudaranja */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ width: 22, flexShrink: 0 }} />
                <span style={{ width: 40, flexShrink: 0 }} />
                <div style={{ display: "flex", gap: 1 }}>
                  {b.s1.split("").map((ch, k) => {
                    const m = ch !== "-" && b.s2[k] === ch;
                    return (
                      <span key={k} style={{ width: charSize, textAlign: "center", fontSize: charFont, color: C.green }}>
                        {m ? "|" : " "}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* S2 red */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: C.blue, width: 22, flexShrink: 0, fontWeight: 700 }}>S2</span>
                <span style={{ fontSize: 9, color: C.dim, width: 40, textAlign: "right", flexShrink: 0 }}>{pos2}</span>
                <div style={{ display: "flex", gap: 1 }}>
                  {b.s2.split("").map((ch, k) => {
                    const isGap = ch === "-";
                    const isMatch = !isGap && b.s1[k] === ch && b.s1[k] !== "-";
                    return <span key={k} style={cellStyle(isGap, isMatch)}>{ch}</span>;
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "Match", val: stats.matches, color: C.green },
          { label: "Mismatch", val: stats.mismatches, color: C.red },
          { label: "Gap", val: stats.gaps, color: C.dim },
        ].map(x => (
          <div key={x.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: x.color }} />
            <span style={{ fontSize: 11, color: C.muted }}>{x.label}: <strong style={{ color: "#1a1a2e" }}>{x.val}</strong></span>
          </div>
        ))}
        <span style={{ marginLeft: "auto", color: C.green, fontWeight: 700, fontSize: 13 }}>{stats.pct}% sličnost</span>
      </div>

      <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 3, width: `${stats.pct}%`, background: `linear-gradient(90deg,${C.green},${C.blue})`, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}