import { handleLogout } from "../../../users/pages/login/login.js"
import { Tour } from "../../models/tour.model.js"
import { ToursServices } from "../../services/tours.services.js"
import { TourKeyPoint } from "../../models/tourKeyPoint.model.js"
import { TourReservation } from "../../models/tourReservation.model.js"
import { ToursReservationServices } from "../../services/toursReservation.services.js"
import { TourRating } from "../../models/tourRating.model.js"
import { ToursRatingServices } from "../../services/toursRating.services.js"
const url = window.location.search
const searchParams = new URLSearchParams(url)
const tourId = parseInt(searchParams.get("tourId"))

const toursServices = new ToursServices()
const tourRatingServices = new ToursRatingServices()
const toursReservationServices = new ToursReservationServices()
const userId = JSON.parse(localStorage.getItem("id"))

let tourById: Tour
let tourByIdKeyPoints: TourKeyPoint[]
let tourByIdRatings: TourRating[]
let tourByIdReservations: TourReservation[]

let tourKeypointMain
let tourKeypointTemplateHandler
let tourKeypointTemplate

let tourReservationsMain

let tourReserveMain
let tourReserveSection

let tourReservedMain
let tourReservedTemplateHandler
let tourReservedTemplate

let tourReserveAvailable
let tourReserveNumber
let tourReserveButton

let toursReviewsMain
let toursReviewsTemplateHandler
let toursReviewsTemplate

let tourGiveReviewMain
let tourGiveReviewSection
let star1
let star2
let star3
let star4
let star5

let map: L.Map;
let currentMarker: L.Marker;

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
    logoutButton.addEventListener('click', handleLogout)

    tourKeypointMain = document.getElementById("tour-keypoint-main") as HTMLDivElement
    tourKeypointMain.style.display = "flex"
    tourKeypointTemplateHandler = tourKeypointMain.querySelector("#tour-keypoint-template-handler") as HTMLDivElement
    tourKeypointTemplate = tourKeypointMain.querySelector("#tour-keypoint-template") as HTMLDivElement

    tourReservationsMain = document.getElementById("tour-reservations-main") as HTMLDivElement

    tourReservedMain = tourReservationsMain.querySelector("#tour-reserved-main") as HTMLDivElement
    tourReservedTemplateHandler = tourReservedMain.querySelector("#tour-reserved-template-handler") as HTMLDivElement
    tourReservedTemplate = tourReservedMain.querySelector("#tour-reserved-template") as HTMLTemplateElement

    tourReserveMain = tourReservationsMain.querySelector("#tour-reserve-main") as HTMLDivElement
    tourReserveSection = tourReserveMain.querySelector(".tour-reserve-section") as HTMLDivElement
    tourReserveAvailable = tourReserveSection.querySelector(".tour-reserve-available") as HTMLParagraphElement
    tourReserveNumber = tourReserveSection.querySelector(".tour-reserve-number") as HTMLInputElement
    tourReserveButton = tourReserveSection.querySelector(".tour-reserve-button") as HTMLButtonElement

    tourGiveReviewMain = document.getElementById("tour-give-review-main") as HTMLDivElement
    tourGiveReviewSection = tourGiveReviewMain.querySelector(".tour-give-review-section") as HTMLDivElement
    star1 = document.getElementById("star1") as HTMLImageElement
    star2 = document.getElementById("star2") as HTMLImageElement
    star3 = document.getElementById("star3") as HTMLImageElement
    star4 = document.getElementById("star4") as HTMLImageElement
    star5 = document.getElementById("star5") as HTMLImageElement

    toursReviewsMain = document.getElementById("tours-reviews-main") as HTMLDivElement
    toursReviewsTemplateHandler = toursReviewsMain.querySelector("#tours-reviews-template-handler") as HTMLDivElement
    toursReviewsTemplate = toursReviewsMain.querySelector("#tours-reviews-template") as HTMLTemplateElement

    tourGetById(tourId)
    rateDivSetup()
})

function tourGetById(tourId) {
    Promise.all([
        toursServices.getByTourId(tourId),
        toursServices.getTourKeyPointsByTourId(tourId),
        toursServices.getTourRatingsByTourId(tourId),
        toursServices.getTourReservationsByTourId(tourId)
    ])
        .then(([tour, tourKeyPoints, tourRatings, tourReservations]) => {
            tourById = tour
            tourByIdKeyPoints = tourKeyPoints
            tourByIdRatings = tourRatings
            tourByIdReservations = tourReservations
            keyPointSectionSetup()
            reserveSectionCalculate()
            showTourRatings()
            initMap(tourByIdKeyPoints[0])
        })
        .catch((error) => {
            console.error(error.status, error.message);
        });
}


