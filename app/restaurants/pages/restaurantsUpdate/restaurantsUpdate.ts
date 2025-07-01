import { Restaurant } from '../../models/restaurant.model.js';
import { RestaurantService } from '../../services/restaurants.service.js'
import {RestaurantUtils} from '../../utils/restaurants.utils.js'
import { handleLogout } from "../../../users/pages/login/login.js";


const url = window.location.search;
const searchParams = new URLSearchParams(url);
const restoranId = parseInt(searchParams.get('id'));
const ownerID = parseInt(localStorage.getItem('id'));
const restoranService = new RestaurantService();
const restoranUtils = new RestaurantUtils();
const nameIzmena = (document.getElementById("name") as HTMLInputElement);
const descriptionIzmena = (document.getElementById("description") as HTMLInputElement);
const capacityIzmena = ((document.getElementById("capacity") as HTMLInputElement));
const imageUrlIzmena = (document.getElementById("image") as HTMLInputElement);
const latitude = ((document.getElementById("Latitude") as HTMLInputElement));
const longitude = ((document.getElementById("Longitude") as HTMLInputElement));
const status = (document.getElementById("Status") as HTMLSelectElement);
const cancelBtn = document.querySelector("#cancel") as HTMLButtonElement;
const submitBtn = document.querySelector("#Dodaj") as HTMLButtonElement;
const logoutButton = document.querySelector("#logout-button") as HTMLButtonElement;



function restaurantFormInitialize(): void {
    nameIzmena.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(nameIzmena)
        validationRestaurantFormData()
    })

    descriptionIzmena.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(descriptionIzmena)
        validationRestaurantFormData()
    })

    capacityIzmena.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(capacityIzmena)
        validationRestaurantFormData()
    })

    imageUrlIzmena.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(imageUrlIzmena)
        validationRestaurantFormData()
    })

    latitude.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(latitude)
        validationRestaurantFormData()
    })

    longitude.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(longitude)
        validationRestaurantFormData()
    })

    cancelBtn.addEventListener("click",function() {
        window.location.href = "../../restaurants.html";
    })

    submitBtn.addEventListener("click", () => {
        submitRestaurantFormData()
    });
}

function getById(id) {
    restoranService.getById(id)
    .then((restaurant:Restaurant) => {
        nameIzmena.value = restaurant.name
        descriptionIzmena.value = restaurant.description
        capacityIzmena.value = restaurant.capacity.toString()
        imageUrlIzmena.value = restaurant.imageUrl
        latitude.value = restaurant.latitude.toString()
        longitude.value = restaurant.longitude.toString()
        status.value = restaurant.status;
    })
    .catch ((error) => {
        console.error(error.status, error.message)
    })
}


function validationRestaurantFormData() {
    const restoranNameFlag = restoranUtils.validationFinal(nameIzmena)
    const restoranDescriptionFlag = restoranUtils.validationFinal(descriptionIzmena)
    const restoranCapacityFlag = restoranUtils.validationFinal(capacityIzmena)
    const restoranImageFlag = restoranUtils.validationFinal(imageUrlIzmena)
    const restoranLatitudeFlag = restoranUtils.validationFinal(latitude)
    const restoranLongitudeFlag = restoranUtils.validationFinal(longitude);


    if (!restoranNameFlag || !restoranDescriptionFlag || !restoranCapacityFlag || !restoranImageFlag 
        || !restoranLatitudeFlag || !restoranLongitudeFlag) {
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = "grey"
        return;
    }
    submitBtn.disabled = false;
    submitBtn.style.backgroundColor = "green"
    return;
}

async function submitRestaurantFormData(){
    const formData: Restaurant = {
        name: nameIzmena.value,
        description: descriptionIzmena.value,
        capacity: parseInt(capacityIzmena.value),
        imageUrl: imageUrlIzmena.value,
        latitude: parseFloat(latitude.value),
        longitude: parseFloat(longitude.value),
        status: status.value,
        ownerID: ownerID,
    };

    
    const options = status.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === status.value) {
            status.selectedIndex = i;
            break;
        }
    }

    try {
        const createdRestaurant = await restoranService.update(restoranId,formData);
        const restaurantId = createdRestaurant.id;

        console.log(`Kreiran restoran sa ID: ${restaurantId}`);
        window.location.href = `../restaurantsJela/restaurantsJela.html?restoranId=${restaurantId}`;
    } catch (error) {
        console.error("Greška prilikom kreiranja restorana:", error.message);
    }
}






document.addEventListener('DOMContentLoaded', async () => {

    try {
        const restaurant = await restoranService.getById(restoranId);

        // Provera da li restoran ima bar 5 jela
        const hasEnoughMeals = restaurant.jela && restaurant.jela.length >= 5;

        // Provera da li restoran ima sliku enterijera
        const hasInteriorImage = restaurant.imageUrl && restaurant.imageUrl.trim() !== "";

        if (hasEnoughMeals && hasInteriorImage) {
            const openOption = document.createElement("option");
            openOption.value = "Otvoren";
            openOption.textContent = "Otvoren";
            status.appendChild(openOption);
            alert("Restoran sada moze biti otvoren!");
        } else {
            alert("Restoran mora imati bar 5 jela i jednu sliku enterijera da bi bio otvoren.");
        }
    } catch (error) {
        console.error("Greška prilikom validacije restorana:", error.message);
    }

    if (logoutButton) {
            logoutButton.addEventListener("click", handleLogout);
        }
    restaurantFormInitialize()

    getById(restoranId)
});