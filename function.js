// function.js

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    startTimer();
    initMap();

    // Pulisci cronologia
    const clearHistoryBtn = document.getElementById('clearHistory');
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearAllData);

    // Pulsante Salva
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveActivity);
});