function keyPointSectionSetup() {
    tourKeypointTemplateHandler.innerHTML = ''

    tourByIdKeyPoints.forEach((keyPoint: TourKeyPoint) => {
        const keyPointId = keyPoint.id

        const keyPointFragment = tourKeypointTemplate.content.cloneNode(true) as DocumentFragment
        const keyPointSection = keyPointFragment.querySelector(".tour-keypoint-section") as HTMLDivElement

        const keyPointImageImg = keyPointSection.querySelector(".keypoint-image-img") as HTMLImageElement
        const keyPointNameInput = keyPointSection.querySelector(".keypoint-name-input") as HTMLInputElement
        const keyPointDescriptionInput = keyPointSection.querySelector(".keypoint-description-input") as HTMLTextAreaElement

        keyPointSection.id = `keypoint-edit-section${keyPointId}`

        keyPointImageImg.src = keyPoint.imageUrl
        keyPointImageImg.addEventListener("click", () => {
            setupMap(keyPoint)
        })

        keyPointNameInput.id = `keypoint-edit-name-input${keyPointId}`
        keyPointNameInput.value = keyPoint.name

        keyPointDescriptionInput.id = `keypoint-edit-description-input${keyPointId}`
        keyPointDescriptionInput.value = keyPoint.description

        keyPointSection.style.display = "flex"
        tourKeypointTemplateHandler.append(keyPointSection)
    })
}

function reserveSectionCalculate() {
    tourReservedTemplateHandler.innerHTML = ''

    const tourDate = new Date(tourById.dateTime).getTime();
    const now = Date.now();

    const hoursLeft = (tourDate - now) / (1000 * 60 * 60);
    const hoursPassed = (now - tourDate) / (1000 * 60 * 60);

    let timeLeftFlag = hoursLeft > 24;
    let timeWindowFlag = hoursPassed > 3 && hoursLeft < 168;
    const tourAvailableReservations = tourById.maxGuests - tourByIdReservations.length

    timeLeftFlag = true //OVDE RADI TESTIRANJA
    timeWindowFlag = true //OVDE RADI TESTIRANJA

    tourByIdReservations.forEach((tourReservation: TourReservation) => {
        if (userId == tourReservation.userId) {
            const tourReservedFragment = tourReservedTemplate.content.cloneNode(true) as DocumentFragment
            const tourReservedSection = tourReservedFragment.firstElementChild as HTMLDivElement

            const reservationId = tourReservedSection.querySelector(".reservation-id") as HTMLParagraphElement
            const reservationTourId = tourReservedSection.querySelector(".tour-id") as HTMLParagraphElement
            const reservationUserId = tourReservedSection.querySelector(".user-id") as HTMLParagraphElement
            reservationId.textContent = `Reservation Id = ${tourReservation.id.toString()}`
            reservationTourId.textContent = `Tour Id = ${tourReservation.tourId.toString()}`
            reservationUserId.textContent = `User Id = ${tourReservation.userId.toString()}`

            if (timeLeftFlag) {
                const reservationCancelButton = document.createElement("button") as HTMLButtonElement
                reservationCancelButton.textContent = "Cancel"
                reservationCancelButton.addEventListener("click", () => {
                    toursReservationServices.delete(tourReservation.id)
                        .then(() => {
                            tourGetById(tourId)
                        })
                })
                tourReservedSection.append(reservationCancelButton)
            }
            tourReservedTemplateHandler.append(tourReservedSection)
        }
    })

    if (tourAvailableReservations > 0) {
        tourReserveSection.style.display = "flex"
        tourReserveAvailable.textContent = `Available spots: ${tourAvailableReservations}`
        tourReserveNumber.max = tourAvailableReservations
        tourReserveButton.onclick = () => {
            const tourReservationAmount = tourReserveNumber.value;
            const tourReservationData: TourReservation = { userId, tourId };
            toursReservationServices.add(tourReservationData, tourReservationAmount)
                .then(() => {
                    tourGetById(tourId);
                });
        };
    }
    else {
        tourReserveSection.style.display = "none"
    }
    if (timeWindowFlag) {
        tourGiveReviewMain.style.display = "flex"
    }
}


