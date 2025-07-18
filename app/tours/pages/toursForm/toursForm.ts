import { handleLogout } from "../../../users/pages/login/login.js"
import { Tour } from "../../../tours/models/tour.model.js";
import { ToursServices } from "../../services/tours.services.js"
import { ToursUtils } from "../../utils/tours.utils.js"
const toursServices = new ToursServices()
const toursUtils = new ToursUtils()
const guideId = parseInt(localStorage.getItem('id'));

let logoutButton

let tourCreateMain
let tourCreateNameInput
let tourCreateDescriptionInput
let tourCreateDateTimeInput
let tourCreateMaxGuestsInput
let tourCreateCancelButton
let tourCreateSubmitButton

let tourNameFlag = false
let tourDescriptionFlag = false
let tourDateTimeFlag = false
let tourMaxGuestsFlag = false

document.addEventListener("DOMContentLoaded", () => {
    logoutButton = document.getElementById('logout-button') as HTMLElement;
    logoutButton.addEventListener('click', handleLogout)

    tourCreateMain = document.getElementById("tour-create-main") as HTMLDivElement
    tourCreateNameInput = tourCreateMain.querySelector(".tour-create-name-input") as HTMLInputElement
    tourCreateDescriptionInput = tourCreateMain.querySelector(".tour-create-description-input") as HTMLInputElement
    tourCreateDateTimeInput = tourCreateMain.querySelector(".tour-create-datetime-input") as HTMLInputElement
    tourCreateMaxGuestsInput = tourCreateMain.querySelector(".tour-create-maxguests-input") as HTMLInputElement
    tourCreateCancelButton = tourCreateMain.querySelector(".cancel-button") as HTMLButtonElement
    tourCreateSubmitButton = tourCreateMain.querySelector(".submit-button") as HTMLButtonElement

    tourFormInitialize(guideId);
})

function tourFormInitialize(guideId: number): void {
    tourCreateNameInput.addEventListener("input", () => {
        tourNameFlag = toursUtils.validationSingleInput(tourCreateNameInput)
        validationTourFormData()
    })

    tourCreateDescriptionInput.addEventListener("input", () => {
        tourDescriptionFlag = toursUtils.validationSingleInput(tourCreateDescriptionInput)
        validationTourFormData()
    })

    tourCreateDateTimeInput.addEventListener("input", () => {
        tourDateTimeFlag = toursUtils.validationSingleInput(tourCreateDateTimeInput)
        validationTourFormData()
    })

    tourCreateMaxGuestsInput.addEventListener("input", () => {
        tourMaxGuestsFlag = toursUtils.validationSingleInput(tourCreateMaxGuestsInput)
        validationTourFormData()
    })

    tourCreateCancelButton.addEventListener("click", () => window.location.href = `../toursOverview/toursOverview.html`)

    tourCreateSubmitButton.addEventListener("click", () => {
        submitTourFormData(guideId)
    });

    validationTourFormData()
}

function validationTourFormData() {
    if (!tourNameFlag || !tourDescriptionFlag || !tourDateTimeFlag || !tourMaxGuestsFlag) {
        tourCreateSubmitButton.disabled = true;
        tourCreateSubmitButton.style.backgroundColor = "grey"
        return;
    }
    tourCreateSubmitButton.disabled = false;
    tourCreateSubmitButton.style.backgroundColor = "green"
    return;
}

function submitTourFormData(guideId: number): void {
    const name = tourCreateNameInput.value
    const description = tourCreateDescriptionInput.value
    const dateTime = tourCreateDateTimeInput.value
    const maxGuests = parseInt(tourCreateMaxGuestsInput.value)
    const status = "Not Ready"

    const newTour: Tour = { name, description, dateTime, maxGuests, status, guideId }

    toursServices.add(newTour)
        .then((tour: Tour) => {
            window.location.href = `../toursedit/toursedit.html?tourId=${tour.id}`
        })
        .catch(error => console.error(error.status, error.message))
}

