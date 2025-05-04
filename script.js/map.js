// map.js

let map;
let markersLayer = null;

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

    // Recupera i task e costruisci l'array completo di coordinate
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const routeCoords = [];

    tasks.forEach(task => {
        const match = task.location?.match(/Lat[:\s]*([0-9.\-]+),?\s*Lon[:\s]*([0-9.\-]+)/);
        if (match) {
            const lat = parseFloat(match[1]);
            const lon = parseFloat(match[2]);
            if (!isNaN(lat) && !isNaN(lon)) {
                routeCoords.push([lat, lon]);
            }
        }
    });

    // Disegna la polyline su tutte le coordinate
    if (routeCoords.length > 1) {
        const polyline = L.polyline(routeCoords, { color: 'blue' }).addTo(markersLayer);
        map.fitBounds(polyline.getBounds());

        const totalNM = calculateTotalDistanceNM(routeCoords);
        document.getElementById('totalDistance').innerHTML =
            ` Distanza Approssimativa: <strong>${totalNM} M</strong>`;
    }

    // Determina quali indici marcare: se <=3 punti, tutti; altrimenti solo primo e ultimo
    let markerIndices;
    if (routeCoords.length <= 3) {
        markerIndices = routeCoords.map((_, i) => i);
    } else {
        markerIndices = [0, routeCoords.length - 1];
    }

    // Crea solo i marker selezionati con colore differente e popup
    markerIndices.forEach(idx => {
        const [lat, lon] = routeCoords[idx];
        const circle = L.circleMarker([lat, lon], {
            radius: 6,
            color: idx === 0 ? 'green' : 'red',
            fillOpacity: 1
        }).addTo(markersLayer);

        const task = tasks[idx];
        circle.bindPopup(`<strong>${task.date}</strong><br>${task.notes || ''}`);
    });
}

function calculateTotalDistanceNM(coords) {
    const R = 6371; // km
    let total = 0;

    for (let i = 1; i < coords.length; i++) {
        const [lat1, lon1] = coords[i - 1];
        const [lat2, lon2] = coords[i];

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                  Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        total += R * c;
    }

    return (total * 0.539957).toFixed(2); // km → NM
}

function toRad(deg) {
    return deg * Math.PI / 180;
}
