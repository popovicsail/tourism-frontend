import { Tour } from "../../models/tour.model.js"
import { ToursServices } from "../../services/tours.services.js"
const toursServices = new ToursServices()
const searchParams = new URLSearchParams(window.location.search)
const guideId = parseInt(searchParams.get("guideId"))
const addTourButton = document.getElementById("addTourButton")

function getByGuideId(guideId: number) {
    toursServices.getByGuideId(guideId)
        .then((data: Tour[]) => toursOverviewInitialize(data))
        .catch((error) => console.error(error.status, error.message))
}

function toursOverviewInitialize(data: Tour[]) {
    const toursOverviewTableBody = document.getElementById("toursOverviewTableBody")
    toursOverviewTableBody.innerHTML = ''

    data.forEach((tour:Tour) => {
        const newRow = document.createElement("tr")

        const name = document.createElement("td")
        name.textContent = tour.name
        newRow.appendChild(name)

        const description = document.createElement("td")
        description.textContent = tour.description
        newRow.appendChild(description)

        const dateTime = document.createElement("td")
        dateTime.textContent = tour.dateTime.replace("T", " ")
        newRow.appendChild(dateTime)

        const maxGuests = document.createElement("td")
        maxGuests.innerHTML = `${tour.maxGuests}`
        newRow.appendChild(maxGuests)

        const status = document.createElement("td")
        status.textContent = tour.status
        newRow.appendChild(status)

        const editButton = document.createElement("button")
        editButton.textContent = "Edit Tour"
        editButton.addEventListener("click", () => window.location.href = `../toursForm/toursForm.html?guideId=${guideId}&tourId=${tour.id}`)
        newRow.appendChild(editButton)

        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Delete Tour"
        deleteButton.addEventListener("click", () => {
            toursServices.delete(tour.id)
            .then(() => getByGuideId(guideId))
            .catch((error) => console.error(error.status, error.message))
            
        })
        newRow.appendChild(deleteButton)

        toursOverviewTableBody.appendChild(newRow)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    addTourButton.addEventListener("click", () => window.location.href = `../toursForm/toursForm.html?guideId=${guideId}`)
    getByGuideId(guideId);
})