import { Tour } from "../../../tours/models/tour.model.js";
import { ToursServices } from "../../services/tours.services.js"
import { ToursUtils } from "../../utils/tours.utils.js"
import { handleLogout } from "../../../users/pages/login/login.js"
const toursServices = new ToursServices()
const toursUtils = new ToursUtils()

const guideId = parseInt(localStorage.getItem('id'));

let logoutButton

let tourNameElement
let tourDescriptionElement
let tourDateTimeElement
let tourMaxGuestsElement
let tourCancelButtonElement
let tourSubmitButtonElement
let tourFormLoadingElement

function tourFormInitialize(guideId: number): void {
    tourNameElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourNameElement)
        validationTourFormData()
    })

    tourDescriptionElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourDescriptionElement)
        validationTourFormData()
    })

    tourDateTimeElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourDateTimeElement)
        validationTourFormData()
    })

    tourMaxGuestsElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourMaxGuestsElement)
        validationTourFormData()
    })

    tourCancelButtonElement.addEventListener("click", () => window.location.href = `../toursOverview/toursOverview.html`)

    tourSubmitButtonElement.addEventListener("click", () => {
        submitTourFormData(guideId)
    });
}

function validationTourFormData() {
    const tourNameFlag = toursUtils.validationFinal(tourNameElement)
    const tourDescriptionFlag = toursUtils.validationFinal(tourDescriptionElement)
    const tourDateTimeFlag = toursUtils.validationFinal(tourDateTimeElement)
    const tourMaxGuestsFlag = toursUtils.validationFinal(tourMaxGuestsElement)

    if (!tourNameFlag || !tourDescriptionFlag || !tourDateTimeFlag || !tourMaxGuestsFlag) {
        tourSubmitButtonElement.disabled = true;
        tourSubmitButtonElement.style.backgroundColor = "grey"
        return;
    }
    tourSubmitButtonElement.disabled = false;
    tourSubmitButtonElement.style.backgroundColor = "green"
    return;
}

function submitTourFormData(guideId: number): void {
    const name = tourNameElement.value
    const description = tourDescriptionElement.value
    const dateTime = tourDateTimeElement.value
    const maxGuests = parseInt(tourMaxGuestsElement.value)
    const status = "U pripremi"

    const newTour: Tour = { name, description, dateTime, maxGuests, status, guideId }

    tourFormLoadingElement.style.display = "flex";
    toursServices.add(newTour)
        .then((data: Tour) => {
            tourFormLoadingElement.style.display = "none";
            window.location.href = `../toursEdit/toursEdit.html?guideId=${guideId}&tourId=${data.id}`
        })
        .catch(error => console.error(error.status, error.message))
}

document.addEventListener("DOMContentLoaded", () => {
        logoutButton = document.querySelector('#logout-button') as HTMLElement;
        logoutButton.addEventListener('click', handleLogout)

    tourNameElement = document.querySelector("#tourNameElement") as HTMLInputElement
    tourDescriptionElement = document.querySelector("#tourDescriptionElement") as HTMLInputElement
    tourDateTimeElement = document.querySelector("#tourDateTimeElement") as HTMLInputElement
    tourMaxGuestsElement = document.querySelector("#tourMaxGuestsElement") as HTMLInputElement
    tourCancelButtonElement = document.getElementById("tourFormCancelButtonElement") as HTMLButtonElement
    tourSubmitButtonElement = document.getElementById("tourFormSubmitButtonElement") as HTMLButtonElement
    tourFormLoadingElement = document.querySelector(".tourFormLoadingElement") as HTMLButtonElement

    tourFormInitialize(guideId);
})