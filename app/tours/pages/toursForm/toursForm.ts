import { Tour } from "../../../tours/models/tour.model.js";
import { ToursServices } from "../../services/tours.services.js"
import { ToursUtils } from "../../utils/tours.utils.js"
const toursServices = new ToursServices()
const toursUtils = new ToursUtils()

const url = window.location.search
const searchParams = new URLSearchParams(url)
const guideId = parseInt(searchParams.get("guideId"))

const tourName = document.querySelector("#tourName") as HTMLInputElement
const tourDescription = document.querySelector("#tourDescription") as HTMLInputElement
const tourDateTime = document.querySelector("#tourDateTime") as HTMLInputElement
const tourMaxGuests = document.querySelector("#tourMaxGuests") as HTMLInputElement


function tourFormInitialize(guideId: number): void {
    tourName.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourName)
        validationTourFormData()
    })

    tourDescription.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourDescription)
        validationTourFormData()
    })

    tourDateTime.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourDateTime)
        validationTourFormData()
    })

    tourMaxGuests.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourMaxGuests)
        validationTourFormData()
    })

    const submitButton = document.getElementById("submitButton") as HTMLButtonElement
    submitButton.addEventListener("click", () => {
        submitTourFormData(guideId)
    });

    const cancelButton = document.getElementById("cancelButton") as HTMLButtonElement
    cancelButton.addEventListener("click", () => window.location.href = `../toursOverview/toursOverview.html?guideId=${guideId}`)
}

function validationTourFormData() {
    const submitButton = document.getElementById("submitButton") as HTMLButtonElement

    const tourNameFlag = toursUtils.validationFinal(tourName)
    const tourDescriptionFlag = toursUtils.validationFinal(tourDescription)
    const tourDateTimeFlag = toursUtils.validationFinal(tourDateTime)
    const tourMaxGuestsFlag = toursUtils.validationFinal(tourMaxGuests)

    if (!tourNameFlag || !tourDescriptionFlag || !tourDateTimeFlag || !tourMaxGuestsFlag) {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "grey"
        return;
    }
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "green"
    return;
}

function submitTourFormData(guideId: number): void {
    const name = tourName.value
    const description = tourDescription.value
    const dateTime = tourDateTime.value
    const maxGuests = parseInt(tourMaxGuests.value)
    const status = "U pripremi"

    const newTour: Tour = { name, description, dateTime, maxGuests, status, guideId }

    toursServices.add(newTour)
        .then(() => window.location.href = `../toursOverview/toursOverview.html?guideId=${guideId}`)
        .catch(error => console.error(error.status, error.message))
}

document.addEventListener("DOMContentLoaded", () => {
    tourFormInitialize(guideId);
})