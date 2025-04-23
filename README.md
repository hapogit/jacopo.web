# Li8r3tt0 - Il tuo LogBook Digitale 🌊⛵

&#x20;

> **Li8r3tt0** è la web app *open-source* che trasforma ogni miglio nautico in un ricordo indimenticabile. 📍📝

---

## 🎯 Perché Li8r3tt0?

- **Precisione GPS**: elimina il rumore e ottieni coordinate affidabili grazie a un filtro a mediana.
- **Velocità in tempo reale**: aggiornamenti automatici ogni 5 secondi per non perdere mai il passo (in nodi!).
- **Storico dettagliato**: conserva data/ora, velocità del vento (TWS), angolo al vento (TWA), velocità di bordo (LOG) e vele utilizzate.
- **Mappa interattiva**: segui la tua rotta su OpenStreetMap con marcatori, polilinee e distanza totale calcolata in miglia nautiche.
- **Interfaccia Intuitiva**: design pulito, console animata e layout responsive per tutti i dispositivi.

## 🖼️ Anteprima

---

## ✏️ Esempi di Output

### Console di Avvio

```text
>_
[Console] Li8r3tt0 Start LogBook
[08:23:33 UTC +2 CEST 07/03/2025] Starting new route
[Console] Preparing LogBook...
[Console] Time elapsed: 1 s
[Console] Done!
[08:23:43 UTC +2 CEST 07/03/2025] Save Activity
```

### Tabella Storico

```text
Data e Ora             | GPS                             | TWS  | TWA  | LOG     | Vele
-----------------------|----------------------------------|------|------|---------|------
2025-03-07 08:23:33    | Lat: 41.902782, Lon: 12.496365   | 12kt | 110° | 6.45kt  | MJ1
2025-03-07 08:28:33    | Lat: 41.905000, Lon: 12.500000   | 15kt |  95° | 6.80kt  | MJ2
```

---

## 🚀 Installazione & Avvio

1. **Clona il repository**
   ```bash
   git clone https://github.com/tuo-utente/Li8r3tt0.git
   ```
2. **Vai nella cartella**
   ```bash
   cd Li8r3tt0
   ```
3. **Apri in browser**
   - Doppio clic su `index.html`
   - Oppure:
     ```bash
     open index.html  # macOS
     start index.html # Windows
     ```
4. **Goditi la navigazione!**
   Clicca su **Start** e inizia a salvare i tuoi rilevamenti.

> 💡 *Consiglio*: utilizza HTTPS per permettere al browser di accedere al GPS.

---

## 📦 Struttura del Progetto

```
Li8r3tt0/
├─ index.html           # Home page con console animata
├─ software/
│  └─ logbook.html      # Applicazione principale
├─ map.js               # Mappa Leaflet e gestione marker
├─ storage.js           # Salvataggio e caricamento da LocalStorage
├─ storico.js           # Logica GPS, qualità e filtro mediano
└─ favicon.ico          # Icona dell'app
```

---

## 💻 Tecnologie Utilizzate

- **HTML5 & CSS3**: struttura e design responsivo.
- **JavaScript (ES6+)**: logica applicativa.
- **Leaflet**: mappatura interattiva.
- **OpenStreetMap**: tile map gratuiti.
- **LocalStorage**: persistenza dati client-side.

---

## 🤝 Contribuire

1. Fai *fork* del repository.
2. Crea un branch: `git checkout -b feature/nome-feature`.
3. Aggiungi le tue modifiche e committa: `git commit -m "Descrizione feature"`.
4. Pusha sul tuo branch: `git push origin feature/nome-feature`.
5. Apri una Pull Request su GitHub.

---

## 📜 Licenza

Questo progetto è rilasciato sotto licenza MIT. Consulta il file `LICENSE` per maggiori dettagli.

---

*Buon vento e buon coding!* 🌬️💻

