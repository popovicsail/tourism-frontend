import { ReservationService } from "../../services/rezervationRestaurant.service.js";
import { Reservation } from "../../models/rezervacija.model.js"
import { Restaurant } from "../../models/restaurant.model.js";
import { RestaurantService } from "../../services/restaurants.service.js";

const restoranService = new RestaurantService();
const reservationService = new ReservationService();
const userId = parseInt(localStorage.getItem('id'));


async function fetchAndRenderReservations(userId : number) {
    try {
        const reservations = await reservationService.getAll(userId);
        renderReservations(reservations);
    } catch (error) {
        console.error("Greška prilikom povlačenja rezervacija:", error.message);
    }
}

async function renderReservations(reservations: Reservation[]) {
    const container = document.getElementById("reservations-container") as HTMLDivElement;
    container.innerHTML = "";

    if (reservations.length === 0) {
        container.innerHTML = "<p>Nemate nijednu rezervaciju.</p>";
        return;
    }

    for (const reservation of reservations) {
        const restoranId :number= reservation.restaurantId
        const restaurant : Restaurant = await getRestaurantById(restoranId);

        const card = document.createElement("div");
        card.className = "reservation-card";

        card.innerHTML = `
            <h3>Rezervacija ID: ${reservation.id}</h3>
            <p><strong>Datum:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
            <p><strong>Restoran:</strong> ${restaurant.name}</p>
            <p><strong>Obrok:</strong> ${reservation.meal}<p>
            <p><strong>Broj osoba:</strong> ${reservation.numberOfPeople}</p>
            <input type="button" value="Izbrisi" class = "izbrisi"/>
        `;

        container.appendChild(card);

        const izbrisButtons = document.querySelectorAll(".izbrisi");
        izbrisButtons.forEach((button) => {
            button.addEventListener("click", () => {
                reservationService.Delete(reservation.id);
                window.location.reload();
            });
        });
    }
}

async function getRestaurantById(restaurantId) {
    try {
        return await restoranService.getById(restaurantId);
    } catch (error) {
        console.error("Greška prilikom kreiranja rezervacije:", error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!userId) {
        alert("Niste prijavljeni!");
        window.location.href = "../../../index.html";
        return;
    }

    fetchAndRenderReservations(userId);

    const logoutButton = document.getElementById("logout-button") as HTMLButtonElement;
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("userId");
        window.location.href = "../../../index.html";
    });
});