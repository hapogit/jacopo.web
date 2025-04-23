// storico.js
// storico.js

// —————————————————————————————
// 1) Buffer per gli ultimi N fix
const BUFFER_SIZE = 5;
let posBuffer = [];
let medPosition = null;         // { lat:…, lon:… }
let prevMedPosition = null;     // usata per scarto tra posizioni

// 2) Funzione di calcolo mediana
function median(arr) {
  const s = [...arr].sort((a,b)=>a-b);
  const m = Math.floor(s.length/2);
  return s.length % 2 !== 0
    ? s[m]
    : (s[m-1] + s[m]) / 2;
}

// 3) Callback watchPosition
function handleFix(pos) {
  if (pos.coords.accuracy <= 50) {
    // aggiungo al buffer
    posBuffer.push(pos);
    if (posBuffer.length > BUFFER_SIZE) posBuffer.shift();

    // calcolo mediana di lat e lon
    const lats = posBuffer.map(p => p.coords.latitude);
    const lons = posBuffer.map(p => p.coords.longitude);
    const medLat = median(lats);
    const medLon = median(lons);
    medPosition = {
      lat: medLat.toFixed(6),
      lon: medLon.toFixed(6)
    };

    // aggiorno la posizione che poi verrà salvata
    document.getElementById('locationWarning').style.display = 'none';
    // non uso più data.location placeholder, verrà letto da medPosition

    // aggiorno indicatore di qualità
    updateQualityIndicator(pos.coords.accuracy);
  }
}

function handleErr(err) {
  // in caso di errori di position (es. permission-denied), non cambio nulla
}

// 4) Avvio watchPosition all’inizio dello script
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    handleFix,
    handleErr,
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
}
// —————————————————————————————
function updateQualityIndicator(accuracy) {
    const el = document.getElementById('qualityIndicator');
    let status, color;
  
    // classificazione basata su accuracy
    if (accuracy <= 10) {
      status = 'Alta';
      color = 'green';
    } else if (accuracy <= 30) {
      status = 'Media';
      color = 'orange';
    } else {
      status = 'Bassa';
      color = 'red';
    }
  
    // in più, se ho una posizione precedente, posso
    // misurare lo scarto e penalizzare se troppo grande
    if (prevMedPosition && medPosition) {
      const d = haversineNM(prevMedPosition, medPosition);
      // se scarto > 0.5 NM in 5s, probabilmente rumore
      if (d > 0.5) {
        status = 'Scarsa';
        color = 'red';
      }
    }
  
    el.textContent = `Qualità GPS: ${status} (±${accuracy.toFixed(0)} m)`;
    el.style.color = color;
  
    // aggiorno prevMedPosition per il prossimo confronto
    if (medPosition) prevMedPosition = { ...medPosition };
  }
  
  // funzione ausiliaria per distanza NM
  function haversineNM(p1, p2) {
    const toRad = deg => deg * Math.PI/180;
    const Rkm = 6371;
    const dLat = toRad(p2.lat - p1.lat);
    const dLon = toRad(p2.lon - p1.lon);
    const a = Math.sin(dLat/2)**2 +
              Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
              Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const dKm = Rkm * c;
    return dKm * 0.539957; // NM
  }
  
// 1) Variabile globale e updater ogni 5 secondi backup,nota jacopo
let currentSpeed = "-";

function updateSpeed() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const speedMS = pos.coords.speed;
        const accuracy = pos.coords.accuracy;
        let speedText = "-";
        if (speedMS != null && accuracy <= 50) {
          const speedKT = speedMS * 1.943844;      // m/s → kt
          speedText = `${speedKT.toFixed(2)} kt`;
        }
        document.getElementById('logDisplay').value = speedText;
        currentSpeed = speedText;
      },
      _err => {
        document.getElementById('logDisplay').value = "-";
        currentSpeed = "-";
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  } else {
    document.getElementById('logDisplay').value = "-";
    currentSpeed = "-";
  }
}

// avvia subito e ripeti ogni 5 secondi
updateSpeed();
setInterval(updateSpeed, 5000);

function saveActivity() {
    const data = {
        date: new Date().toLocaleString(),
        tws: tws.value,
        twa: twa.value,
        log: currentSpeed,
        sails: sails.value,
        location: medPosition
              ? `Lat: ${medPosition.lat}, Lon: ${medPosition.lon}`
              : "GPS non disponibile"
    };

    function save() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(data);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('lastSavedTime', Date.now());
        startTimer();
    }

    function finalize() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks[tasks.length - 1].location = data.location;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }

    if (navigator.geolocation) {
        save(); // salva subito con location placeholder

        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude.toFixed(6);
                const lon = pos.coords.longitude.toFixed(6);
                const accuracy = pos.coords.accuracy;

                if (accuracy > 50) {
                    data.location = `⚠️ Lat ${lat}, Lon ${lon} (±${Math.round(accuracy)}m)`;
                    document.getElementById('locationWarning').style.display = 'block';
                } else {
                    data.location = `Lat: ${lat}, Lon: ${lon} (±${Math.round(accuracy)}m)`;
                    document.getElementById('locationWarning').style.display = 'none';
                }

                finalize();
            },
            error => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        data.location = "GPS negato"; break;
                    case error.POSITION_UNAVAILABLE:
                        data.location = "GPS non disponibile"; break;
                    case error.TIMEOUT:
                        data.location = "Timeout nella localizzazione"; break;
                    default:
                        data.location = "Errore sconosciuto";
                }
                finalize();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        save();
        finalize();
    }
}