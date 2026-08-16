# 🧬 SequenceAlign

**Alat za poravnanje bioloških sekvenci** — interaktivna web aplikacija koja vizualizira algoritme **Needleman-Wunsch** i **Smith-Waterman** te detektira mutacije u DNA i proteinskim sekvencama.

> Diplomski projekt · Algoritmi u bioinformatici

---

## Pokretanje

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

## Značajke

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

## Kako se koristi

1. **Unesi sekvence** — ručno, kroz medicinske primjere, UniProt pretragu ili FASTA upload
2. **Odaberi algoritam** — Needleman-Wunsch ili Smith-Waterman (ili oba u usporednom modu)
3. **Podesi parametre** — bodovanje za match, mismatch i gap
4. **Pokreni** — aplikacija prikazuje matricu, poravnanje, statistiku sličnosti i detektirane mutacije

---

## O algoritmima

### Needleman-Wunsch (globalno poravnanje)

Poravnava **cijele** dvije sekvence od početka do kraja. Koristi se kada su sekvence slične duljine i evolucijski srodne. Traceback kreće od donjeg desnog kuta matrice.

### Smith-Waterman (lokalno poravnanje)

Pronalazi **najsličniji podniz** unutar dviju sekvenci. Vrijednosti u matrici nikad ne padaju ispod nule, a traceback kreće od pozicije maksimalne vrijednosti. Osnova je alata poput BLAST-a.

Oba algoritma temelje se na **dinamičkom programiranju** i imaju vremensku složenost **O(n × m)**.

---

## Primjena i korisnost u bioinformatici

Poravnanje sekvenci jedan je od najtemeljnijih problema u bioinformatici i molekularnoj biologiji — na njemu se temelji velik dio moderne analize genoma i proteina. Algoritmi implementirani u ovoj aplikaciji nisu samo teorijski; oni su osnova alata koje znanstvenici koriste svakodnevno.

**Detekcija bolesti i mutacija** — usporedbom pacijentove DNA s referentnim genomom otkrivaju se mutacije koje uzrokuju rak ili nasljedne bolesti. Medicinski primjeri u aplikaciji (TP53, BRCA1, KRAS) demonstriraju upravo taj proces — svaka od tih mutacija je klinički poznata i povezana s razvojem karcinoma.

**Evolucijska biologija** — usporedbom istog gena kod različitih vrsta određuje se koliko su vrste srodne i grade se filogenetska stabla. Što je poravnanje sličnije, to su vrste bliže u evoluciji.

**Pretraživanje baza podataka** — kada znanstvenik otkrije nepoznatu sekvencu, pretražuje baze (poput UniProt-a) za slične poznate sekvence kako bi pretpostavio funkciju. Integracija s UniProt bazom u ovoj aplikaciji dodiruje upravo taj svijet, s pristupom stvarnim sekvencama.

**Razvoj lijekova i cjepiva** — poravnanje se koristi za pronalaženje konzerviranih regija u proteinima (dijelova koji se ne mijenjaju), koje su idealne mete za lijekove i cjepiva.

Vrijednost ove aplikacije je prvenstveno **edukacijska**: umjesto da samo ispiše rezultat, ona *vizualizira kako* algoritmi rade — animirano punjenje matrice, traceback put, heatmap za velike sekvence. Time premošćuje jaz između apstraktne teorije dinamičkog programiranja i njezine praktične primjene u kliničkoj genetici i istraživanju.

---

## Mogućnosti daljnjeg razvoja

Projekt je zamišljen kao proširiva osnova. Neki od smjerova u kojima bi se mogao razvijati:

**Dodatni algoritmi poravnanja:**

- **Gotoh (affine gap penalty)** — realističniji model kaznjavanja praznina, gdje otvaranje praznine košta više od njezinog produljivanja. Biološki točnije jer je jedna duga insercija vjerojatnija od više kratkih. Direktno nadograđuje postojeći kod.
- **Hirschberg** — inačica Needleman-Wunscha koja koristi linearnu memoriju O(n) umjesto O(n×m), što omogućuje poravnanje mnogo dužih sekvenci bez opterećenja memorije.
- **BLAST-ov pristup (seed-and-extend)** — heuristička metoda za brzo pretraživanje velikih baza, koja pronalazi kratka podudaranja pa ih proširuje. Omogućila bi rad s realnim genomskim bazama.
- **Multiple sequence alignment (ClustalW / MUSCLE)** — poravnanje tri ili više sekvenci istovremeno, temelj filogenetske analize.

