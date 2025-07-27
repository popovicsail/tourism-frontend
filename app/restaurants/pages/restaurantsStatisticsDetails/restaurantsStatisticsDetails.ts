import {StatisticsService} from '../../services/statistics.service.js'
import {MonthlyOccupancyStatistic} from '../../models/satistics.model.js'
import {MonthlyOccupancy} from '../../models/satistics.model.js'


const chartContainer = document.getElementById('chart-container') as HTMLDivElement;
declare const Chart: typeof import("chart.js").Chart;

const url = window.location.search;
const searchParams = new URLSearchParams(url);
const restoranId = parseInt(searchParams.get('restoranId'));

function drawSummaryChart(statistics: MonthlyOccupancyStatistic) {
    const monthlyOccupancy:MonthlyOccupancy[] = statistics.monthlyOccupancy
    const labels = monthlyOccupancy.map(m => m.month);
    const data = monthlyOccupancy.map(m => m.occupancyRate);
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
            x: { title: { display: true, text: "Mesec" } },
            y: { title: { display: true, text: "Procenat popunjenosti %" }, beginAtZero: true }
            }
        }
    });
}
          

const statisticsService = new StatisticsService();

document.addEventListener("DOMContentLoaded", () => {
    statisticsService.GetOccupancyByMonth(restoranId)
    .then(drawSummaryChart)
    .catch(error => {
        alert(`Neuspešno učitavanje grafikona: ${error.message}`);
    });
})