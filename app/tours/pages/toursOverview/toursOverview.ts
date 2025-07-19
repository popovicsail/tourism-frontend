import { handleLogout } from "../../../users/pages/login/login.js"
import { Tour } from "../../models/tour.model.js"
import { TourRating } from "../../models/tourRating.model.js"
import { ToursServices } from "../../services/tours.services.js"
import { ToursKeyPointServices } from "../../services/toursKeyPoint.services.js"
const toursKeyPointServices = new ToursKeyPointServices
const toursServices = new ToursServices()
const guideId = parseInt(localStorage.getItem('id'));

let addTourButton

let toursReviewsMain
let toursReviewsTemplateHandler
let toursReviewsTemplate



document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
    logoutButton.addEventListener('click', handleLogout)

    addTourButton = document.getElementById("tours-create-button")

    toursReviewsMain = document.getElementById("tours-reviews-main") as HTMLDivElement
    toursReviewsTemplateHandler = toursReviewsMain.querySelector("#tours-reviews-template-handler") as HTMLDivElement
    toursReviewsTemplate = toursReviewsMain.querySelector("#tours-reviews-template") as HTMLTemplateElement

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

        const dateTime = document.createElement("td")
        dateTime.textContent = tour.dateTime.replace("T", " ")
        newRow.appendChild(dateTime)

        const maxGuests = document.createElement("td")
        maxGuests.innerHTML = `${tour.maxGuests}`
        newRow.appendChild(maxGuests)

        const status = document.createElement("td")
        status.textContent = tour.status
        newRow.appendChild(status)

        const tourRating = document.createElement("td")
        toursServices.getTourRatingsByTourId(tour.id)
            .then((data: TourRating[]) => {
                if (data.length == 0) {
                    tourRating.textContent = "No ratings yet"
                    return;
                }
                const total = data.reduce((sum, rating) => sum + rating.rating, 0)
                const averageRating = (total / data.length).toFixed(2)
                tourRating.textContent = averageRating.toString()
            })
        newRow.appendChild(tourRating)

        const tourDetailsTd = document.createElement("td")
        const tourDetailsButton = document.createElement("button")
        tourDetailsButton.textContent = "Tour Details"
        tourDetailsButton.addEventListener("click", () => {
            showTourRatings(tour)
        })
        tourDetailsTd.append(tourDetailsButton)
        newRow.appendChild(tourDetailsTd)

        const deleteButtonTd = document.createElement("td")
        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Delete Tour"
        deleteButton.classList.add("cancel-button")
        deleteButton.addEventListener("click", () => {
            toursServices.delete(tour.id)
                .then(() => getByGuideId(guideId))
                .catch((error) => console.error(error.status, error.message))

        })
        deleteButtonTd.appendChild(deleteButton)
        newRow.appendChild(deleteButtonTd)


        const duplicateButtonTd = document.createElement("td")
        const duplicateButton = document.createElement("button")
        duplicateButton.textContent = "Duplicate Tour"
        duplicateButton.classList.add("duplicate-button")
        duplicateButton.addEventListener("click", () => {
            duplicateTourById(tour.id)
        })
        duplicateButtonTd.appendChild(duplicateButton)
        newRow.appendChild(duplicateButtonTd)

        toursOverviewTableBody.appendChild(newRow)
    })
}

function showTourRatings(tour) {
    toursServices.getTourRatingsByTourId(tour.id)
        .then((data: TourRating[]) => {
            toursReviewsTemplateHandler.innerHTML = ''

            const tourTitle = document.createElement("p")
            tourTitle.textContent = tour.name
            toursReviewsTemplateHandler.append(tourTitle)

            const tourDescription = document.createElement("textarea")
            tourDescription.textContent = tour.description
            toursReviewsTemplateHandler.append(tourDescription)

            if (data.length == 0) {
                const tourNoReviews = document.createElement("p")
                tourNoReviews.textContent = "This tour has not yet been reviewed."
                toursReviewsTemplateHandler.append(tourNoReviews)
            }

            data.forEach(review => {
                const tourReviewsFragment = toursReviewsTemplate.content.cloneNode(true) as DocumentFragment
                const toursReviewsSection = tourReviewsFragment.querySelector(".tours-reviews-section") as HTMLDivElement

                const newReviewImg = toursReviewsSection.querySelector(".tours-reviews-img") as HTMLImageElement
                const newReviewTextarea = toursReviewsSection.querySelector(".tours-reviews-textarea") as HTMLTextAreaElement

                newReviewImg.src = `../../styles/star${review.rating}.png`
                newReviewTextarea.value = `${review.comment}`
                toursReviewsTemplateHandler.append(toursReviewsSection)
            })

            const tourEditButton = document.createElement("button")
            tourEditButton.textContent = "Edit Tour"
            tourEditButton.addEventListener("click", () => {
                window.location.href = `../toursEdit/toursEdit.html?tourId=${tour.id}`
            })
            toursReviewsTemplateHandler.append(tourEditButton)

            toursReviewsTemplateHandler.style.display = "flex"
        })
}


function duplicateTourById(tourId) {
    Promise.all([
        toursServices.getByTourId(tourId),
        toursServices.getTourKeyPointsByTourId(tourId)
    ])
        .then(([tourToDuplicate, tourKeyPoints]) => {
            const name = tourToDuplicate.name
            const description = tourToDuplicate.description
            const dateTime = tourToDuplicate.dateTime
            const maxGuests = tourToDuplicate.maxGuests
            let status = tourToDuplicate.status

            if (status == "Published") {
                status = "Ready"
            }

            const tourDuplicated: Tour = { name, description, dateTime, maxGuests, status, guideId }

            toursServices.add(tourDuplicated)
                .then((tourDuplicatedData) => {
                    tourKeyPoints.forEach((keyPoint) => {
                        keyPoint.tourId = tourDuplicatedData.id
                        toursKeyPointServices.add(keyPoint)
                            .then(() => {
                                getByGuideId(guideId)
                            })
                    })
                })
        })
        .catch((error) => {
            console.error(error.status, error.message);
        });

}



