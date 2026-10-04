# Progetto: sito personale di Giovanni Sassano

Documento di progetto. Raccoglie concept, analisi, scelte di design e tecniche, deployment e checklist finale. Aggiornato a ottobre 2026.

---

## 1. Concept creativo

**Il sito come un articolo scientifico che si può toccare.**

Il riferimento non è un portfolio da designer, ma la pagina stampata di un paper: indici di sezione numerati (§ 01, § 02...), figure con didascalia ("Fig. 1."), note a margine, una sola tinta di segnale su carta e inchiostro. Dentro questa cornice sobria, ogni figura è viva: si calcola nel browser, risponde al puntatore, e soprattutto dice qualcosa di vero sul profilo.

L'idea centrale sta nell'hero: centinaia di random walk con passi gaussiani indipendenti finiscono in un istogramma che converge alla densità normale prevista dal teorema del limite centrale. Il puntatore cambia il drift μ e la stima insegue la teoria, con il ritardo di qualunque stimatore. È una frase visiva: "la maggior parte di ciò che costruisco nasce come distribuzione di probabilità e finisce come servizio in esecuzione". Collega la tesi sulla modellazione stocastica (GBM, SDE), la statistica della magistrale e il lavoro di ingegneria.

Il tono dei testi è quello di un matematico che sa scrivere: frasi precise, ironia asciutta (la 404 rifiuta l'ipotesi che la pagina esista con p < 0.001; la sezione Now ha un'emivita di tre mesi), nessuna formula da LinkedIn.

## 2. Analisi del sito di riferimento (glopardo.com)

| Aspetto         | Cosa fa                                                                                                            | Cosa ne ho tratto                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Struttura       | Tema accademico Jekyll (al-folio): About con foto, news in tabella, pagine separate per publications, projects, cv | Il posizionamento "ricercatore quantitativo che lavora nell'industria" è quello giusto. La struttura a pagine separate disperde: qui diventa un'unica narrazione con pagine di dettaglio solo per i progetti |
| Gerarchia       | Nome, ruolo, foto, bio densa di link in grassetto                                                                  | Bio più breve, fatti verificabili spostati in una colonna di marginalia                                                                                                                                      |
| Storytelling    | Lineare, curricolare (PhD, ECB, Prometeia)                                                                         | Narrazione per tensioni: dalle macchine che non possono sbagliare ai modelli che ammettono di poterlo fare                                                                                                   |
| Tipografia      | Default del tema, sans-serif                                                                                       | Sistema a tre voci: serif display, grottesco per la lettura, mono per i dati                                                                                                                                 |
| Animazioni      | Praticamente assenti                                                                                               | Animazioni con funzione: tracciare, rivelare, stimare                                                                                                                                                        |
| Navigazione     | Navbar classica a pagine                                                                                           | Indice di sezioni con scrollspy, menu mobile a tutto schermo                                                                                                                                                 |
| Spazio          | Contenuto compresso, molte informazioni                                                                            | Griglia editoriale a 12 colonne, molto spazio negativo                                                                                                                                                       |
| Componenti      | Tabelle news, liste pubblicazioni                                                                                  | Indice di progetti in stile sommario di rivista con tavola flottante                                                                                                                                         |
| Responsive      | Collasso standard Bootstrap                                                                                        | Layout progettati per breakpoint (vedi §11)                                                                                                                                                                  |
| Tocco personale | "Drop me a line if you're ever in Rome or Brienza"                                                                 | Chiusura simile nello spirito ma diversa nei fatti: Pavese, modelli stocastici, equazioni nell'oggetto della mail                                                                                            |

Non è stato copiato nulla di design, testi, codice o asset.

**Altri riferimenti studiati per sintesi, non per imitazione.** La tradizione dei saggi interattivi (Bartosz Ciechanowski, Distill, Seeing Theory di Brown University, gli articoli di Amelia Wattenberger) per l'idea che la figura spieghi e non decori; il layout tufteano a note laterali per la colonna di marginalia; i portfolio editoriali premiati su Awwwards per l'uso di tipografia enorme, indici numerati e tavole flottanti al passaggio del mouse. Il consenso che emerge nelle discussioni di sviluppatori (Reddit, GitHub) è costante: pochi progetti spiegati bene, problema prima della tecnologia, velocità di caricamento, niente template riconoscibili.

