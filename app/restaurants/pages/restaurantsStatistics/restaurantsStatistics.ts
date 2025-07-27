import {StatisticsService} from '../../services/statistics.service.js'
import {RestoranStatistics} from '../../models/satistics.model.js'


const chartContainer = document.getElementById('chart-container') as HTMLDivElement;
declare const Chart: typeof import("chart.js").Chart;

function drawSummaryChart(statistics: RestoranStatistics[]) {
    const labels = statistics.map(s => s.restoranName);
    const data = statistics.map(s => s.totalBookings);
    // Kreiranje canvas-a
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 250;
    chartContainer.appendChild(canvas);
    

    const ctx = canvas.getContext("2d");

    // Crtanje jednog zajedničkog grafikona
    new Chart(ctx, {
    type: 'bar',
        data: {
            labels,
            datasets: [{
            label: "Broj rezervacija po restoranu",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)"
            }]
        },
        options: {
            responsive: true,
            plugins: {
            title: {
                display: true,
                text: "Ukupan broj rezervacija po restoranu"
            }
            },
            scales: {
            x: { title: { display: true, text: "Restoran" } },
            y: { title: { display: true, text: "Broj rezervacija" }, beginAtZero: true }
            }

            ,onClick: (_, elements) => {
                if (elements.length > 0) {
                  const index = elements[0].index;
                  const restoranId = statistics[index].restoranId;
                  window.location.href = `../restaurantsStatisticsDetails/restaurantsStatisticsDetails.html?restoranId=${restoranId}`;
                }
            }
        }
    });
}
          

const statisticsService = new StatisticsService();

document.addEventListener("DOMContentLoaded", () => {
    statisticsService.GetTotalReservationsForYear()
    .then(drawSummaryChart)
    .catch(error => {
        console.error("Neuspešno učitavanje grafikona:", error.message);
    });
})