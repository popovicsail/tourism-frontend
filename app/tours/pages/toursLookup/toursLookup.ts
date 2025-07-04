import { Tour } from "../../models/tour.model.js"
import { ToursServices } from "../../services/tours.services.js"
import { handleLogout } from "../../../users/pages/login/login.js"
import { TourFilters } from "../../models/tourFilters.model.js"
import { ToursUtils } from "../../utils/tours.utils.js"
import { KeyPoint } from "../../models/keyPoint.model.js"
import { ReservationServices } from "../../services/reservations.services.js"
import { Reservation } from "../../models/reservation.model.js"
let logoutButton
const tourFilters: TourFilters = {}
tourFilters.page = 1
tourFilters.pageSize = 5
tourFilters.orderBy = "Name"
tourFilters.orderDirection = "ASC"
tourFilters.tourStatus = "Published"

const toursServices = new ToursServices()
const toursUtils = new ToursUtils()
const userId = JSON.parse(localStorage.getItem("id"))
let userReservations
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

document.addEventListener("DOMContentLoaded", () => {
    logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
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
    userReservations = JSON.parse(localStorage.getItem("reservations"))
    toursServices.getAll(tourFilters)
        .then((data) => {
            toursFiltered = data.data
            toursTotalCount = data.totalCount
            keyPointEditSectionTemplateHandler.innerHTML = ''
            toursLookupSectionSetup()
        })
}

function toursLookupSectionSetup() {
    toursLookupSectionTemplateHandler.innerHTML = ''
    toursFiltered.forEach((tour: Tour) => {
        const toursLookupSectionNew = toursLookupSectionTemplate.cloneNode(true) as HTMLDivElement
        let tourKeyPoints: KeyPoint[]

        const toursLookupNameNew = toursLookupSectionNew.querySelector("#tours-lookup-name") as HTMLParagraphElement
        const toursLookupDateTimeNew = toursLookupSectionNew.querySelector("#tours-lookup-datetime") as HTMLParagraphElement
        const toursLookupDescriptionNew = toursLookupSectionNew.querySelector("#tours-lookup-description") as HTMLTextAreaElement
        const toursLookupMaxGuestsNew = toursLookupSectionNew.querySelector("#tours-lookup-maxguests") as HTMLParagraphElement

        toursLookupSectionNew.id = `tours-lookup-section${tour.id}`
        toursLookupSectionNew.classList.add("background-image")

        toursLookupSectionNew.addEventListener("click", () => {
            toursServices.getByTourId(tour.id)
                .then((tourById) => {
                    tourKeyPoints = tourById.keyPoints
                    if (tourById.status == "Published") {
                        toursLookupSectionNew.style.backgroundImage = `url("${tourKeyPoints[0].imageUrl}")`
                    }
                    keyPointSection.style.display = "flex"
                    keyPointEditSectionSetup(tourById)
                })
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

        toursLookupSectionTemplateHandler.append(toursLookupSectionNew)
    })
    calculatePageNumbers()
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



function keyPointEditSectionSetup(tourById) {
    keyPointEditSectionTemplateHandler.innerHTML = ''

    tourById.keyPoints.forEach((keyPoint: KeyPoint) => {
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

    const reservationServices = new ReservationServices()
    tourId = tourById.id

    const tourAvailableReservations = tourById.maxGuests - tourById.reservationCount
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
    const tourDate = new Date(tourById.dateTime).getTime();
    const now = Date.now();

    const hoursLeft = (tourDate - now) / (1000 * 60 * 60);
    if (hoursLeft > 24) {
        timeLeftFlag = true
    } else {
        timeLeftFlag = false
    }

    if (userReservations.includes(tourId)) {
        tourReserveButton.style.display = "none";
        reserveAmountInput.style.display = "none";
        if (timeLeftFlag) {
            tourUnreserveButton.style.display = "flex";
            reserveAmountLabel.textContent = "You are allowed to cancel the reservation up to 24 hours before the tour starts."
        }
        else {
            tourUnreserveButton.style.display = "none";
            reserveAmountLabel.textContent = "You are allowed to cancel the reservation up to 24 hours before the tour starts."
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