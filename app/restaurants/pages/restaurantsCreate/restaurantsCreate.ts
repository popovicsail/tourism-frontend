import { Restaurant } from '../../models/restaurant.model.js';
import { RestaurantService } from '../../services/restaurants.service.js'
import {RestaurantUtils} from '../../utils/restaurants.utils.js'
import { handleLogout } from "../../../users/pages/login/login.js";



const ownerID = parseInt(localStorage.getItem('id'));
const restoranService = new RestaurantService();
const restoranUtils = new RestaurantUtils();
const restoranNameElement = (document.getElementById("name") as HTMLInputElement);
const restoranDescriptionElement = (document.getElementById("description") as HTMLInputElement);
const restoranCapacityElement = ((document.getElementById("capacity") as HTMLInputElement));
const restoranImageElement = (document.getElementById("image") as HTMLInputElement);
const restoranLatitudeElement = ((document.getElementById("Latitude") as HTMLInputElement));
const restoranLongitudeElement = ((document.getElementById("Longitude") as HTMLInputElement));
const restoranStatusElement = (document.getElementById("Status") as HTMLSelectElement);
const cancelBtn = document.querySelector("#cancel") as HTMLButtonElement;
const submitBtn = document.querySelector("#Dodaj") as HTMLButtonElement;
const logoutButton = document.querySelector("#logout-button") as HTMLButtonElement;



function restaurantFormInitialize(): void {
    restoranNameElement.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(restoranNameElement)
        validationRestaurantFormData()
    })

    restoranDescriptionElement.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(restoranDescriptionElement)
        validationRestaurantFormData()
    })

    restoranCapacityElement.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(restoranCapacityElement)
        validationRestaurantFormData()
    })

    restoranImageElement.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(restoranImageElement)
        validationRestaurantFormData()
    })

    restoranLatitudeElement.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(restoranLatitudeElement)
        validationRestaurantFormData()
    })

    restoranLongitudeElement.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(restoranLongitudeElement)
        validationRestaurantFormData()
    })

    cancelBtn.addEventListener("click",function() {
        window.location.href = "../../restaurants.html";
    })

    submitBtn.addEventListener("click", () => {
        submitRestaurantFormData()
    });
}

async function submitRestaurantFormData(){
    const formData: Restaurant = {
        name: restoranNameElement.value,
        description: restoranDescriptionElement.value,
        capacity: parseInt(restoranCapacityElement.value) || 0, 
        imageUrl: restoranImageElement.value,
        latitude: parseFloat(restoranLatitudeElement.value) || 0,
        longitude: parseFloat(restoranLongitudeElement.value) || 0,
        status: restoranStatusElement.value,
        ownerID: ownerID,
    };

    try {
        const createdRestaurant = await restoranService.Post(formData);
        const restaurantId = createdRestaurant.id;

        console.log(`Kreiran restoran sa ID: ${restaurantId}`);
        window.location.href = `../restaurantsJela/restaurantsJela.html?restoranId=${restaurantId}`;
    } catch (error) {
        console.error("Greška prilikom kreiranja restorana:", error.message);
    }
}

function validationRestaurantFormData() {
    const restoranNameFlag = restoranUtils.validationFinal(restoranNameElement)
    const restoranDescriptionFlag = restoranUtils.validationFinal(restoranDescriptionElement)
    const restoranCapacityFlag = restoranUtils.validationFinal(restoranCapacityElement)
    const restoranImageFlag = restoranUtils.validationFinal(restoranImageElement)
    const restoranLatitudeFlag = restoranUtils.validationFinal(restoranLatitudeElement)
    const restoranLongitudeFlag = restoranUtils.validationFinal(restoranLongitudeElement);


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



document.addEventListener("DOMContentLoaded", async () => {

    cancelBtn.addEventListener("click", () => {
        window.location.href = "../../restaurants.html";
    });



    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }

    restaurantFormInitialize();
});

