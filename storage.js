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
        lastActivityDiv.textContent = 'Nessuna attività salvata';
        return;
    }

    function update() {
        const now = Date.now();
        const diff = Math.floor((now - last) / 1000);
        const h = String(Math.floor(diff / 3600)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        lastActivityDiv.textContent = `Ultima attività: ${h}:${m}:${s}`;
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

function exportJSON() {
    const data = JSON.parse(localStorage.getItem("tasks") || "[]");
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "storico_logbook.json";
    link.click();
}

function importJSONFromFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                const currentData = JSON.parse(localStorage.getItem("tasks") || "[]");
                const merged = currentData.concat(importedData);
                localStorage.setItem("tasks", JSON.stringify(merged));
                localStorage.setItem("lastSavedTime", Date.now());
                loadTasks();
                startTimer();
                alert("Importazione completata!");
            } else {
                alert("Formato non valido.");
            }
        } catch (err) {
            alert("Errore durante l'importazione.");
            console.error(err);
        }
    };
    reader.readAsText(file);
}
