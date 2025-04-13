// function.js

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    startTimer();
    initMap();

    // Pulisci cronologia
    const clearHistoryBtn = document.getElementById('clearHistory');
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearAllData);

    // Esporta JSON
    const downloadJSONBtn = document.getElementById('downloadJSON');
    if (downloadJSONBtn) downloadJSONBtn.addEventListener('click', exportJSON);

    // Importa JSON
    const importJSONInput = document.getElementById("importJSON");
    if (importJSONInput) {
        importJSONInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) importJSONFromFile(file);
        });
    }

    // Pulsante Salva
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveActivity);
});
