import { Restaurant } from "../../models/restaurant.model.js";
import { RestaurantService } from "../../services/restaurants.service.js"
import { handleLogout } from "../../../users/pages/login/login.js"; 
import { Jelo } from "../../models/jela.model.js";

const url = window.location.search;
const searchParams = new URLSearchParams(url);
const restoranId = parseInt(searchParams.get('restoranId'));
const jelaContainer = document.getElementById("jela-container") as HTMLDivElement;
const restaurantService = new RestaurantService();
const oceniBtn = document.getElementById("oceni") as HTMLLIElement
const reviewForm = document.getElementById("review-form-container") as HTMLElement;


function renderRestaurant(restoran: Restaurant) {
    const container = document.getElementById("restoran-container") as HTMLDivElement;
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
            <p><strong>Ocena:</strong> ${renderStars(restoran.averageRating)} (${restoran.averageRating})</p>
            <input type="button" value="Rezervisi" id = "reservation"/>
        </div>
    `;

    container.appendChild(card);

    const rezervisiBtn = document.getElementById("reservation") as HTMLButtonElement;
    rezervisiBtn.addEventListener("click", () => {
        window.location.href = `../reservationForm/reservationForm.html?restoranId=${restoranId}`;
    });
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

function renderStars(rating) {
    const maxStars = 5;
    const fullStars = Math.round(rating); // Zaokruži na najbliži ceo broj
    let stars = '';

    for (let i = 0; i < maxStars; i++) {
        stars += i < fullStars ? '★' : '☆';
    }
    return stars;
}

oceniBtn.addEventListener('click', () => {
reviewForm.style.display = 'flex';
})

document.addEventListener("DOMContentLoaded", async () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
    logoutButton.addEventListener('click', handleLogout)

    try {
        // Povlačenje svih restorana
        const restaurant = await restaurantService.getById(restoranId);
        renderRestaurant(restaurant);
        renderJela(restaurant.jela);
    } catch (error) {
        console.error("Greška prilikom povlačenja restorana:", error.message);
    }
    
});

