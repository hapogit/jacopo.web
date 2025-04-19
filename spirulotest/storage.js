// storage.js

let twaGauge, twsGauge, logGauge, currGauge;

function initDashboard() {
  twaGauge = new JustGage({ id: "twaGauge",   value: 40,  min: 0,   max: 180, title: "" });
  twsGauge = new JustGage({ id: "twsGauge",   value: 4,   min: 0,   max: 50,  title: "" });
  logGauge = new JustGage({ id: "logGauge",   value: 2,   min: 0,   max: 20,  title: "" });
  currGauge= new JustGage({ id: "currGauge",  value: 0,   min: 0,   max: 20,  title: "" });

  // collega gli slider ai gauge
  document.getElementById('twaInput').oninput = e => twaGauge.refresh(+e.target.value);
  document.getElementById('twsInput').oninput = e => twsGauge.refresh(+e.target.value);
  document.getElementById('logInput').oninput = e => logGauge.refresh(+e.target.value);
  document.getElementById('currInput').oninput= e => currGauge.refresh(+e.target.value);
}

// al DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  loadTasks();
  startTimer();
  initMap();

  document.getElementById('saveBtn').addEventListener('click', saveFromDashboard);
  document.getElementById('clearBtn').addEventListener('click', clearAllData);
});


function loadTasks() {
    const tasksTable = document.getElementById('tasksTable').getElementsByTagName('tbody')[0];
    tasksTable.innerHTML = "";

    try {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const row = tasksTable.insertRow();
            row.insertCell(0).textContent = task.date;
            row.insertCell(1).textContent = task.location || '—';
            row.insertCell(2).textContent = `${task.twa}°`;
            row.insertCell(3).textContent = `${task.tws} kt`;
            row.insertCell(4).textContent = `${task.log} kt`;
            row.insertCell(5).textContent = task.sails;
const ondaText = `${task.waveHeight} m / ${task.waveLength} / ${task.direction}° / ${task.intensity} kt`;
row.insertCell(6).textContent = ondaText;


        });

        if (typeof updateMapMarkers === 'function') updateMapMarkers();
        if (typeof updateLogTwsChart === 'function') updateLogTwsChart();

    } catch (error) {
        console.error("Errore caricando i task:", error);
    }
}

function startTimer() {
    const lastActivityDiv = document.getElementById('lastActivity');
    let last = parseInt(localStorage.getItem('lastSavedTime'), 10);

    if (!last) {
        lastActivityDiv.textContent = ' Nessuna attività';
        return;
    }

    function update() {
        const now = Date.now();
        const diff = Math.floor((now - last) / 1000);
        const h = String(Math.floor(diff / 3600)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        lastActivityDiv.textContent = ` Ultima attività: ${h}:${m}:${s}`;
    }

    if (window.timerInterval) clearInterval(window.timerInterval);
    update();
    window.timerInterval = setInterval(update, 1000);
}

function clearAllData() {
    localStorage.clear();
    loadTasks();
    timer.textContent = '';
    location.reload();
}

