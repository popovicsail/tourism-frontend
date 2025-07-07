import { RestaurantUtils } from "../../utils/restaurants.utils.js"
import { Reservation } from "../../models/rezervacija.model.js"
import { ReservationService } from "../../services/rezervationRestaurant.service.js";
import { handleLogout } from "../../../users/pages/login/login.js";

const userId = parseInt(localStorage.getItem('id'));
const restoranUtils = new RestaurantUtils()
const url = window.location.search;
const searchParams = new URLSearchParams(url);
const restoranId = parseInt(searchParams.get('restoranId'));
const reservationService = new ReservationService();
const reservationDatumElement = (document.getElementById("datum") as HTMLInputElement);
const reservationNoPplElement = (document.getElementById("brojLjudi") as HTMLInputElement);
const reservationObrok = document.getElementById('Obrok') as HTMLSelectElement;
const cancelBtn = document.querySelector("#cancel") as HTMLButtonElement;
const submitBtn = document.querySelector("#Dodaj") as HTMLButtonElement;
const logoutButton = document.querySelector("#logout-button") as HTMLButtonElement;


function restaurantFormInitialize(): void {
    reservationDatumElement.addEventListener("blur", () => {
        restoranUtils.validateFutureDate(reservationDatumElement)
    })

    reservationNoPplElement.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(reservationNoPplElement)
        validationRestaurantFormData()
    })


    cancelBtn.addEventListener("click",function() {
        window.location.href = "../../../index.html";
    })

    submitBtn.addEventListener("click", () => {
        submitRestaurantFormData()
    });
}



async function submitRestaurantFormData(){
    const formData: Reservation = {
        restaurantId: restoranId,
        touristId: userId, 
        date: reservationDatumElement.value,
        meal: reservationObrok.value,
        numberOfPeople: parseInt(reservationNoPplElement.value),
    };

    try {
        const createdReservation = await reservationService.Post(formData,restoranId);
        const reservationId = createdReservation.id;

        alert(`Kreirana rezervacija sa ID: ${reservationId}`);
        window.location.href = "../../../index.html";
    } catch (error) {
        console.error("Greška prilikom kreiranja rezervacije:", error.message);
    }
}





function validationRestaurantFormData() {
    const reservationNoPplFlag = restoranUtils.validationFinal(reservationNoPplElement)
    const reservationDateFlag = restoranUtils.validateFutureDate(reservationDatumElement)


    if (!reservationNoPplFlag || !reservationDateFlag ) {
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