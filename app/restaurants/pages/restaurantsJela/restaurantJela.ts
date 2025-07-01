import { Jelo } from "../../models/jela.model.js";
import { Restaurant } from "../../models/restaurant.model.js";
import { RestaurantService } from "../../services/restaurants.service.js";
import { JelaService } from "../../services/jela.service.js";


const url = window.location.search;
const searchParams = new URLSearchParams(url);
const restoranId = parseInt(searchParams.get('restoranId'));
const jelaContainer = document.getElementById("jela-container") as HTMLDivElement;
const restaurantService = new RestaurantService();
const jeloService = new JelaService(restoranId);
const restoranPromise: Promise<Restaurant> = restaurantService.getById(restoranId);
const dodajJelo = document.querySelector('.add-meal-button') as HTMLButtonElement;
const backButton = document.getElementById("backButton") as HTMLAnchorElement;



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
                <input type="button" value="Izbrisi" class = "izbrisi"/>
            </div>
        `;

        jelaContainer.appendChild(card);

        const deleteButtons = document.querySelectorAll(".izbrisi");
        deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            jeloService.Delete(jelo.id)
                .then(() => {
                    console.log(`Jelo sa ID ${jelo.id} je obrisano.`);
                    restoranPromise.then(() => {
                        window.location.reload();
                    });
                })
                .catch((error) => {
                    console.error("Greška prilikom brisanja jela:", error.message);
                });
        });
    });
    });
}

dodajJelo.addEventListener("click",() => {
    window.location.href = `../restaurantsJelaCreate/restaurantsJelaCreate.html?restoranId=${restoranId}`;
})

backButton.addEventListener("click", () => {
    if (restoranId) {
        backButton.href = `../restaurantsUpdate/restaurantsUpdate.html?id=${restoranId}`;
    } else {
        console.error("ID restorana nije pronađen u URL-u.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    restoranPromise.then((restoran) => {
        console.log(`Restoran: ${restoran.name}`);
        if (restoran.jela) {
            renderJela(restoran.jela);
        } else {
            console.error("Restoran nema jela.");
        }
    }).catch((error) => {
        console.error("Greška prilikom preuzimanja restorana:", error.message);
    });
});