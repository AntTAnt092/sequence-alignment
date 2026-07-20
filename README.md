# 🧬 SequenceAlign

**Alat za poravnanje bioloških sekvenci** — interaktivna web aplikacija koja vizualizira algoritme **Needleman-Wunsch** i **Smith-Waterman** te detektira mutacije u DNA i proteinskim sekvencama.

> Diplomski projekt · Algoritmi u bioinformatici

---

## 🚀 Pokretanje

Za pokretanje aplikacije lokalno potreban je [Node.js](https://nodejs.org/) (verzija 16 ili novija).

### 1. Kloniraj repozitorij

```bash
git clone https://github.com/AntTAnt092/sequence-alignment.git
cd sequence-alignment
```

### 2. Instaliraj ovisnosti

```bash
npm install
```

### 3. Pokreni aplikaciju

```bash
npm start
```

Aplikacija se otvara na [http://localhost:3000](http://localhost:3000) i automatski se osvježava pri promjeni koda.

### Ostale naredbe

| Naredba | Opis |
|---------|------|
| `npm start` | Pokreće aplikaciju u razvojnom modu |
| `npm test` | Pokreće testove |
| `npm run build` | Gradi optimiziranu produkcijsku verziju u `build/` folder |

---

## ✨ Značajke

- **Dva algoritma poravnanja** — globalno (Needleman-Wunsch) i lokalno (Smith-Waterman)
- **Usporedni mod** — istovremeni prikaz oba algoritma na istim sekvencama
- **Vizualizacija matrice** — animirani prikaz punjenja matrice dinamičkog programiranja s istaknutim traceback putem
- **Heatmap za duge sekvence** — matrica se automatski prebacuje u kompaktni prikaz bojama za velike proteine
- **Detekcija mutacija** — automatsko pronalaženje supstitucija uz medicinski kontekst (TP53, BRCA1, KRAS)
- **UniProt integracija** — pretraga i dohvat pravih proteinskih sekvenci po imenu ili ID-u, izravno iz [UniProt](https://www.uniprot.org/) baze
- **Odabir raspona** — dvostruki slider za analizu odabranog dijela sekvence (od–do)
- **FASTA upload** — učitavanje sekvenci iz `.fasta` datoteka
- **Podesivi parametri** — match, mismatch i gap bodovanje

---

## 🧪 Kako se koristi

1. **Unesi sekvence** — ručno, kroz medicinske primjere, UniProt pretragu ili FASTA upload
2. **Odaberi algoritam** — Needleman-Wunsch ili Smith-Waterman (ili oba u usporednom modu)
3. **Podesi parametre** — bodovanje za match, mismatch i gap
4. **Pokreni** — aplikacija prikazuje matricu, poravnanje, statistiku sličnosti i detektirane mutacije

---

## 🔬 O algoritmima

### Needleman-Wunsch (globalno poravnanje)

Poravnava **cijele** dvije sekvence od početka do kraja. Koristi se kada su sekvence slične duljine i evolucijski srodne. Traceback kreće od donjeg desnog kuta matrice.

### Smith-Waterman (lokalno poravnanje)

Pronalazi **najsličniji podniz** unutar dviju sekvenci. Vrijednosti u matrici nikad ne padaju ispod nule, a traceback kreće od pozicije maksimalne vrijednosti. Osnova je alata poput BLAST-a.

Oba algoritma temelje se na **dinamičkom programiranju** i imaju vremensku složenost **O(n × m)**.

---

## 🗂️ Struktura projekta

```
src/
├── App.js                    # Glavna komponenta i upravljanje stanjem
├── algorithms.js             # NW i SW algoritmi, statistika
├── constants.js              # Boje i stilovi (light tema)
├── data.js                   # Medicinski primjeri, UniProt dohvat, FASTA parser
└── components/
    ├── Header.jsx            # Zaglavlje
    ├── Sidebar.jsx           # Bočni izbornik
    ├── Matrix.jsx            # Vizualizacija DP matrice
    ├── AlignmentResult.jsx   # Prikaz poravnanja u blokovima
    ├── MutationPanel.jsx     # Detekcija i opis mutacija
    ├── UniProtPanel.jsx      # UniProt pretraga i dohvat
    ├── FastaUpload.jsx       # Upload FASTA datoteka
    └── AlgorithmsPage.jsx    # Dokumentacija algoritama
```

---

## 🛠️ Tehnologije

- **React** — korisničko sučelje
- **Create React App** — build alat
- **UniProt REST API** — dohvat proteinskih sekvenci

---

## 📄 Licenca

Izrađeno u sklopu diplomskog rada *Algoritmi u bioinformatici*.