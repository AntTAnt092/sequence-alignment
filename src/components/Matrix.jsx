import { C } from "../constants";

export default function Matrix({ matrix, seq1, seq2, revealCount }) {
  const rows = matrix.length, cols = matrix[0].length;

  // Traceback put (isto kao prije)
  const pathSet = new Set();
  let pi = rows - 1, pj = cols - 1;
  pathSet.add(`${pi},${pj}`);
  while (pi > 0 || pj > 0) {
    const cands = [];
    if (pi > 0 && pj > 0) cands.push([pi - 1, pj - 1, matrix[pi - 1][pj - 1]]);
    if (pi > 0) cands.push([pi - 1, pj, matrix[pi - 1][pj]]);
    if (pj > 0) cands.push([pi, pj - 1, matrix[pi][pj - 1]]);
    const [ni, nj] = cands.reduce((a, b) => b[2] > a[2] ? b : a);
    pi = ni; pj = nj; pathSet.add(`${pi},${pj}`);
  }

  // Tri režima prikaza ovisno o duljini
  const isHeatmap = cols > 35;           // heatmap bez brojeva
  const cellSize = isHeatmap ? (cols > 70 ? 8 : 12) : (cols > 20 ? 28 : 42);
  const fontSize = cols > 20 ? 10 : 12;
  const showText = !isHeatmap;
  const showHeaders = !isHeatmap || cols <= 60;

  // Za heatmap: raspon vrijednosti da normaliziramo boje
  let minVal = Infinity, maxVal = -Infinity;
  if (isHeatmap) {
    for (const row of matrix) for (const v of row) {
      if (v < minVal) minVal = v;
      if (v > maxVal) maxVal = v;
    }
  }

  // Boja ćelije u heatmap režimu — od crvene (nisko) do plave (visoko)
  const heatColor = (val) => {
    const t = maxVal === minVal ? 0.5 : (val - minVal) / (maxVal - minVal);
    // t=0 → crvena, t=0.5 → svijetla, t=1 → plava
    if (t < 0.5) {
      const k = t * 2;                       // 0..1
      return `rgb(${253 - k * 45}, ${236 + k * 15}, ${234 + k * 15})`;
    } else {
      const k = (t - 0.5) * 2;               // 0..1
      return `rgb(${232 - k * 40}, ${244 - k * 20}, ${253})`;
    }
  };

  const cellStyle = (isPath, val, revealed, i, j) => {
    if (isHeatmap) {
      return {
        width: cellSize, height: cellSize,
        background: !revealed ? "#f0f2f5" : isPath ? C.green : heatColor(val),
        border: "none",
        flexShrink: 0,
        transition: "background 0.15s",
      };
    }
    return {
      width: cellSize, height: cellSize,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontFamily: "'IBM Plex Mono',monospace",
      border: `1px solid ${C.border}`, borderRadius: 4,
      background: !revealed ? "#f0f2f5" : isPath ? "rgba(10,138,92,0.12)" : val > 0 ? "#e8f4fd" : val < 0 ? "#fdecea" : "#f8f9fa",
      color: !revealed ? "transparent" : isPath ? C.green : val > 0 ? C.blue : val < 0 ? C.red : "rgba(0,0,0,0.4)",
      fontWeight: isPath ? 700 : 400,
      boxShadow: isPath && revealed ? `0 0 6px rgba(10,138,92,0.25)` : "none",
      transition: "all 0.15s",
      flexShrink: 0,
    };
  };

  const headerCellStyle = (color) => ({
    width: cellSize, height: cellSize,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: fontSize + 1, fontWeight: 700, color,
    fontFamily: "'IBM Plex Mono',monospace", flexShrink: 0,
  });

  return (
    <div>
      {isHeatmap && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: C.muted }}>
            Heatmap prikaz ({rows - 1}×{cols - 1}) — dijagonalna linija = dobra podudarnost
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <span style={{ fontSize: 9, color: C.red }}>nisko</span>
            <div style={{ width: 60, height: 8, borderRadius: 4, background: "linear-gradient(90deg,#fdecea,#e8f4fd,#1a6eb5)" }} />
            <span style={{ fontSize: 9, color: C.blue }}>visoko</span>
            <div style={{ width: 12, height: 8, borderRadius: 2, background: C.green, marginLeft: 8 }} />
            <span style={{ fontSize: 9, color: C.green }}>put</span>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 340, width: "100%" }}>
        <div style={{ display: "inline-block", minWidth: "max-content" }}>
          {showHeaders && (
            <div style={{ display: "flex" }}>
              <div style={{ width: cellSize, height: cellSize, flexShrink: 0 }} />
              {!isHeatmap && <div style={headerCellStyle(C.green)}>-</div>}
              {seq2.split("").map((ch, j) => (
                <div key={j} style={headerCellStyle(C.blue)}>{isHeatmap ? "" : ch}</div>
              ))}
            </div>
          )}
          {matrix.map((row, i) => (
            <div key={i} style={{ display: "flex" }}>
              {showHeaders && (
                <div style={headerCellStyle(C.green)}>{isHeatmap ? "" : (i === 0 ? "-" : seq1[i - 1])}</div>
              )}
              {row.map((val, j) => {
                const idx = i * cols + j;
                const revealed = idx < revealCount;
                return (
                  <div key={j} style={cellStyle(pathSet.has(`${i},${j}`), val, revealed, i, j)}>
                    {showText && revealed ? val : ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}