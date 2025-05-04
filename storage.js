// storage.js

function loadTasks() {
    const tasksTable = document.getElementById('tasksTable').getElementsByTagName('tbody')[0];
    tasksTable.innerHTML = "";

    try {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const row = tasksTable.insertRow();
            row.insertCell(0).textContent = task.date;
            row.insertCell(1).textContent = task.location || '—';
            row.insertCell(2).textContent = `${task.tws}kt`;
            row.insertCell(3).textContent = `${task.twa}°`;
            row.insertCell(4).textContent = task.log;
            row.insertCell(5).textContent = task.sails;
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