import { Tour } from "../../models/tour.model.js"
import { ToursServices } from "../../services/tours.services.js"
import { handleLogout } from "../../../users/pages/login/login.js"
import { TourFilters } from "../../models/tourFilters.model.js"
import { ToursUtils } from "../../utils/tours.utils.js"
import { KeyPoint } from "../../models/keyPoint.model.js"
import { ReservationServices } from "../../services/reservations.services.js"
import { Reservation } from "../../models/reservation.model.js"
import { TourRating } from "../../models/tourRating.model.js"
import { TourRatingServices } from "../../services/tourRating.services.js"

const toursServices = new ToursServices()
const toursUtils = new ToursUtils()
const userId = JSON.parse(localStorage.getItem("id"))
const tourFilters: TourFilters = {}
const tourRatingServices = new TourRatingServices()
tourFilters.page = 1
tourFilters.pageSize = 5
tourFilters.orderBy = "Name"
tourFilters.orderDirection = "ASC"
tourFilters.tourStatus = "Published"

let userReservations = JSON.parse(localStorage.getItem("reservations"))
let tourId

let toursFiltered: Tour[]
let toursTotalCount

let toursLookupSectionTemplateHandler
let toursLookupSectionTemplate
let toursLookupFilterSection

let toursPreviousButton
let pos1Button
let toursLowDots
let pos2Button
let pos3Button
let pos4Button
let pos5Button
let pos6Button
let toursHighDots
let pos7Button
let toursNextButton

let toursPages
let maxPages

let keyPointSection
let keyPointEditSectionTemplateHandler
let keyPointEditSectionTemplate

let keypointMainbuttonTemplateHandler
let keypointMainbuttonTemplate

let keypointMainbuttonRate
let star1
let star2
let star3
let star4
let star5

let keypointMainbuttonRatingsTemplateHandler
let keypointMainbuttonRatingsTemplate

let reviewedFlag


document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
    logoutButton.addEventListener('click', handleLogout)

    toursLookupFilterSection = document.querySelectorAll('input[type="radio"]')
    toursLookupFilterSection.forEach(radio => {
        radio.addEventListener("click", tourGetFilters)
    })

    toursLookupSectionTemplateHandler = document.getElementById("tours-lookup-section-template-handler") as HTMLDivElement
    toursLookupSectionTemplate = document.getElementById("tours-lookup-section-template") as HTMLDivElement

    keyPointSection = document.getElementById("keypoint-section") as HTMLDivElement
    keyPointEditSectionTemplateHandler = document.getElementById("keypoint-edit-section-template-handler") as HTMLDivElement
    keyPointEditSectionTemplate = document.getElementById("keypoint-edit-section-template") as HTMLDivElement

    keypointMainbuttonTemplateHandler = document.getElementById("keypoint-mainbutton-template-handler") as HTMLDivElement
    keypointMainbuttonTemplate = document.getElementById("keypoint-mainbutton-template") as HTMLDivElement

    keypointMainbuttonRatingsTemplateHandler = document.getElementById("keypoint-mainbutton-ratings-template-handler") as HTMLDivElement
    keypointMainbuttonRatingsTemplate = document.getElementById("keypoint-mainbutton-ratings-template") as HTMLTemplateElement

    tourGetFilters()
})

function tourGetFilters() {
    tourFilters.orderBy = toursUtils.getSelectedRadioValue("order-by")
    tourFilters.pageSize = parseInt(toursUtils.getSelectedRadioValue("page-size"))
    tourFilters.tourStatus = toursUtils.getSelectedRadioValue("tour-status")
    tourFilters.orderDirection = toursUtils.getSelectedRadioValue("order-direction")

    tourGetByFiltered()
}

function tourGetByFiltered() {
    toursServices.getAll(tourFilters)
        .then((data) => {
            toursFiltered = data.data
            toursTotalCount = data.totalCount
            toursLookupSectionTemplateHandler.innerHTML = ''
            tourGetFilteredById()
        })

}

function tourGetFilteredById() {
    toursFiltered.forEach((tour: Tour) => {
        toursServices.getByTourId(tour.id)
            .then((data) => {
                tourId = data.id
                toursLookupSectionSetup(data)
            })
    })
    calculatePageNumbers()
}

