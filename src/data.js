// Dohvat po točnom UniProt ID-u (npr. P04637)
export async function fetchUniProt(id) {
  const res = await fetch(
    `https://rest.uniprot.org/uniprotkb/${id.trim().toUpperCase()}.json`
  );
  if (!res.ok) throw new Error(`ID "${id}" nije pronađen u UniProt bazi.`);
  
  const data = await res.json();
  
  const name = data.proteinDescription?.recommendedName?.fullName?.value
    ?? data.proteinDescription?.submittedName?.[0]?.fullName?.value
    ?? "Nepoznat protein";
  
  const gene = data.genes?.[0]?.geneName?.value ?? "";
  const organism = data.organism?.scientificName ?? "";
  
  // Sekvenca je u data.sequence.value
  const seq = data.sequence?.value ?? "";
  
  return {
    name: `${gene} · ${name} · ${organism}`,
    seq
  };
}

// Pretraga po imenu — vraća listu rezultata
export async function searchUniProt(query) {
  const res = await fetch(
    `https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(query)}+AND+organism_id:9606+AND+reviewed:true&format=json&size=8`
  );
  if (!res.ok) throw new Error("Greška pri pretraživanju.");
  
  const data = await res.json();
  
  return data.results.map(entry => ({
    id: entry.primaryAccession,
    name: entry.proteinDescription?.recommendedName?.fullName?.value
       ?? entry.proteinDescription?.submittedName?.[0]?.fullName?.value
       ?? "?",
    gene: entry.genes?.[0]?.geneName?.value ?? "",
    organism: entry.organism?.scientificName ?? "",
    length: entry.sequence?.length ?? 0,
    seq: entry.sequence?.value ?? ""
  }));
}

export const MEDICAL_EXAMPLES = [
  {
    label: "TP53 — Rak",
    ref:     "ATGGCGCCCGAACAGGGAC",
    patient: "ATGGCGCCCAAACAGGGAC",
    gene: "TP53",
    disease: "Karcinom (rak dojke, pluća, debelog crijeva)",
    pos: 10, from: "G", to: "A",
    effect: "Gen TP53 kodira protein p53 — 'čuvar genoma'. Mutacija G→A na poziciji 10 deaktivira p53, stanice gube kontrolu rasta i postaju kancerogene.",
    severity: "visok",
  },
  {
    label: "BRCA1 — Rak dojke",
    ref:     "ATGCCTATTGGATCCAAAG",
    patient: "ATGCCTATTGGATCCAAAT",
    gene: "BRCA1",
    disease: "Nasljedni rak dojke i jajnika",
    pos: 19, from: "G", to: "T",
    effect: "BRCA1 gen sudjeluje u popravku DNA. Mutacija G→T smanjuje sposobnost stanice da ispravi greške u DNA, što povećava rizik od raka dojke za 70%.",
    severity: "visok",
  },
  {
    label: "KRAS — Rak gušterače",
    ref:     "ATGACTGAATATAAACTTG",
    patient: "ATGACTGAATATAAACTTC",
    gene: "KRAS",
    disease: "Karcinom gušterače i pluća",
    pos: 19, from: "G", to: "C",
    effect: "KRAS gen kontrolira dijeljenje stanica. Mutacija G→C uzrokuje stalnu aktivaciju signala za rast — stanice se dijele nekontrolirano.",
    severity: "visok",
  },
];

export function parseFasta(text) {
  const lines = text.trim().split("\n");
  let name = "", seq = "";
  for (const line of lines) {
    if (line.startsWith(">")) name = line.slice(1).trim();
    else seq += line.trim().toUpperCase();
  }
  return { name, seq };
}

export function detectMutations(a1, a2) {
  const muts = [];
  let refPos = 0;
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== "-") refPos++;
    if (a1[i] !== "-" && a2[i] !== "-" && a1[i] !== a2[i]) {
      muts.push({ pos: refPos, from: a1[i], to: a2[i], alignPos: i });
    }
  }
  return muts;
}