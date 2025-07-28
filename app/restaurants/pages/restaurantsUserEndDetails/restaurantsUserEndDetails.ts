import { Restaurant } from "../../models/restaurant.model.js";
import { RestaurantService } from "../../services/restaurants.service.js"
import { handleLogout } from "../../../users/pages/login/login.js"; 
import { Jelo } from "../../models/jela.model.js";
import { ReviewService } from "../../services/review.service.js";
import { Review } from "../../models/review.model.js";
import { JelaService } from "../../services/jela.service.js";

const url = window.location.search;
const searchParams = new URLSearchParams(url);
const restoranId = parseInt(searchParams.get('restoranId'));
const userId = parseInt(localStorage.getItem("id"));
const jelaContainer = document.getElementById("jela-container") as HTMLDivElement;
const komentariContainer = document.getElementById('komentari-body') as HTMLDivElement;
const restaurantService = new RestaurantService();
const reviewService = new ReviewService();
const jelaService = new JelaService(restoranId);
const commentCreate = document.getElementById('comment') as HTMLInputElement;
const oceniBtn = document.getElementById("oceni") as HTMLLIElement;
const reviewBtn = document.getElementById("posaljiRecenziju") as HTMLButtonElement;
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

function renderReviews(reviews: Review[]) {
    komentariContainer.innerHTML = "";

    reviews.forEach((review) => {
        const card = document.createElement("div");
        card.className = "review-card";
    
        const stars = renderStars(review.Rating);
    
        card.innerHTML = `
            <div class="review-stars">${stars}</div>
            <p class="review-comment">${review.ReviewText}</p>
        `;
    
        komentariContainer.appendChild(card);
    });
}


function renderJela(jela: Jelo[]) {
    jelaContainer.innerHTML = "";
    jela.forEach((jelo) => {
        if (jelo.status === 'U ponudi') {
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
        }
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

function getSelectedRating(): number | null {
    const selected = document.querySelector<HTMLInputElement>('input[name="rating"]:checked');
    return selected ? parseInt(selected.value) : null;
}


async function checkRatingPermission(userId: number, restoranId: number): Promise<string | null> {
    const url = `http://localhost:48696/api/restaurants/review/canRate?restoranId=${restoranId}&userId=${userId}`;
    console.log("Pozivam URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Greška sa servera:", errorText);
        return errorText; // vrati poruku da znaš šta tačno ne valja
    }

    return null; // dozvoljeno
}

reviewBtn.addEventListener('click', () =>{
    const rating = getSelectedRating();
    if (rating === null) {
        alert("Molimo vas da izaberete ocenu pre slanja.");
        return;
    }

    const formData: Review = {
            RestoranId: restoranId,
            UserId: userId,
            ReviewText: commentCreate.value,
            Rating: rating,
        };

    reviewService.createReview(formData);

    window.location.reload();
})

document.addEventListener("DOMContentLoaded", async () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
    logoutButton.addEventListener('click', handleLogout)

    console.log("restoranId:", restoranId);
    console.log("userId:", userId);

    try {
        // Povlačenje svih restorana
        const restaurant = await restaurantService.getById(restoranId);
        renderRestaurant(restaurant);
        const restaurantJela = await jelaService.Get()
        renderJela(restaurantJela);
    } catch (error) {
        console.error("Greška prilikom povlačenja restorana:", error.message);
    }

    try {
        // Povlačenje svih restorana
        const komentari: Review[] = await reviewService.getReviewsByRestaurantId(restoranId);
        renderReviews(komentari)
    } catch (error) {
        console.error("Greška prilikom povlačenja restorana:", error.message);
    }


    checkRatingPermission(userId, restoranId).then(message => {
        if (message) {
            reviewBtn.disabled = true;
            reviewBtn.style.backgroundColor = 'grey'
    
            const notice = document.createElement("p");
            notice.textContent = message;
            notice.style.color = "red";
            notice.style.textAlign = "center";
            notice.style.marginTop = "10px"; // malo razmaka između dugmeta i poruke

        reviewBtn.insertAdjacentElement("afterend", notice);
        }
    });
    
});