function showTourRatings() {
    toursReviewsTemplateHandler.innerHTML = ''

    const tourTitle = document.createElement("p")
    tourTitle.textContent = tourById.name
    toursReviewsTemplateHandler.append(tourTitle)

    const tourDescription = document.createElement("textarea")
    tourDescription.classList.add("tours-description")
    tourDescription.textContent = tourById.description
    toursReviewsTemplateHandler.append(tourDescription)

    if (tourByIdRatings.length == 0) {
        const tourNoReviews = document.createElement("p")
        tourNoReviews.textContent = "This tour has not yet been reviewed."
        toursReviewsTemplateHandler.append(tourNoReviews)
    }

    tourByIdRatings.forEach(review => {
        if (userId == review.userId) {
            tourGiveReviewMain.style.display = "none"
        }

        const tourReviewsFragment = toursReviewsTemplate.content.cloneNode(true) as DocumentFragment
        const toursReviewsSection = tourReviewsFragment.querySelector(".tours-reviews-section") as HTMLDivElement

        const newReviewImg = toursReviewsSection.querySelector(".tours-reviews-img") as HTMLImageElement
        const newReviewTextarea = toursReviewsSection.querySelector(".tours-reviews-textarea") as HTMLTextAreaElement

        newReviewImg.src = `../../styles/star${review.rating}.png`
        newReviewTextarea.value = `${review.comment}`
        toursReviewsTemplateHandler.append(toursReviewsSection)
    })

    toursReviewsTemplateHandler.style.display = "flex"
}

function rateDivSetup() {
    const tourRateButton = tourGiveReviewSection.querySelector(".tour-give-review-button") as HTMLButtonElement
    const tourRateTextarea = tourGiveReviewSection.querySelector(".tour-give-review-comment") as HTMLTextAreaElement

    let rating

    tourGiveReviewSection.addEventListener("mouseout", () => {
        rateDivUnglow(rating)
    })

    star1.addEventListener("mouseover", () => {
        rateDivGlow(1)
    })

    star2.addEventListener("mouseover", () => {
        rateDivGlow(2)
    })

    star3.addEventListener("mouseover", () => {
        rateDivGlow(3)
    })

    star4.addEventListener("mouseover", () => {
        rateDivGlow(4)
    })

    star5.addEventListener("mouseover", () => {
        rateDivGlow(5)
    })


    star1.addEventListener("click", () => {
        rating = 1
        tourRateButton.disabled = false
        tourRateButton.style.backgroundColor = "green"
    })

    star2.addEventListener("click", () => {
        rating = 2
        tourRateButton.disabled = false
        tourRateButton.style.backgroundColor = "green"
    })

    star3.addEventListener("click", () => {
        rating = 3
        tourRateButton.disabled = false
        tourRateButton.style.backgroundColor = "green"
    })

    star4.addEventListener("click", () => {
        rating = 4
        tourRateButton.disabled = false
        tourRateButton.style.backgroundColor = "green"
    })

    star5.addEventListener("click", () => {
        rating = 5
        tourRateButton.disabled = false
        tourRateButton.style.backgroundColor = "green"
    })

    let comment = null

    tourRateTextarea.addEventListener("blur", () => {
        comment = tourRateTextarea.value
    })

    tourRateButton.addEventListener("click", () => {
        const ratingDate = new Date().toISOString();

        const tourRating: TourRating = { tourId, userId, ratingDate, rating, comment }

        tourRatingServices.add(tourRating)
            .then(() => {
                toursReviewsMain.style.display = "flex"
                tourGetById(tourId)
            })
    })

}

function rateDivGlow(starNumber: number) {
    star1.src = "../../styles/starRated.png"
    if (starNumber == 1) {
        return
    }
    star2.src = "../../styles/starRated.png"
    if (starNumber == 2) {
        return
    }
    star3.src = "../../styles/starRated.png"
    if (starNumber == 3) {
        return
    }
    star4.src = "../../styles/starRated.png"
    if (starNumber == 4) {
        return
    }
    star5.src = "../../styles/starRated.png"
    if (starNumber == 5) {
        return
    }
}

function rateDivUnglow(starNumber: number) {
    if (starNumber == 5) {
        return
    }
    star5.src = "../../styles/starUnrated.png"

    if (starNumber == 4) {
        return
    }
    star4.src = "../../styles/starUnrated.png"

    if (starNumber == 3) {
        return
    }
    star3.src = "../../styles/starUnrated.png"

    if (starNumber == 2) {
        return
    }
    star2.src = "../../styles/starUnrated.png"

    if (starNumber == 1) {
        return
    }
    star1.src = "../../styles/starUnrated.png"
}


function initMap(keyPoint): void {
    const lat = keyPoint.latitude
    const lng = keyPoint.longitude
    map = L.map("map").setView([lat, lng], 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map)
}

function setupMap(keyPoint): void {
    const lat = keyPoint.latitude
    const lng = keyPoint.longitude

    map.setView([lat, lng], 15); // Pomeraj mapu

    if (currentMarker) {
        map.removeLayer(currentMarker)
    }

    currentMarker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`${keyPoint.name}`)
        .openPopup()
}