## 3. Architettura del sito

```text
/                         home, unica narrazione
  § Hero                  chi, cosa, perché (Fig. 1, random walk → CLT)
  § 01 About              bio narrativa + marginalia di fatti
  § 02 Expertise          grafo di dipendenze (Fig. 2) + ticker strumenti
  § 03 Projects           indice di 5 progetti, tavola con il grafico firma
  § 04 Thinking           gradient descent interattivo (Fig. 3), domande aperte,
                          metodo di studio (Fig. 4), scritti
  § 05 Now                cosa ha la mia attenzione, con freschezza calcolata
  § 06 Beyond data        biblioteca come unit chart (Fig. 5), autori, note personali
  § 07 Contact            email, LinkedIn, Substack
/projects/<slug>/         problema, approccio, strumenti, formula, progetto successivo
/404                      test d'ipotesi
/sitemap.xml /robots.txt /manifest.webmanifest /og.png
```

**User journey.** Recruiter: hero (ruolo e azienda in 5 secondi) → Projects → dettaglio → Contact. Tecnico o ricercatore: hero (gioca col drift) → Expertise → Thinking (gioca col learning rate) → Projects. Lettore curioso: About → Beyond → Substack.

## 4. Design system

**Palette.** Carta e inchiostro, un solo colore di segnale. Tutto il resto è una sfumatura di inchiostro.

| Token       | Chiaro    | Scuro     | Uso                                       |
| ----------- | --------- | --------- | ----------------------------------------- |
| `--paper`   | `#f3f0e8` | `#0f0f0d` | Fondo                                     |
| `--paper-2` | `#ebe7dc` | `#181815` | Sezioni alternate, hover                  |
| `--ink`     | `#151513` | `#ebe7dc` | Testo principale, tratti                  |
| `--ink-2`   | `#4b4a44` | `#aaa699` | Testo secondario                          |
| `--ink-3`   | `#686660` | `#8c897e` | Etichette, didascalie (AA verificato)     |
| `--signal`  | `#b0330e` | `#ff6a3d` | Teoria, selezione, enfasi. Mai decorativo |

Regola del segnale: il rosso indica sempre "la cosa vera" (la densità teorica, il nodo selezionato, il bacino più profondo, il percorso con ripetizione).

