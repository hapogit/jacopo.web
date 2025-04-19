// storico.js

function saveFromDashboard(e) {
  e.preventDefault();
  const record = {
    timestamp: new Date().toLocaleString(),
    gps: currentGPS(),            // la tua funzione esistente
    twa: document.getElementById('twaInput').value,
    tws: document.getElementById('twsInput').value,
    log: document.getElementById('logInput').value,
    current: document.getElementById('currInput').value,
    // aggiungi sails, waveHeight, wavePeriod, direction…  
  };
  // salva su localStorage / IndexedDB
  let all = JSON.parse(localStorage.getItem('logbook')) || [];
  all.push(record);
  localStorage.setItem('logbook', JSON.stringify(all));
  appendToTable(record);
}


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
