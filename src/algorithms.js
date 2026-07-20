export function needlemanWunsch(seq1, seq2, match = 2, mismatch = -1, gap = -2) {
  const m = seq1.length, n = seq2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i * gap;
  for (let j = 0; j <= n; j++) dp[0][j] = j * gap;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const s = seq1[i-1] === seq2[j-1] ? match : mismatch;
      dp[i][j] = Math.max(dp[i-1][j-1]+s, dp[i-1][j]+gap, dp[i][j-1]+gap);
    }
  let a1 = "", a2 = "", i = m, j = n;
  while (i > 0 || j > 0) {
    const s = i>0&&j>0 ? (seq1[i-1]===seq2[j-1]?match:mismatch) : 0;
    if (i>0&&j>0&&dp[i][j]===dp[i-1][j-1]+s) { a1=seq1[i-1]+a1; a2=seq2[j-1]+a2; i--; j--; }
    else if (i>0&&dp[i][j]===dp[i-1][j]+gap) { a1=seq1[i-1]+a1; a2="-"+a2; i--; }
    else { a1="-"+a1; a2=seq2[j-1]+a2; j--; }
  }
  return { matrix: dp, aligned1: a1, aligned2: a2, score: dp[m][n] };
}

export function smithWaterman(seq1, seq2, match = 2, mismatch = -1, gap = -2) {
  const m = seq1.length, n = seq2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  let maxScore = 0, maxI = 0, maxJ = 0;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const s = seq1[i-1]===seq2[j-1]?match:mismatch;
      dp[i][j] = Math.max(0, dp[i-1][j-1]+s, dp[i-1][j]+gap, dp[i][j-1]+gap);
      if (dp[i][j] > maxScore) { maxScore=dp[i][j]; maxI=i; maxJ=j; }
    }
  let a1="", a2="", i=maxI, j=maxJ;
  while (i>0&&j>0&&dp[i][j]!==0) {
    const s=seq1[i-1]===seq2[j-1]?match:mismatch;
    if (dp[i][j]===dp[i-1][j-1]+s){a1=seq1[i-1]+a1;a2=seq2[j-1]+a2;i--;j--;}
    else if(dp[i][j]===dp[i-1][j]+gap){a1=seq1[i-1]+a1;a2="-"+a2;i--;}
    else{a1="-"+a1;a2=seq2[j-1]+a2;j--;}
  }
  return { matrix: dp, aligned1: a1, aligned2: a2, score: maxScore };
}

export function calcStats(a1, a2) {
  let matches=0, mismatches=0, gaps=0;
  for (let i=0;i<a1.length;i++) {
    if(a1[i]==="-"||a2[i]==="-") gaps++;
    else if(a1[i]===a2[i]) matches++;
    else mismatches++;
  }
  return { matches, mismatches, gaps, pct: ((matches/a1.length)*100).toFixed(1) };
}

export const clean = s => s.toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g,"");
