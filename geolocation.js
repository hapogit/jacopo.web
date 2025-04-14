// geolocation.js

function saveActivity() {
    const data = {
        date: new Date().toLocaleString(),
        twa: twa.value,
        tws: tws.value,
        log: log.value,
        sails: sails.value,
        waveHeight: waveHeight.value,
        waveLength: waveLength.value,
        direction: direction.value,
        intensity: intensity.value,
        location: "GPS in acquisizione..."
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

                if (accuracy > 100) {
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
