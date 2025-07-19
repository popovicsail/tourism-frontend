import { handleLogout } from "../../../users/pages/login/login.js"
import { Tour } from "../../models/tour.model.js"
import { ToursServices } from "../../services/tours.services.js"
import { ToursUtils } from "../../utils/tours.utils.js"
import { TourFilters } from "../../models/tourFilters.model.js"
import { TourRating } from "../../models/tourRating.model.js"
import { UserService } from "../../../users/service/user.services.js"
import { TourKeyPoint } from "../../models/tourKeyPoint.model.js"
const toursServices = new ToursServices()
const toursUtils = new ToursUtils()
const userService = new UserService()
const tourFilters: TourFilters = {}
tourFilters.page = 1
tourFilters.pageSize = 5
tourFilters.orderBy = "Name"
tourFilters.orderDirection = "ASC"
tourFilters.tourStatus = "Published"

const userId = JSON.parse(localStorage.getItem("id"))
let userReservations: number[] = [];

let toursFiltered: Tour[]
let toursTotalCount

let toursLookupMain
let toursLookupTemplateHandler
let toursReservedTemplateHandler
let toursLookupTemplate

let toursPagesMain
let toursPagesTemplate

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



document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
    logoutButton.addEventListener('click', handleLogout)

    const toursLookupFilterSection = document.querySelectorAll('input[type="radio"]')
    toursLookupFilterSection.forEach(radio => {
        radio.addEventListener("click", tourGetFilters)
    })

    const showReservedButton = document.getElementById("show-reserved-button") as HTMLButtonElement
    showReservedButton.addEventListener("click", () => {
        if (toursReservedTemplateHandler.style.display === "none") {
            toursReservedTemplateHandler.style.display = "flex";
            toursLookupTemplateHandler.style.display = "none";
            showReservedButton.textContent = "View unreserved tours"
        } else {
            toursReservedTemplateHandler.style.display = "none";
            toursLookupTemplateHandler.style.display = "flex";
            showReservedButton.textContent = "View reserved tours"
        }
    });

    toursLookupMain = document.getElementById("tours-lookup-main") as HTMLDivElement
    toursLookupTemplateHandler = toursLookupMain.querySelector("#tours-lookup-template-handler") as HTMLDivElement
    toursLookupTemplateHandler.style.display = "none";
    toursReservedTemplateHandler = toursLookupMain.querySelector("#tours-reserved-template-handler") as HTMLDivElement
    toursReservedTemplateHandler.style.display = "flex";
    toursLookupTemplate = toursLookupMain.querySelector("#tours-lookup-template") as HTMLTemplateElement

    toursPagesMain = document.getElementById("tours-pages-main") as HTMLDivElement
    toursPagesTemplate = toursPagesMain.querySelector("#tours-pages-template") as HTMLTemplateElement

    tourGetFilters()
})

function tourGetFilters() {
    tourFilters.orderBy = toursUtils.getSelectedRadioValue("order-by")
    tourFilters.pageSize = parseInt(toursUtils.getSelectedRadioValue("page-size"))
    tourFilters.tourStatus = toursUtils.getSelectedRadioValue("tour-status")
    tourFilters.orderDirection = toursUtils.getSelectedRadioValue("order-direction")

    tourGetFiltered()
}

function tourGetFiltered() {
    Promise.all([
        toursServices.getPaged(tourFilters),
        userService.getTourReservationsByUserId(userId)
    ])
        .then(([tourData, userReservationsData]) => {
            toursFiltered = tourData.data;
            toursTotalCount = tourData.totalCount
            userReservations = userReservationsData.map(line => line.tourId);
            toursLookupTemplateHandler.innerHTML = ''
            toursReservedTemplateHandler.innerHTML = ''

            if (userReservations.length == 0) {
                const toursMessage = document.createElement("p") as HTMLParagraphElement
                toursMessage.textContent = "You haven't reserved any tours yet!"
                toursReservedTemplateHandler.append(toursMessage)
            }
            
            tourGetFilteredById()
        })
        .catch((error) => {
            console.error(error.status, error.message);
        });

}

async function tourGetFilteredById() {
    for (const tour of toursFiltered) {
        Promise.all([
            toursServices.getByTourId(tour.id),
            toursServices.getTourRatingsByTourId(tour.id),
            toursServices.getTourKeyPointsByTourId(tour.id)
        ])
            .then(([tourData, tourRatingsData, tourKeyPointData]) => {
                toursLookupSectionSetup(tourData, tourRatingsData, tourKeyPointData)
            })
            .catch((error) => {
                console.error(error.status, error.message);
            });
    }
    calculatePageNumbers()
}

