function loadTasks() {
    const tasksTable = document.getElementById('tasksTable').getElementsByTagName('tbody')[0];
    tasksTable.innerHTML = "";

    try {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const row = tasksTable.insertRow();
       row.insertCell(0).textContent = task.date;
       row.insertCell(1).textContent = task.location || '—';
       row.insertCell(2).textContent = task.details;
       row.insertCell(3).textContent = task.notes;

        });
		        if (typeof updateMapMarkers === 'function') {
            updateMapMarkers();
        }
    } catch (error) {
        console.error("Errore caricando i task:", error);
		loadTasks();
		
    }
}

function startTimer() {
    const timer = document.getElementById('timer');
    let last = parseInt(localStorage.getItem('lastSavedTime'), 10);

    if (!last) {
        timer.textContent = 'Nessuna attività salvata';
        return;
    }

    function update() {
        const now = Date.now();
        const diff = Math.floor((now - last) / 1000);
        const h = String(Math.floor(diff / 3600)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        timer.textContent = `Ultima attività: ${h}:${m}:${s}`;
    }

    if (window.timerInterval) clearInterval(window.timerInterval);
    update();
    window.timerInterval = setInterval(update, 1000);
}

function saveActivity() {
    const data = {
        date: new Date().toLocaleString(),
        details: `TWA: ${twa.value}° TWS: ${tws.value} kt, LOG: ${log.value} kt, Vele: ${sails.value}, Altezza Onda: ${waveHeight.value} m, Direzione: ${direction.value}°, Intensità: ${intensity.value} kt, Lunghezza Onda: ${waveLength.value}`,
        notes: notes.value,
        location: "Posizione in acquisizione..."
    };

    if (navigator.geolocation) {
        // Mostra subito che stiamo cercando la posizione
        save(); // salva subito con "Posizione in acquisizione..."

navigator.geolocation.getCurrentPosition(
    pos => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        const accuracy = pos.coords.accuracy;

if (accuracy > 100) {
    data.location = `Posizione imprecisa (>100m): Lat ${lat}, Lon ${lon} (±${Math.round(accuracy)}m)`;
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
                data.location = "Permesso posizione negato";
                break;
            case error.POSITION_UNAVAILABLE:
                data.location = "Posizione non disponibile";
                break;
            case error.TIMEOUT:
                data.location = "Timeout nella localizzazione";
                break;
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
        finalize();
    }

    function save() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(data);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('lastSavedTime', Date.now());
        loadTasks();
        startTimer();
    }

    function finalize() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        // Sovrascrive l’ultimo inserimento (quello con posizione in attesa)
        tasks[tasks.length - 1].location = data.location;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    startTimer();
	initMap(); 

    const clearHistoryBtn = document.getElementById('clearHistory');
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => {
        localStorage.clear();
        loadTasks();
        timer.textContent = '';
		location.reload();
    });
});

let map;
let markersLayer;

function initMap() {
    map = L.map('map').setView([41.9, 12.5], 5); // Italia centro
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
    updateMapMarkers();
}

function updateMapMarkers() {
    if (!markersLayer) return;
    markersLayer.clearLayers();

    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    tasks.forEach(task => {
        const match = task.location?.match(/Lat[:\s]*([0-9.\-]+),?\s*Lon[:\s]*([0-9.\-]+)/);
        if (match) {
            const lat = parseFloat(match[1]);
            const lon = parseFloat(match[2]);

            if (!isNaN(lat) && !isNaN(lon)) {
                L.marker([lat, lon]).addTo(markersLayer)
                 .bindPopup(`<strong>${task.date}</strong><br>${task.details}<br>${task.notes || ''}`);
            }
        }
    });
}
document.getElementById('exportPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const headers = [["Data e Ora", "Posizione", "Dettagli", "Note"]];
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    const rows = tasks.map(task => [
        task.date,
        task.location || '—',
        task.details,
        task.notes || ''
    ]);

    doc.text("Storico Navigazione", 14, 16);
    doc.autoTable({
        startY: 20,
        head: headers,
        body: rows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [68, 114, 196] }
    });

    doc.save("storico_navigazione.pdf");
});