**Ostala proširenja:**

- **Supstitucijske matrice** (BLOSUM, PAM) — umjesto fiksnog match/mismatch bodovanja, koristiti biološki utemeljene matrice koje različito vrednuju zamjene aminokiselina.
- **Izvoz rezultata** — spremanje poravnanja u standardne formate (FASTA, Clustal, PDF izvještaj).
- **Dot-plot vizualizacija** — grafički prikaz sličnosti između dviju sekvenci.
- **Optimizacija prikaza velikih matrica** — renderiranje heatmapa na `<canvas>` elementu za znatno brži prikaz vrlo velikih proteina.
- **Filogenetsko stablo** — automatsko generiranje stabla srodnosti iz više poravnanih sekvenci.

---

## Arhitektura aplikacije

Aplikacija je izrađena kao **jednostranična aplikacija (SPA)** u Reactu. Cjelokupno stanje aplikacije (unesene sekvence, odabrani algoritam, parametri bodovanja, rezultati) upravlja se centralno u glavnoj komponenti `App.js` pomoću React Hookova (`useState`, `useEffect`, `useRef`), a podaci se prosljeđuju djeci kroz props.

Kod je podijeljen u tri sloja:

**Sloj logike** (`algorithms.js`, `data.js`) — sadrži čiste funkcije za oba algoritma poravnanja, izračun statistike, detekciju mutacija, dohvat s UniProt baze i parsiranje FASTA datoteka. Ovaj sloj ne ovisi o Reactu i mogao bi se koristiti samostalno.

**Sloj prezentacije** (`components/`) — skup React komponenti od kojih svaka ima jednu odgovornost: prikaz matrice, prikaz poravnanja, panel za mutacije, UniProt pretraga i slično.

**Sloj stila** (`constants.js`) — sve boje i stilovi centralizirani su u dva objekta (`C` za boje, `s` za stilove), koje sve komponente dijele. Time se izbjegava potreba za zasebnim CSS datotekama po komponenti i osigurava jednak izgled kroz cijelu aplikaciju.

### Struktura datoteka

```
src/
├── App.js                    # Glavna komponenta i upravljanje stanjem
├── algorithms.js             # NW i SW algoritmi, statistika
├── constants.js              # Boje i stilovi (light tema)
├── data.js                   # Medicinski primjeri, UniProt dohvat, FASTA parser
└── components/
    ├── Header.jsx            # Zaglavlje
    ├── Matrix.jsx            # Vizualizacija DP matrice (tablica / heatmap)
    ├── AlignmentResult.jsx   # Prikaz poravnanja u blokovima s pozicijama
    ├── MutationPanel.jsx     # Detekcija i opis mutacija
    ├── UniProtPanel.jsx      # UniProt pretraga i dohvat sekvenci
    └── FastaUpload.jsx       # Upload FASTA datoteka
```

### Tok podataka

1. Korisnik unosi sekvence (ručno, UniProt, FASTA ili medicinski primjeri) → `App.js` sprema u stanje
2. Klikom na *Pokreni*, `App.js` poziva algoritam iz `algorithms.js`
3. Rezultat (matrica, poravnanje, score, pozicije) sprema se u stanje
4. Komponente `Matrix`, `AlignmentResult` i `MutationPanel` primaju rezultat kroz props i prikazuju ga
5. Animacija punjenja matrice postiže se postupnim povećavanjem brojača (`revealCount`) preko `setInterval`

---

## Korištene tehnologije

| Tehnologija | Namjena |
|-------------|---------|
| **React** | Biblioteka za izradu korisničkog sučelja (komponente, stanje, Hookovi) |
| **JavaScript (ES6+)** | Programski jezik — algoritmi, logika, dohvat podataka |
| **Create React App** | Alat za postavljanje i build projekta |
| **UniProt REST API** | Dohvat pravih proteinskih sekvenci iz baze podataka |
| **CSS-in-JS (inline stilovi)** | Stiliziranje kroz JavaScript objekte u `constants.js` |
| **Google Fonts** | Fontovi *IBM Plex Mono*, *Syne* i *Orbitron* |
| **Git / GitHub** | Verzioniranje koda i hosting repozitorija |

Aplikacija ne koristi vanjske biblioteke za algoritme ni vizualizaciju — oba algoritma poravnanja, matrica, heatmap i prikaz poravnanja implementirani su ručno, čistim JavaScriptom i Reactom.

