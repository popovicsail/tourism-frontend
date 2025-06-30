import { Tour } from "../../../tours/models/tour.model.js";
import { ToursServices } from "../../services/tours.services.js"
import { ToursUtils } from "../../utils/tours.utils.js"
import { handleLogout } from "../../../users/pages/login/login.js"
const toursServices = new ToursServices()
const toursUtils = new ToursUtils()

const guideId = parseInt(localStorage.getItem('id'));
let logoutButton

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

    tourCreateNameInput = document.getElementById("tour-create-name-input") as HTMLInputElement
    tourCreateDescriptionInput = document.getElementById("tour-create-description-input") as HTMLInputElement
    tourCreateDateTimeInput = document.getElementById("tour-create-datetime-input") as HTMLInputElement
    tourCreateMaxGuestsInput = document.getElementById("tour-create-maxguests-input") as HTMLInputElement

    tourCreateCancelButton = document.getElementById("tour-create-cancel-button") as HTMLButtonElement
    tourCreateSubmitButton = document.getElementById("tour-create-submit-button") as HTMLButtonElement

    tourFormInitialize(guideId);
})

function tourFormInitialize(guideId: number): void {
    tourCreateNameInput.addEventListener("blur", () => {
        tourNameFlag = toursUtils.validationSingleInput(tourCreateNameInput)
        validationTourFormData()
    })

    tourCreateDescriptionInput.addEventListener("blur", () => {
        tourDescriptionFlag = toursUtils.validationSingleInput(tourCreateDescriptionInput)
        validationTourFormData()
    })

    tourCreateDateTimeInput.addEventListener("blur", () => {
        tourDateTimeFlag = toursUtils.validationSingleInput(tourCreateDateTimeInput)
        validationTourFormData()
    })

    tourCreateMaxGuestsInput.addEventListener("blur", () => {
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
    const status = "Not ready"

    const newTour: Tour = { name, description, dateTime, maxGuests, status, guideId }

    toursServices.add(newTour)
        .then((tour: Tour) => {
            window.location.href = `../toursedit/toursedit.html?tourId=${tour.id}`
        })
        .catch(error => console.error(error.status, error.message))
}