function toursLookupSectionSetup(tour) {
    const toursLookupSectionNew = toursLookupSectionTemplate.cloneNode(true) as HTMLDivElement
    if (tour.status == "Published") {
        toursLookupSectionNew.style.backgroundImage = `url("${tour.keyPoints[0].imageUrl}")`
    }

    if (userReservations.includes(tour.id)) {
        toursLookupSectionNew.style.backgroundColor = "orange"
    }

    const toursLookupNameNew = toursLookupSectionNew.querySelector("#tours-lookup-name") as HTMLParagraphElement
    const toursLookupDateTimeNew = toursLookupSectionNew.querySelector("#tours-lookup-datetime") as HTMLParagraphElement
    const toursLookupDescriptionNew = toursLookupSectionNew.querySelector("#tours-lookup-description") as HTMLTextAreaElement
    const toursLookupMaxGuestsNew = toursLookupSectionNew.querySelector("#tours-lookup-maxguests") as HTMLParagraphElement

    toursLookupSectionNew.id = `tours-lookup-section${tour.id}`
    toursLookupSectionNew.classList.add("background-image")

    toursLookupSectionNew.addEventListener("click", () => {
        keyPointSection.style.display = "flex"
        keyPointEditSectionSetup(tour)
    })

    toursLookupNameNew.id = `tours-lookup-name${tour.id}`
    toursLookupNameNew.textContent = tour.name

    toursLookupDateTimeNew.id = `tours-lookup-datetime${tour.id}`
    const tourDateTimeFormatted = tour.dateTime.replace("T", " ")
    toursLookupDateTimeNew.textContent = `(${tourDateTimeFormatted})`

    toursLookupDescriptionNew.id = `tours-lookup-description${tour.id}`
    toursLookupDescriptionNew.textContent = tour.description
    toursLookupDescriptionNew.disabled = true

    toursLookupMaxGuestsNew.id = `tours-lookup-maxguests${tour.id}`
    toursLookupMaxGuestsNew.textContent = `Max number of guests: ${tour.maxGuests.toString()}`

    toursLookupSectionTemplateHandler.prepend(toursLookupSectionNew)
}


function calculatePageNumbers() {
    maxPages = Math.ceil(toursTotalCount / tourFilters.pageSize)
    pageNumbersInitialize()

    if (maxPages <= 1) {
        return
    }

    pos1Button.textContent = 1
    pos2Button.textContent = tourFilters.page - 2
    pos3Button.textContent = tourFilters.page - 1
    pos4Button.textContent = tourFilters.page
    pos4Button.style.fontWeight = "bold"
    pos5Button.textContent = tourFilters.page + 1
    pos6Button.textContent = tourFilters.page + 2
    pos7Button.textContent = maxPages

    if (tourFilters.page == 1) {
        toursPreviousButton.style.visibility = "hidden"
        pos1Button.style.visibility = "hidden"
        pos2Button.style.visibility = "hidden"
        pos3Button.style.visibility = "hidden"
    }
    else if (tourFilters.page == 2) {
        pos1Button.style.visibility = "hidden"
        pos2Button.style.visibility = "hidden"
    }
    else if (tourFilters.page == 3) {
        pos1Button.style.visibility = "hidden"
    }

    if (tourFilters.page == (maxPages - 2)) {
        pos1Button.style.visibility = "visible"
        pos7Button.style.visibility = "hidden"

    }
    else if (tourFilters.page == (maxPages - 1)) {
        pos6Button.style.visibility = "hidden"
        pos7Button.style.visibility = "hidden"
    }
    else if (tourFilters.page == (maxPages)) {
        pos5Button.style.visibility = "hidden"
        pos6Button.style.visibility = "hidden"
        pos7Button.style.visibility = "hidden"
        toursNextButton.style.visibility = "hidden"
    }

    if ((maxPages - tourFilters.page) > 3) {
        toursHighDots.style.display = "flex";
    }

    if ((tourFilters.page - 1) > 3) {
        toursLowDots.style.display = "flex";
    }

    toursLookupSectionTemplateHandler.append(toursPages)
}

