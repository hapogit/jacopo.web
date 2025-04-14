// chart.js

function updateLogTwsChart() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    const labels = [];
    const logData = [];
    const twsData = [];

    tasks.forEach(task => {
        labels.push(task.date);
        if (task.tws && task.log) {
            twsData.push(parseFloat(task.tws));
            logData.push(parseFloat(task.log));
        } else {
            twsData.push(null);
            logData.push(null);
        }
    });

    const ctx = document.getElementById('logTwsChart').getContext('2d');
    if (window.logTwsChart && typeof window.logTwsChart.destroy === 'function') {
        window.logTwsChart.destroy();
    }

    window.logTwsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'LOG (kt)',
                    data: logData,
                    borderColor: 'blue',
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'TWS (kt)',
                    data: twsData,
                    borderColor: 'green',
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: { display: true, text: 'LOG (kt)' }
                },
                x: {
                    title: { display: true, text: 'Data e Ora' },
                    ticks: {
                        maxTicksLimit: 8,
                        autoSkip: true
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}
