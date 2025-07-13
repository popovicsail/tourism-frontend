import { Restaurant } from "../../models/restaurant.model.js";
import { RestaurantService } from "../../services/restaurants.service.js";
import { handleLogout } from "../../../users/pages/login/login.js";

const restaurantService = new RestaurantService();
const sortSelect = document.getElementById("sort-select") as HTMLSelectElement;
const perPageSelect = document.getElementById("per-page-select") as HTMLSelectElement;
const paginationContainer = document.getElementById("pagination-container") as HTMLDivElement;

let currentPage = 1;
let perPage = 5;
let sortBy = "Name";
let totalCount = 0;
const statusFilter = "Otvoren"; // Fiksno filtriramo samo otvorene restorane

function generatePaginationButtons(totalRestaurants: number, perPage: number) {
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalRestaurants / perPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.className = "pagination-button";
        button.dataset.page = i.toString();
        button.textContent = i.toString();
        paginationContainer.appendChild(button);
    }
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
                <p><strong>Ocena:</strong> ${renderStars(restoran.averageRating)} (${restoran.averageRating})</p>
                <input type="button" value="Detaljnije" class="details"/>
            </div>
        `;

        container.appendChild(card);

        const detailsButton = card.querySelector(".details") as HTMLButtonElement;
        detailsButton.addEventListener("click", () => {
            window.location.href = `../restaurantsUserEndDetails/restaurantsUserEndDetails.html?restoranId=${restoran.id}`;
        });
    });
}

async function updateView() {
    try {
        const result = await restaurantService.getPaged(currentPage, perPage, sortBy, "ASC", statusFilter);
        totalCount = result.totalCount;

        renderRestaurants(result.data);
        generatePaginationButtons(totalCount, perPage);
    } catch (error) {
        console.error("Greška prilikom ažuriranja prikaza:", error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
    logoutButton.addEventListener('click', handleLogout);

    sortSelect.addEventListener("change", (event) => {
        sortBy = (event.target as HTMLSelectElement).value;
        currentPage = 1;
        updateView();
    });

    perPageSelect.addEventListener("change", (event) => {
        perPage = parseInt((event.target as HTMLSelectElement).value, 10);
        currentPage = 1;
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


function renderStars(rating) {
    const maxStars = 5;
    const fullStars = Math.round(rating); // Zaokruži na najbliži ceo broj
    let stars = '';

    for (let i = 0; i < maxStars; i++) {
        stars += i < fullStars ? '★' : '☆';
    }
    return stars;
}