function pageNumbersInitialize() {
    const toursPagesTemplate = document.getElementById("tours-pages-template") as HTMLTemplateElement
    toursPages = toursPagesTemplate.content.cloneNode(true) as DocumentFragment

    toursPreviousButton = toursPages.querySelector("#tours-previous-button") as HTMLParagraphElement
    pos1Button = toursPages.querySelector("#tours-pos1-number") as HTMLParagraphElement
    toursLowDots = toursPages.querySelector("#tours-low-dots") as HTMLParagraphElement
    pos2Button = toursPages.querySelector("#tours-pos2-number") as HTMLParagraphElement
    pos3Button = toursPages.querySelector("#tours-pos3-number") as HTMLParagraphElement
    pos4Button = toursPages.querySelector("#tours-pos4-number") as HTMLParagraphElement
    pos5Button = toursPages.querySelector("#tours-pos5-number") as HTMLParagraphElement
    pos6Button = toursPages.querySelector("#tours-pos6-number") as HTMLParagraphElement
    toursHighDots = toursPages.querySelector("#tours-high-dots") as HTMLParagraphElement
    pos7Button = toursPages.querySelector("#tours-pos7-number") as HTMLParagraphElement
    toursNextButton = toursPages.querySelector("#tours-next-button") as HTMLParagraphElement

    toursPreviousButton.addEventListener("click", () => {
        tourFilters.page = tourFilters.page - 1
        tourGetFilters()
    })
    pos1Button.addEventListener("click", () => {
        tourFilters.page = 1
        tourGetFilters()
    })
    pos2Button.addEventListener("click", () => {
        tourFilters.page = tourFilters.page - 2
        tourGetFilters()
    })
    pos3Button.addEventListener("click", () => {
        tourFilters.page = tourFilters.page - 1
        tourGetFilters()
    })
    pos5Button.addEventListener("click", () => {
        tourFilters.page = tourFilters.page + 1
        tourGetFilters()
    })
    pos6Button.addEventListener("click", () => {
        tourFilters.page = tourFilters.page + 2
        tourGetFilters()
    })
    pos7Button.addEventListener("click", () => {
        tourFilters.page = maxPages
        tourGetFilters()
    })
    toursNextButton.addEventListener("click", () => {
        tourFilters.page = tourFilters.page + 1
        tourGetFilters()
    })
}

function keyPointEditSectionSetup(tour) {
    keyPointEditSectionTemplateHandler.innerHTML = ''
    showRatings(tour.id)

    tour.keyPoints.forEach((keyPoint: KeyPoint) => {
        const keyPointId = keyPoint.id

        const keyPointEditSection = keyPointEditSectionTemplate.cloneNode(true) as HTMLDivElement

        const keyPointEditImageImg = keyPointEditSection.querySelector("#keypoint-edit-image-img") as HTMLImageElement
        const keyPointEditNameInput = keyPointEditSection.querySelector("#keypoint-edit-name-input") as HTMLInputElement
        const keyPointEditDescriptionInput = keyPointEditSection.querySelector("#keypoint-edit-description-input") as HTMLTextAreaElement

        keyPointEditSection.id = `keypoint-edit-section${keyPointId}`

        keyPointEditImageImg.src = keyPoint.imageUrl

        keyPointEditNameInput.id = `keypoint-edit-name-input${keyPointId}`
        keyPointEditNameInput.value = keyPoint.name

        keyPointEditDescriptionInput.id = `keypoint-edit-description-input${keyPointId}`
        keyPointEditDescriptionInput.value = keyPoint.description

        keyPointEditSection.style.display = "flex"
        keyPointEditSectionTemplateHandler.append(keyPointEditSection)
    })
    reserveSectionSetup(tour)
}

