import { Tour } from "../../models/tour.model.js"
import { ToursServices } from "../../services/tours.services.js"
import { handleLogout } from "../../../users/pages/login/login.js"
import { TourRatingServices } from "../../services/tourRating.services.js"
import { TourRating } from "../../models/tourRating.model.js"
const tourRatringServices = new TourRatingServices()
const toursServices = new ToursServices()
const guideId = parseInt(localStorage.getItem('id'));

let addTourButton

let toursOverviewRatingTemplateHandler
let toursOverviewRatingTemplate
let toursOverviewRatingSection


document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
    logoutButton.addEventListener('click', handleLogout)

    addTourButton = document.getElementById("tours-create-button")

    toursOverviewRatingSection = document.getElementById("tours-overview-rating-section") as HTMLDivElement
    toursOverviewRatingTemplateHandler = document.getElementById("tours-overview-rating-template-handler") as HTMLDivElement
    toursOverviewRatingTemplate = document.getElementById("tours-overview-rating-template") as HTMLTemplateElement

    addTourButton.addEventListener("click", () => window.location.href = `../toursForm/toursForm.html`)
    getByGuideId(guideId);
})

function getByGuideId(guideId: number) {
    toursServices.getByGuideId(guideId)
        .then((data: Tour[]) => toursOverviewInitialize(data))
        .catch((error) => console.error(error.status, error.message))
}

function toursOverviewInitialize(data: Tour[]) {
    const toursOverviewTableBody = document.getElementById("tours-overview-table-body")
    toursOverviewTableBody.innerHTML = ''

    data.forEach((tour: Tour) => {
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

        tourRatringServices.getById(tour.id, "tourId")
            .then((data: TourRating[]) => {
                const total = data.reduce((sum, rating) => sum + rating.rating, 0)
                const averageRating = (total / data.length).toFixed(2)
                tourRating.textContent = averageRating.toString()
            })
        const tourRating = document.createElement("td")
        newRow.appendChild(tourRating)

        tourRating.addEventListener("click", () => {
            showAllRatings(tour)
        })

        const editButtonTd = document.createElement("td")
        const editButton = document.createElement("button")
        editButton.textContent = "Edit Tour"
        editButton.addEventListener("click", () => window.location.href = `../toursEdit/toursEdit.html?tourId=${tour.id}`)
        editButtonTd.append(editButton)
        newRow.appendChild(editButtonTd)

        const deleteButtonTd = document.createElement("td")
        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Delete Tour"
        deleteButton.addEventListener("click", () => {
            toursServices.delete(tour.id)
                .then(() => getByGuideId(guideId))
                .catch((error) => console.error(error.status, error.message))

        })
        deleteButtonTd.appendChild(deleteButton)
        newRow.appendChild(deleteButtonTd)

        toursOverviewTableBody.appendChild(newRow)
    })
}

function showAllRatings(tour) {
    tourRatringServices.getById(tour.id, "tourId")
        .then((data: TourRating[]) => {
            toursOverviewRatingTemplateHandler.innerHTML = ''

            if (data.length == 0) {
                return;
            }

            const tourTitle = document.createElement("p")
            tourTitle.textContent = tour.name
            toursOverviewRatingTemplateHandler.append(tourTitle)

            data.forEach(review => {
                const newReview = toursOverviewRatingTemplate.content.cloneNode(true) as HTMLElement

                const newReviewUsername = newReview.querySelector("#tours-overview-rating-username") as HTMLParagraphElement
                const newReviewImage = newReview.querySelector("#tours-overview-rating-img") as HTMLImageElement
                const newReviewTextarea = newReview.querySelector("#tours-overview-rating-textarea") as HTMLTextAreaElement

                newReviewUsername.textContent = `${review.username}`

                newReviewImage.src = `../../styles/star${review.rating}.png`
                newReviewTextarea.value = `${review.comment}`
                toursOverviewRatingTemplateHandler.append(newReview)

                toursOverviewRatingSection.style.display = "flex"
            })
        })
}