**Tipografia.** Instrument Serif (display, corsivo per l'enfasi di una parola per titolo), Hanken Grotesk variabile (lettura), JetBrains Mono (etichette, formule, dati). Scala fluida con `clamp()`, da 10.5rem dell'hero a 0.72rem delle etichette. Tutte self-hosted.

**Griglia.** 4 colonne su mobile, 8 su tablet, 12 su desktop; gutter `clamp(16px, 2vw, 32px)`; contenitore massimo 1760px. Le sezioni aprono con l'indice nelle prime 3 colonne e il titolo nelle 9 successive.

**Linguaggio visivo.** Filetti sottili invece di card, griglie tratteggiate da carta millimetrata, forme geometriche per le famiglie di competenze (cerchio, quadrato, rombo, triangolo), grana di carta in SVG da 1 KB.

**Linguaggio delle animazioni.** Tre verbi, una curva (`cubic-bezier(0.22, 1, 0.36, 1)`):

- _rise_: il contenuto entra salendo di 24px, nel verso della lettura;
- _draw_: linee e percorsi si tracciano come su un plotter;
- _settle_: valori e posizioni arrivano con una coda lunga.

## 5. Stack tecnico motivato

| Scelta                     | Perché                                                                                          | Scartato                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Next.js 16, export statico | Routing, metadata, sitemap e OG generati in build; output HTML puro portabile su qualsiasi host | Astro (ottimo, ma React serve per figure interattive con stato condiviso)        |
| TypeScript strict          | Il contenuto è tipizzato: un progetto senza `problem` non compila                               |                                                                                  |
| Tailwind CSS 4             | Token come variabili CSS, tema scuro senza duplicare classi                                     | CSS Modules (più verboso per un design system piccolo)                           |
| Motion                     | Reveal, layout animation del pallino di navigazione, molle per cursore e bottoni magnetici      | GSAP: potente ma non necessario, nessuna timeline complessa                      |
| Lenis                      | Scroll inerziale solo su desktop, disattivato su touch e con reduced motion                     |                                                                                  |
| Canvas 2D + SVG a mano     | Ogni figura è sotto le 300 righe, nessuna dipendenza                                            | D3 (pesa più delle figure stesse), Three.js (il 3D non aggiunge significato qui) |
| Font locali                | Nessuna richiesta a Google, build offline, niente CLS                                           | `next/font/google`                                                               |

Nessuna libreria di icone: le poche frecce sono caratteri tipografici, coerenti con il registro editoriale.

## 6. Struttura del repository

Vedi `README.md`. Il principio: `content/` (cosa si dice) è separato da `sections/` (come si impagina), `visualizations/` (figure pure), `animations/` (vocabolario del movimento), `lib/` (matematica e utilità).

## 7. Implementazione

Completa e funzionante: home con otto sezioni, cinque pagine progetto generate staticamente, 404, sitemap, robots, manifest, immagine social. Tutto passa `typecheck`, `lint`, `prettier --check` e `build`.

## 8. Animazioni

- Titoli: rivelazione parola per parola in maschera; nell'hero in CSS puro, così parte al primo paint senza aspettare JavaScript (LCP).
- Hero: parallasse in uscita (il testo sale più veloce della figura, che sfuma).
- Navigazione: pallino di sezione attiva con layout animation; menu mobile che si apre con clip-path e voci in sequenza.
- Progetti: titolo che scorre e si colora, freccia che ruota, tavola flottante che segue il puntatore e si ribalta vicino al bordo.
- Bottoni magnetici, anello del cursore che cresce e dice un verbo (Open, Read, Mail, Drop).
- Barra di progresso di lettura da 1px.
- Transizioni di pagina in dissolvenza (solo opacità: una trasformazione romperebbe gli elementi `fixed`).

Tutte rispettano `prefers-reduced-motion`: le figure mostrano uno stato maturo statico, i testi compaiono senza movimento, lo scroll torna nativo.

## 9. Visualizzazioni

1. **Random walk e TLC** (hero). Tre livelli su due canvas: scia accumulata dei percorsi conclusi, percorsi vivi, overlay con istogramma e densità teorica. Momenti stimati con media mobile esponenziale. Il puntatore imposta μ.
2. **Grafo delle competenze**. Gli archi significano "serve a fare". La selezione accende il vicinato e manda impulsi lungo gli archi.
3. **Gradient descent**. f(x, y) = (x² − 1)² + 0.3x + 2(y − 0.3 sin 2x)², contorni con marching squares, learning rate regolabile, momentum heavy-ball, stato (converge, diverge, budget).
4. **Curva dell'oblio**. R(t) = exp(−t/S) con ripetizioni ai giorni 1, 3, 7, 14, 30: il metodo di studio reale.
5. **Biblioteca**. 109 volumi, dieci scaffali, un segno per libro, dati dalla pagina Notion "Biblioteca · Taccuino critico".
6. **Grafici firma dei progetti**, generati con seed deterministico (identici tra server e client).

Escluse di proposito: PCA, clustering, particelle 3D. Belle, ma non avrebbero detto nulla di specifico su di te.

## 10. SEO e accessibilità

- Metadata completi, canonical per pagina, Open Graph e Twitter card con `/og.png` (1200×630, generata in build).
- JSON-LD: `Person` (lavoro, formazione, certificazioni, competenze, profili), `WebSite`, `CreativeWork` per ogni progetto.
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, favicon SVG.
- HTML semantico: un solo `h1` per pagina, sezioni etichettate, `figure` con `figcaption`, liste vere.
- Skip link, focus visibile, menu chiudibile con Esc, controlli delle figure raggiungibili da tastiera (chip del grafo, slider, checkbox, bottoni).
- Contrasto AA verificato per tutti i colori di testo in entrambi i temi.

## 11. Responsive e performance

| Schermo            | Esperienza                                                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile (< 768px)   | Hero in tre blocchi (testo, figura, didascalia), 70 random walk, grafici firma in linea nei progetti, grafo con chip sotto, menu a tutto schermo, scroll nativo |
| Tablet (768-1023)  | Griglia a 8 colonne, stessa logica del mobile con più respiro                                                                                                   |
| Desktop (≥ 1024)   | Figura dell'hero a tutta larghezza accanto al testo, tavola flottante sui progetti, colonne sticky in Expertise e Now                                           |
| Ultrawide (≥ 1920) | Contenuto limitato a 1760px, la figura dell'hero si allinea al contenitore invece di stirarsi                                                                   |

Ottimizzazioni: export statico, code splitting per route, font locali con fallback calibrati, canvas con DPR massimo 2, numero di particelle in base a schermo e core, simulazione avviata solo a browser inattivo, loop fermati fuori schermo e con tab nascosta, cache immutabile per gli asset.

## 12. Configurazione GitHub

- `.github/workflows/ci.yml`: typecheck, lint, formato, build su ogni push e pull request; l'export statico resta come artifact per 7 giorni.
- `.github/dependabot.yml`: aggiornamenti mensili raggruppati.
- Repository già inizializzato con un primo commit sul branch `main`.

## 13. Strategia di deployment gratuita

**Decisione: Vercel (piano Hobby), collegato al repository GitHub.**

**Perché**

- Integrazione nativa con Next.js e con GitHub: push su `main` → build → produzione; ogni pull request ha un URL di anteprima.
- Configurazione zero: il progetto viene riconosciuto da solo, gli header sono in `vercel.json`.
- Un sito personale non commerciale rientra esattamente nell'uso previsto dal piano gratuito.

| Criterio                       | Vercel Hobby                         | Cloudflare (Pages / Workers static assets) | Netlify Free               | GitHub Pages                             |
| ------------------------------ | ------------------------------------ | ------------------------------------------ | -------------------------- | ---------------------------------------- |
| Costo                          | 0 €                                  | 0 €                                        | 0 € (300 crediti/mese)     | 0 €                                      |
| Banda                          | Quota mensile ampia per un portfolio | Asset statici illimitati                   | Consumata dai crediti      | Limite morbido                           |
| CI/CD da GitHub                | Nativo, anteprime per PR             | Nativo, anteprime                          | Nativo, anteprime          | Via GitHub Actions                       |
| Dominio personalizzato + HTTPS | Sì                                   | Sì                                         | Sì                         | Sì                                       |
| API future                     | Functions                            | Workers                                    | Functions                  | No                                       |
| Limite principale              | Solo uso non commerciale             | DX un po' meno lineare con Next            | Crediti che si esauriscono | Niente header personalizzati né funzioni |

**Cosa sto sacrificando.** L'uso commerciale (se un giorno il sito vendesse consulenze, il piano Hobby non basterebbe) e la banda illimitata di Cloudflare.

**Incertezza.** I limiti dei piani gratuiti cambiano spesso (Netlify è passato ai crediti, Cloudflare sta spostando i nuovi progetti da Pages a Workers). Per questo il sito è un export statico: migrare richiede di cambiare host, non codice. Il file `public/_headers` è già pronto per Cloudflare e Netlify.

**Verdetto operativo.** Vercel ora; Cloudflare come piano B se cambiano i termini o se il sito diventa commerciale.

## 14. Istruzioni per pubblicare

**A. Repository su GitHub (5 minuti)**

1. Crea un repository vuoto su github.com, ad esempio `giovannisassano` (pubblico o privato, senza README).
2. Dalla cartella del progetto:
   ```bash
   git remote add origin https://github.com/<tuo-username>/giovannisassano.git
   git push -u origin main
   ```
3. Nel tab Actions controlla che il workflow CI diventi verde.

**B. Vercel (5 minuti)**

1. Vai su vercel.com → Sign up with GitHub.
2. Add New → Project → importa il repository. Framework: Next.js (rilevato da solo). Non cambiare comandi di build.
3. Environment Variables (facoltative): `NEXT_PUBLIC_SITE_URL` = l'URL definitivo (es. `https://giovannisassano.vercel.app`), `GITHUB_USERNAME` se vuoi i repository in automatico.
4. Deploy. Da qui in poi: ogni `git push` su `main` aggiorna il sito, ogni pull request genera un'anteprima.
5. Se Vercel ti assegna un URL diverso da `giovannisassano.vercel.app`, aggiorna `NEXT_PUBLIC_SITE_URL` e fai Redeploy: canonical, sitemap e Open Graph dipendono da lì.

**C. Dominio personalizzato (quando vorrai)**

1. Compra il dominio (es. `giovannisassano.com` o `.it`) da un registrar; Cloudflare Registrar vende a prezzo di costo.
2. Vercel → Project → Settings → Domains → Add `giovannisassano.com` e `www.giovannisassano.com`.
3. Nel pannello DNS del registrar aggiungi i record che Vercel mostra (di solito un record `A` per il dominio radice e un `CNAME` per `www`). HTTPS si attiva da solo.
4. Imposta `NEXT_PUBLIC_SITE_URL=https://giovannisassano.com`, Redeploy.
5. Google Search Console → aggiungi la proprietà → invia `https://giovannisassano.com/sitemap.xml`.

**D. Analytics (facoltativo)**

Vercel → Analytics → Enable, poi variabile `NEXT_PUBLIC_ENABLE_ANALYTICS=1`. È senza cookie, quindi non serve un banner. In alternativa Cloudflare Web Analytics, anch'esso gratuito e senza cookie.

## 15. Checklist pre-deployment

**Contenuti da confermare tu**

- [ ] Rileggi i testi dei progetti in `src/content/projects.ts`: approcci e strumenti sono descritti da quanto mi hai raccontato, ma sei tu a sapere cosa è esatto (soprattutto RL e multi-agente).
- [ ] Anno della tesi triennale (ora "BSc") e anno di inizio della magistrale, se vuoi mostrarli.
- [ ] Verifica che la descrizione del lavoro in Deloitte sia compatibile con le policy aziendali sui profili pubblici.
- [ ] GitHub: quando hai repository pubblici, imposta `links.github` e `GITHUB_USERNAME`.
- [ ] Foto: il sito funziona senza; se ne vuoi una, va in `public/` e nella sezione About.
- [ ] Sezione Now: aggiorna `now.ts` almeno ogni tre mesi (lo dice anche il sito).
- [ ] Articoli Substack: aggiungi i singoli saggi in `thinking.ts` quando vuoi metterli in evidenza.

**Tecnica (già verificata in questa sessione)**

- [x] `npm run check` verde (typecheck, lint, build).
- [x] Nessun errore in console, nessun errore di idratazione, anche con reduced motion.
- [x] Lighthouse desktop: 100 / 100 / 100 / 100 (performance, accessibilità, best practice, SEO).
- [x] Lighthouse mobile: performance 94-96, accessibilità 100, best practice 100, SEO 100 (misurato su server locale senza compressione; su Vercel con Brotli va meglio).
- [x] CLS 0 su tutte le pagine.
- [x] Screenshot verificati: 390px, 1440px, 2560px, tema chiaro e scuro, menu mobile, pagina progetto.
- [x] Sitemap, robots, manifest, `/og.png` presenti nell'export.

**Dopo il primo deploy**

- [ ] Apri il sito da telefono vero (iOS e Android) e prova il drift nell'hero col dito.
- [ ] Prova la condivisione del link su LinkedIn e WhatsApp per vedere l'anteprima.
- [ ] Lighthouse sull'URL pubblico.
- [ ] Aggiungi l'URL al profilo LinkedIn (sezione Contatti e "In primo piano").
