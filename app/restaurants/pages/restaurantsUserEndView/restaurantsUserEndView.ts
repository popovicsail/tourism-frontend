import { Restaurant } from "../../models/restaurant.model.js";
import { RestaurantService } from "../../services/restaurants.service.js"
import { handleLogout } from "../../../users/pages/login/login.js"; 

const restaurantService = new RestaurantService();
const sortSelect = document.getElementById("sort-select") as HTMLSelectElement;
const perPageSelect = document.getElementById("per-page-select") as HTMLSelectElement;
const paginationContainer = document.getElementById("pagination-container") as HTMLDivElement;
let openRestaurants;

function generatePaginationButtons(totalRestaurants: number, perPage: number) {
    const paginationContainer = document.getElementById("pagination-container") as HTMLDivElement;
    paginationContainer.innerHTML = ""; // Čisti prethodne dugmadi

    const totalPages = Math.ceil(totalRestaurants / perPage); // Izračunavanje ukupnog broja stranica

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.className = "pagination-button";
        button.dataset.page = i.toString();
        button.textContent = i.toString();
        paginationContainer.appendChild(button);
    }
}

function paginateRestaurants(restaurants: Restaurant[], page: number, perPage: number): Restaurant[] {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return restaurants.slice(startIndex, endIndex);
}

function sortRestaurants(restaurants: Restaurant[], sortBy: string): Restaurant[] {
    if (sortBy === "name") {
        return restaurants.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "capacity") {
        return restaurants.sort((a, b) => b.capacity - a.capacity);
    }
    return restaurants;
}

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
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
    logoutButton.addEventListener('click', handleLogout)

    try {
        // Povlačenje svih restorana
        const allRestaurants: Restaurant[] = await restaurantService.getAll();

        // Filtriranje restorana sa statusom "Otvoren"
        openRestaurants = allRestaurants.filter((restaurant) => restaurant.status === "Otvoren");

        console.log("Otvoreni restorani:", openRestaurants);

        // Renderovanje otvorenih restorana (primer)
        renderRestaurants(openRestaurants);
    } catch (error) {
        console.error("Greška prilikom povlačenja restorana:", error.message);
    }

    let currentPage = 1;
    let perPage = 5;
    let sortBy = "name";

    function updateView() {
        const sortedRestaurants = sortRestaurants(openRestaurants, sortBy);
        const paginatedRestaurants = paginateRestaurants(sortedRestaurants, currentPage, perPage);
        renderRestaurants(paginatedRestaurants);

        // Dinamičko generisanje dugmadi za paginaciju
        generatePaginationButtons(openRestaurants.length, perPage);
    }

    sortSelect.addEventListener("change", (event) => {
        sortBy = (event.target as HTMLSelectElement).value;
        updateView();
    });

    perPageSelect.addEventListener("change", (event) => {
        perPage = parseInt((event.target as HTMLSelectElement).value, 10);
        currentPage = 1; // Resetujemo na prvu stranicu
        updateView();
    });

    paginationContainer.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains("pagination-button")) {
            currentPage = parseInt(target.dataset.page || "1", 10);
            updateView();
        }
    });

    updateView();

});
