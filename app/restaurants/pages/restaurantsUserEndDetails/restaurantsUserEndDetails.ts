import { Restaurant } from "../../models/restaurant.model.js";
import { RestaurantService } from "../../services/restaurants.service.js"
import { handleLogout } from "../../../users/pages/login/login.js"; 
import { Jelo } from "../../models/jela.model.js";

const url = window.location.search;
const searchParams = new URLSearchParams(url);
const restoranId = parseInt(searchParams.get('restoranId'));
const jelaContainer = document.getElementById("jela-container") as HTMLDivElement;
const restaurantService = new RestaurantService();


function renderRestaurant(restoran: Restaurant) {
    const container = document.getElementById("restoran-container") as HTMLDivElement;
    container.innerHTML = "";
    const card = document.createElement("div");
    card.className = "restoran-card";

    card.innerHTML = `
            <img src="${restoran.imageUrl}" alt="${restoran.name}" class="restaurant-image">
        <div class="restaurant-info">
            <h3>${restoran.name}</h3>
            <p><strong>Opis:</strong> ${restoran.description}</p>
            <p><strong>Kapacitet:</strong> ${restoran.capacity}</p>
            <p><strong>Latitude:</strong> ${restoran.latitude}</p>
            <p><strong>Longitude:</strong> ${restoran.longitude}</p>
        </div>
    `;

    container.appendChild(card);

}

function renderJela(jela: Jelo[]) {
    jelaContainer.innerHTML = "";
    jela.forEach((jelo) => {
        const card = document.createElement("div");
        card.className = "jelo-card";

        card.innerHTML = `
            <img src="${jelo.imageUrl}" alt="${jelo.name}" class="jelo-image">
            <div class="jelo-info">
                <h3>${jelo.order}. ${jelo.name}</h3>
                <p><strong>Cena:</strong> ${jelo.price} RSD</p>
                <p><strong>Sastojci:</strong> ${jelo.ingredients}</p>
            </div>
        `;

        jelaContainer.appendChild(card);

    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Povlačenje svih restorana
        const restaurant = await restaurantService.getById(restoranId);
        renderRestaurant(restaurant);
        renderJela(restaurant.jela);
    } catch (error) {
        console.error("Greška prilikom povlačenja restorana:", error.message);
    }
});


document.addEventListener("DOMContentLoaded", () => {
        const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
        logoutButton.addEventListener('click', handleLogout)
})