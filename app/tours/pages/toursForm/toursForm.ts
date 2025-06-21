import { Tour } from "../../../tours/models/tour.model.js";
import { ToursServices } from "../../services/tours.services.js"
const toursServices = new ToursServices()
const url = window.location.search
const searchParams = new URLSearchParams(url)
const guideId = parseInt(searchParams.get("guideId"))
const tourId = parseInt(searchParams.get("tourId"))
let tourName = document.querySelector("#tourName") as HTMLInputElement
let tourDescription = document.querySelector("#tourDescription") as HTMLInputElement
let tourDateTime = document.querySelector("#tourDateTime") as HTMLInputElement
let tourMaxGuests = document.querySelector("#tourMaxGuests") as HTMLInputElement


function tourFormInitialize(guideId: number, tourId?: number): void {
    if (tourId) {
        const submitButton = document.getElementById("submitButton") as HTMLButtonElement
        submitButton.addEventListener("click", () => submit(guideId, tourId));
        getById(tourId)
    }
    else {
        const submitButton = document.getElementById("submitButton") as HTMLButtonElement
        submitButton.addEventListener("click", () => submit(guideId));
    }
    const cancelButton = document.getElementById("cancelButton") as HTMLButtonElement
    cancelButton.addEventListener("click", () => window.location.href = `../toursOverview/toursOverview.html?guideId=${guideId}`)
}


function getById(id) {
        toursServices.getByTourId(id)
        .then((tour:Tour) => {
            tourName.value = tour.name
            tourDescription.value = tour.description
            tourDateTime.value = tour.dateTime.toString()
            tourMaxGuests.value = tour.maxGuests.toString()
        })
        .catch ((error) => {
            console.error(error.status, error.message)
        })
}


function submit(guideId: number, tourId?: number): void {
    const name = tourName.value
    const description = tourDescription.value
    const dateTime = tourDateTime.value
    const maxGuests = parseInt(tourMaxGuests.value)
    const status = "U pripremi"

    const newTour: Tour = { name, description, dateTime, maxGuests, status, guideId }

    validation(newTour)

    if (tourId) {
        toursServices.update(tourId, newTour)
        .then(() => window.location.href = `../toursOverview/toursOverview.html?guideId=${guideId}`)
        .catch(error => console.error(error.status, error.message))
    }
    else {
        toursServices.add(newTour)
        .then(() => window.location.href = `../toursOverview/toursOverview.html?guideId=${guideId}`)
        .catch(error => console.error(error.status, error.message)) 
    }
}


function validation(newTour: Tour) {
    const tourNameError = document.querySelector("#tourNameError")
    tourNameError.textContent = ''
    const tourDescriptionError = document.querySelector("#tourDescriptionError")
    tourDescriptionError.textContent = ''
    const tourDateTimeError = document.querySelector("#tourDateTimeError")
    tourDateTimeError.textContent = ''
    const tourMaxGuestsError = document.querySelector("#tourMaxGuestsError")
    tourMaxGuestsError.textContent = ''

    if (newTour.name.trim() === '') {
        tourNameError.textContent = "Name field is required!"
    }
    if (newTour.description.trim() === '') {
        tourDescriptionError.textContent = "Description field is required!"
    }
    if (newTour.dateTime.trim() === '') {
        tourDateTimeError.textContent = "Date field is required!"
    }
    if (newTour.maxGuests === null || newTour.maxGuests === 0) {
        tourMaxGuestsError.textContent = "Max guests field is required!"
    }
}


document.addEventListener("DOMContentLoaded", () => {
    tourFormInitialize(guideId, tourId);
})