function toursLookupSectionSetup(tour: Tour, tourRatings: TourRating[], tourKeyPoints: TourKeyPoint[]) {
    const toursLookupFragment = toursLookupTemplate.content.cloneNode(true) as DocumentFragment
    const toursLookupSectionNew = toursLookupFragment.querySelector(".tours-lookup-section") as HTMLDivElement

    const toursName = toursLookupSectionNew.querySelector(".tours-name") as HTMLParagraphElement
    const toursDateTime = toursLookupSectionNew.querySelector(".tours-datetime") as HTMLParagraphElement
    const toursMaxGuests = toursLookupSectionNew.querySelector(".tours-maxguests") as HTMLParagraphElement
    const toursRating = toursLookupSectionNew.querySelector(".tours-rating") as HTMLParagraphElement
    const toursDetailsButton = toursLookupSectionNew.querySelector(".tours-details-button") as HTMLButtonElement
    toursLookupSectionNew.id = `tours-lookup-section${tour.id}`
    toursLookupSectionNew.classList.add("background-image")

    if (tour.status == "Published") {
        toursLookupSectionNew.style.backgroundImage = `url(${tourKeyPoints[0].imageUrl})`;
    }

    toursName.textContent = tour.name

    const tourDateTimeFormatted = tour.dateTime.replace("T", " at ")
    toursDateTime.textContent = `${tourDateTimeFormatted}`

    toursMaxGuests.textContent = `Max number of guests: ${tour.maxGuests.toString()}`

    if (tourRatings.length == 0) {
        toursRating.textContent = "No ratings yet"

    }
    else {
        const total = tourRatings.reduce((sum, rating) => sum + rating.rating, 0)
        const averageRating = (total / tourRatings.length).toFixed(2)
        toursRating.textContent = `Average rating: ${averageRating.toString()}`
    }


    toursDetailsButton.addEventListener("click", () => {
        window.location.href = `../toursDetails/toursDetails.html?tourId=${tour.id}`
    })

    if (userReservations.includes(tour.id)) {
        toursLookupSectionNew.style.backgroundColor = "lightgreen"
        toursReservedTemplateHandler.append(toursLookupSectionNew)
        return;
    }
    toursLookupSectionNew.style.backgroundColor = "orange"
    toursLookupTemplateHandler.append(toursLookupSectionNew)
}

function calculatePageNumbers() {
    const maxPages = Math.ceil(toursTotalCount / tourFilters.pageSize)

    if (maxPages <= 1) {
        return
    }

    const toursPagesFragment = toursPagesTemplate.content.cloneNode(true) as DocumentFragment
    const toursPagesSection = toursPagesFragment.querySelector(".tours-pages-section") as HTMLDivElement

    toursPreviousButton = toursPagesSection.querySelector(".tours-previous-button") as HTMLParagraphElement
    pos1Button = toursPagesSection.querySelector(".tours-pos1-number") as HTMLParagraphElement
    toursLowDots = toursPagesSection.querySelector(".tours-low-dots") as HTMLParagraphElement
    pos2Button = toursPagesSection.querySelector(".tours-pos2-number") as HTMLParagraphElement
    pos3Button = toursPagesSection.querySelector(".tours-pos3-number") as HTMLParagraphElement
    pos4Button = toursPagesSection.querySelector(".tours-pos4-number") as HTMLParagraphElement
    pos5Button = toursPagesSection.querySelector(".tours-pos5-number") as HTMLParagraphElement
    pos6Button = toursPagesSection.querySelector(".tours-pos6-number") as HTMLParagraphElement
    toursHighDots = toursPagesSection.querySelector(".tours-high-dots") as HTMLParagraphElement
    pos7Button = toursPagesSection.querySelector(".tours-pos7-number") as HTMLParagraphElement
    toursNextButton = toursPagesSection.querySelector(".tours-next-button") as HTMLParagraphElement

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

    if (tourFilters.page == (maxPages - 2) && tourFilters.page != (maxPages - 2)) {
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

    if (maxPages < 4) {
        pos7Button.style.visibility = "hidden"
    }

    toursLookupTemplateHandler.append(toursPagesSection)
}