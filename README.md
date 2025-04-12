# 📘 Logbook

Logbook è un'applicazione web per registrare, visualizzare e analizzare i dati di navigazione in barca a vela.

## ✨ Funzionalità principali

- 📝 **Inserimento dei dati di navigazione**:
  - TWA (angolo del vento apparente)
  - TWS (velocità del vento reale)
  - LOG (velocità della barca) e vele utilizzate
  - Altezza e periodo dell’onda
  - Direzione e intensità della corrente
  - Posizione GPS con indicazione della precisione

- 🗃️ **Gestione dello storico**:
  - Visualizza i dati salvati in tabella
  - Timer dell’ultima attività salvata
  - Pulisci tutto lo storico
  - Esporta e importa dati in formato JSON

- 🗺️ **Mappa interattiva**:
  - Marker per ciascun punto salvato
  - Rotta automatica disegnata tra i punti
  - Calcolo automatico della distanza approssimativa in NM

- 📈 **Grafico dinamico**:
  - Andamento nel tempo di LOG e TWS

## 🔧 Tecnologie utilizzate

- HTML, CSS, JavaScript
- [Leaflet.js](https://leafletjs.com/) per la mappa
- [Chart.js](https://www.chartjs.org/) per i grafici
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) per la persistenza dei dati

## 📂 Struttura dei file

- `index.html`: struttura dell’interfaccia utente
- `styles.css`: stile e layout grafico
- `function.js`: gestione eventi principali (pulsanti, caricamento)
- `storage.js`: salvataggio, caricamento, esportazione/importazione dati
- `geolocation.js`: gestione geolocalizzazione e salvataggio attività
- `map.js`: rendering della mappa, marker, rotta e distanza
- `chart.js`: visualizzazione del grafico LOG/TWS

---

Buon vento! ⛵️