function reserveSectionSetup(tour) {
    keypointMainbuttonTemplateHandler.innerHTML = ''
    const newKeypointMainbutton = keypointMainbuttonTemplate.cloneNode(true) as HTMLInputElement
    keypointMainbuttonTemplateHandler.append(newKeypointMainbutton)

    const reservationServices = new ReservationServices()

    const tourAvailableReservations = tour.maxGuests - tour.reservationCount
    const reserveAmountLabel = document.getElementById("reserve-amount-label") as HTMLInputElement
    const reserveAmountInput = document.getElementById("reserve-amount-input") as HTMLInputElement

    const tourReserveButton = document.getElementById("tour-reserve-button") as HTMLButtonElement

    const tourUnreserveButton = document.getElementById("tour-unreserve-button") as HTMLButtonElement
    tourUnreserveButton.addEventListener("click", () => {
        reservationServices.delete(tourId)
            .then(() => {
                userReservations = userReservations.filter(id => id !== tourId);
                localStorage.setItem('reservations', JSON.stringify(userReservations))
                window.location.reload()
            })

    })
    tourUnreserveButton.style.display = "none";

    let timeLeftFlag
    const tourDate = new Date(tour.dateTime).getTime();
    const now = Date.now();

    const hoursLeft = (tourDate - now) / (1000 * 60 * 60);
    if (hoursLeft > 24) {
        timeLeftFlag = true
    } else {
        timeLeftFlag = false
    }

    let timeWindowFlag
    const hoursPassed = (now - tourDate) / (1000 * 60 * 60);

    if (hoursPassed > 3) {
        timeWindowFlag = true;
    } else {
        timeWindowFlag = false;
    }


    if (userReservations.includes(tour.id)) {
        tourReserveButton.style.display = "none";
        reserveAmountInput.style.display = "none";
        tourUnreserveButton.style.display = "none";
        reserveAmountLabel.textContent = "You are allowed to cancel the reservation up to 24 hours before the tour starts."
        if (timeLeftFlag) {
            tourUnreserveButton.style.display = "flex";          
        }

        if (timeWindowFlag && !reviewedFlag) {
            rateDivSetup(tourId)
        }
    }

    else if (tourAvailableReservations == 0) {
        reserveAmountLabel.textContent = "Unfortunately, there are no more spots left for this tour."
        reserveAmountInput.style.display = "none"
        tourReserveButton.style.display = "none"
    }

    else {
        reserveAmountInput.max = `${tourAvailableReservations}`
        tourReserveButton.addEventListener("click", () => {
            const reservationAmount = parseInt(reserveAmountInput.value)
            const reservationData: Reservation = {
                userId,
                tourId,
            }
            reservationServices.add(reservationData, reservationAmount)
                .then(() => {
                    userReservations.push(tourId)
                    localStorage.setItem('reservations', JSON.stringify(userReservations))
                    window.location.reload()
                })
        })
    }
}


function showRatings(tourId) {
    tourRatingServices.getById(tourId, "tourId")
        .then((data:TourRating[]) => {
            keypointMainbuttonRatingsTemplateHandler.innerHTML = ""
            data.forEach((review) => {
                const newKeypointMainbuttonReview = keypointMainbuttonRatingsTemplate.content.cloneNode(true) as HTMLElement
                const newKeypointMainbuttonUsername = newKeypointMainbuttonReview.querySelector("#keypoint-mainbutton-ratings-username") as HTMLParagraphElement
                const newKeypointMainbuttonImage = newKeypointMainbuttonReview.querySelector("#keypoint-mainbutton-ratings-img") as HTMLImageElement
                const newKeypointMainbuttonTextarea = newKeypointMainbuttonReview.querySelector("#keypoint-mainbutton-ratings-textarea") as HTMLTextAreaElement

                newKeypointMainbuttonUsername.textContent = `${review.username}`

                newKeypointMainbuttonImage.src = `../../styles/star${review.rating}.png`
                newKeypointMainbuttonTextarea.value = `${review.comment}`

                keypointMainbuttonRatingsTemplateHandler.append(newKeypointMainbuttonReview)

                if (review.userId == userId) {
                    reviewedFlag = true
                }
            })
        })
}


function rateDivSetup(tourId) {
    keypointMainbuttonRate = document.getElementById("keypoint-mainbutton-rate") as HTMLDivElement
    keypointMainbuttonRate.style.display = "flex"
    const tourRateButton = document.getElementById("tour-rate-button") as HTMLButtonElement
    const tourRateTextarea = document.getElementById("tour-rate-textarea") as HTMLTextAreaElement
    star1 = document.getElementById("star1") as HTMLImageElement
    star2 = document.getElementById("star2") as HTMLImageElement
    star3 = document.getElementById("star3") as HTMLImageElement
    star4 = document.getElementById("star4") as HTMLImageElement
    star5 = document.getElementById("star5") as HTMLImageElement
    let rating

    keypointMainbuttonRate.addEventListener("mouseout", () => {
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
    })

    star2.addEventListener("click", () => {
        rating = 2
        tourRateButton.disabled = false
    })

    star3.addEventListener("click", () => {
        rating = 3
        tourRateButton.disabled = false
    })

    star4.addEventListener("click", () => {
        rating = 4
        tourRateButton.disabled = false
    })

    star5.addEventListener("click", () => {
        rating = 5
        tourRateButton.disabled = false
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
                showRatings(tourId)
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