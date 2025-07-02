import { Restaurant } from "../../models/restaurant.model.js";
import { RestaurantService } from "../../services/restaurants.service.js"
import { handleLogout } from "../../../users/pages/login/login.js"; 

const restaurantService = new RestaurantService();


function renderRestaurants(restorani: Restaurant[]) {
    const container = document.getElementById("restoran-container") as HTMLDivElement;
    container.innerHTML = "";

    restorani.forEach((restoran) => {
        const card = document.createElement("div");
        card.className = "restoran-card";

        card.innerHTML = `
             <img src="${restoran.imageUrl}" alt="${restoran.name}" class="restaurant-image">
            <div class="restaurant-info">
                <h3>${restoran.name}</h3>
                <p><strong>Opis:</strong> ${restoran.description}</p>
                <p><strong>Kapacitet:</strong> ${restoran.capacity}</p>
                <input type="button" value="Detaljnije" class = "details"/>
            </div>
        `;

        container.appendChild(card);

        const detailsButtons = document.querySelectorAll(".details");
        detailsButtons.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = `../restaurantsUserEndDetails/restaurantsUserEndDetails.html?restoranId=${restoran.id}`
        });
    });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Povlačenje svih restorana
        const allRestaurants: Restaurant[] = await restaurantService.getAll();

        // Filtriranje restorana sa statusom "Otvoren"
        const openRestaurants = allRestaurants.filter((restaurant) => restaurant.status === "Otvoren");

        console.log("Otvoreni restorani:", openRestaurants);

        // Renderovanje otvorenih restorana (primer)
        renderRestaurants(openRestaurants);
    } catch (error) {
        console.error("Greška prilikom povlačenja restorana:", error.message);
    }
});


document.addEventListener("DOMContentLoaded", () => {
        const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
        logoutButton.addEventListener('click', handleLogout)
})