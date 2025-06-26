import { Tour } from "../../models/tour.model.js";
import { ToursServices } from "../../services/tours.services.js"
import { ToursUtils } from "../../utils/tours.utils.js"
import { KeyPoint } from "../../models/keyPoint.model.js"
import { KeyPointServices } from "../../services/keyPoint.services.js";
const toursServices = new ToursServices()
const toursUtils = new ToursUtils()

const url = window.location.search
const searchParams = new URLSearchParams(url)
const guideId = parseInt(searchParams.get("guideId"))
const tourId = parseInt(searchParams.get("tourId"))
let tourById

let tourNameElement
let tourDescriptionElement
let tourDateTimeElement
let tourMaxGuestsElement
let tourKeyPointButtonElement
let tourFormPublishButtonElement
let tourCancelButtonElement
let tourSubmitButtonElement

let keyPointOverviewSection
let keyPointOverviewDiv
let keyPointOverviewDivTemplate

let keyPointImageElement
let keyPointNameElement
let keyPointLatitudeElement
let keyPointLongitudeElement
let keyPointDescription
let keyPointImageURLElement
let keyPointCancelButton
let keyPointSubmitButton


const keyPointServices = new KeyPointServices(tourId)

function tourFormInitialize(guideId: number, tourId: number): void {
    tourNameElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourNameElement)
        validationTourFormData()
    })

    tourDescriptionElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourDescriptionElement)
        validationTourFormData()
    })

    tourDateTimeElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourDateTimeElement)
        validationTourFormData()
    })

    tourMaxGuestsElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(tourMaxGuestsElement)
        validationTourFormData()
    })

    tourKeyPointButtonElement.addEventListener("click", () => {
        document.getElementById("keyPointOverviewSection").style.display = "flex"
        keyPointOverviewInitialize(tourById)
    }, { once: true })

    tourCancelButtonElement.addEventListener("click", () => window.location.href = `../toursOverview/toursOverview.html?guideId=${guideId}`)

    tourSubmitButtonElement.addEventListener("click", () => {
        submitTourFormData(guideId, tourId)
    });
    fillTourFormData()
}

function validationTourFormData() {
    const tourNameFlag = toursUtils.validationFinal(tourNameElement)
    const tourDescriptionFlag = toursUtils.validationFinal(tourDescriptionElement)
    const tourDateTimeFlag = toursUtils.validationFinal(tourDateTimeElement)
    const tourMaxGuestsFlag = toursUtils.validationFinal(tourMaxGuestsElement)

    if (!tourNameFlag || !tourDescriptionFlag || !tourDateTimeFlag || !tourMaxGuestsFlag) {
        tourSubmitButtonElement.disabled = true;
        tourSubmitButtonElement.style.backgroundColor = "grey"
        return;
    }
    tourSubmitButtonElement.disabled = false;
    tourSubmitButtonElement.style.backgroundColor = "green"
    return;
}

function fillTourFormData() {
    toursServices.getByTourId(tourId)
        .then((tour: Tour) => {
            tourById = tour
            tourNameElement.value = tourById.name
            tourDescriptionElement.value = tourById.description
            tourDateTimeElement.value = tourById.dateTime.toString()
            tourMaxGuestsElement.value = tourById.maxGuests.toString()

            tourFormPublishButtonElement.addEventListener("click", () => {
                tourById.status = "objavljeno"
                toursServices.update(tourId, tourById)
            })
            checkForPublishButton(tourById)
        })
        .catch((error) => {
            console.error(error.status, error.message)
        })
}

function updateTourData() {
    toursServices.getByTourId(tourId)
        .then((tour: Tour) => {
            tourById = tour
            checkForPublishButton(tourById)
            keyPointOverviewInitialize(tourById)
        })
        .catch((error) => {
            console.error(error.status, error.message)
        })

}

function checkForPublishButton(tourById: Tour) {
    if (tourById.keyPoints.length >= 2) {
        tourFormPublishButtonElement.disabled = false
        tourFormPublishButtonElement.style.backgroundColor = "green"
        tourFormPublishButtonElement.textContent = "publish"

    }
    else {
        tourFormPublishButtonElement.disabled = true
        tourFormPublishButtonElement.style.backgroundColor = "gray"
        tourFormPublishButtonElement.textContent = "At least 2 key points needed to publish tour"
    }
}


function submitTourFormData(guideId: number, tourId: number): void {
    const name = tourNameElement.value
    const description = tourDescriptionElement.value
    const dateTime = tourDateTimeElement.value
    const maxGuests = parseInt(tourMaxGuestsElement.value)
    const status = "U pripremi"

    const newTour: Tour = { name, description, dateTime, maxGuests, status, guideId }

    toursServices.update(tourId, newTour)
        .then(() => window.location.href = `../toursEdit/toursEdit.html?guideId=${guideId}&tourId=${tourId}`)
        .catch(error => console.error(error.status, error.message))
}


function keyPointOverviewInitialize(tourById: Tour): void {
    keyPointOverviewSection.innerHTML = ''
    let order = 0

    tourById.keyPoints.forEach((keyPoint: KeyPoint) => {
        const newKeyPointOverviewDiv = keyPointOverviewDivTemplate.cloneNode(true) as HTMLDivElement

        const newKeyPointImageElement = newKeyPointOverviewDiv.querySelector("#keyPointImageElement") as HTMLImageElement
        const newKeyPointNameElement = newKeyPointOverviewDiv.querySelector("#keyPointNameElement") as HTMLInputElement
        const newKeyPointLatitudeElement = newKeyPointOverviewDiv.querySelector("#keyPointLatitudeElement") as HTMLInputElement
        const newKeyPointLongitudeElement = newKeyPointOverviewDiv.querySelector("#keyPointLongitudeElement") as HTMLInputElement
        const newKeyPointDescription = newKeyPointOverviewDiv.querySelector("#keyPointDescription") as HTMLTextAreaElement
        const newKeyPointImageURLElement = newKeyPointOverviewDiv.querySelector("#keyPointImageURLElement") as HTMLInputElement
        const newDeleteKeyPointButtonElement = newKeyPointOverviewDiv.querySelector("#deleteKeyPointButtonElement") as HTMLButtonElement
        const newSaveKeyPointButtonElement = newKeyPointOverviewDiv.querySelector("#saveKeyPointButtonElement") as HTMLButtonElement
        const keyPointId = keyPoint.id

        newKeyPointOverviewDiv.id = `keyPointOverviewDiv${keyPointId}`

        newKeyPointImageElement.src = keyPoint.imageUrl

        newKeyPointNameElement.id = `keyPointNameElement${keyPointId}`
        newKeyPointNameElement.value = keyPoint.name
        newKeyPointNameElement.addEventListener("blur", () => {
            toursUtils.validationSingleInput(newKeyPointNameElement)
            validateKeyPointData(keyPointId)
        })

        newKeyPointLatitudeElement.id = `keyPointLatitudeElement${keyPointId}`
        newKeyPointLatitudeElement.value = keyPoint.latitude.toString()
        newKeyPointLatitudeElement.addEventListener("blur", () => {
            toursUtils.validationSingleInput(newKeyPointLatitudeElement)
            validateKeyPointData(keyPointId)
        })

        newKeyPointLongitudeElement.id = `keyPointLongitudeElement${keyPointId}`
        newKeyPointLongitudeElement.value = keyPoint.longitude.toString()
        newKeyPointLongitudeElement.addEventListener("blur", () => {
            toursUtils.validationSingleInput(newKeyPointLongitudeElement)
            validateKeyPointData(keyPointId)
        })

        newKeyPointDescription.id = `keyPointDescription${keyPointId}`
        newKeyPointDescription.value = keyPoint.description
        newKeyPointDescription.addEventListener("blur", () => {
            toursUtils.validationSingleInput(newKeyPointDescription)
            validateKeyPointData(keyPointId)
        })

        newKeyPointImageURLElement.id = `keyPointImageURLElement${keyPointId}`
        newKeyPointImageURLElement.value = keyPoint.imageUrl
        newKeyPointImageURLElement.addEventListener("blur", () => {
            toursUtils.validationSingleInput(newKeyPointImageURLElement)
            validateKeyPointData(keyPointId)
        })

        newDeleteKeyPointButtonElement.id = `deleteKeyPointButtonElement${keyPointId}`
        newDeleteKeyPointButtonElement.addEventListener("click", () => {
            keyPointServices.delete(keyPointId)
                .then(() => {
                    order--
                    updateTourData()
                })
                .catch(error => console.error(error.status, error.message))
        })

        newSaveKeyPointButtonElement.id = `saveKeyPointButtonElement${keyPointId}`
        newSaveKeyPointButtonElement.addEventListener("click", () => {
            keyPointServices.add(keyPoint)
                .then(() => {
                    order++
                    updateTourData()
                })
                .catch(error => console.error(error.status, error.message))
        })

        newKeyPointOverviewDiv.style.display = "flex"
        keyPointOverviewSection.append(newKeyPointOverviewDiv)

        validateKeyPointData(keyPointId)
    })

    const emptyKeyPointOverviewDiv = keyPointOverviewDivTemplate.cloneNode(true) as HTMLDivElement

    keyPointOverviewSection.append(emptyKeyPointOverviewDiv)

    emptyKeyPointOverviewDiv.style.display = "flex"

    keyPointImageElement = emptyKeyPointOverviewDiv.querySelector("#keyPointImageElement") as HTMLInputElement
    keyPointNameElement = emptyKeyPointOverviewDiv.querySelector("#keyPointNameElement") as HTMLInputElement
    keyPointLatitudeElement = emptyKeyPointOverviewDiv.querySelector("#keyPointLatitudeElement") as HTMLInputElement
    keyPointLongitudeElement = emptyKeyPointOverviewDiv.querySelector("#keyPointLongitudeElement") as HTMLInputElement
    keyPointDescription = emptyKeyPointOverviewDiv.querySelector("#keyPointDescription") as HTMLInputElement
    keyPointImageURLElement = emptyKeyPointOverviewDiv.querySelector("#keyPointImageURLElement") as HTMLInputElement
    keyPointCancelButton = emptyKeyPointOverviewDiv.querySelector("#deleteKeyPointButtonElement") as HTMLButtonElement
    keyPointSubmitButton = emptyKeyPointOverviewDiv.querySelector("#saveKeyPointButtonElement") as HTMLButtonElement



    keyPointNameElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(keyPointNameElement)
        validateKeyPointData()
    })

    keyPointLatitudeElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(keyPointLatitudeElement)
        validateKeyPointData()
    })

    keyPointLongitudeElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(keyPointLongitudeElement)
        validateKeyPointData()
    })

    keyPointDescription.addEventListener("blur", () => {
        toursUtils.validationSingleInput(keyPointDescription)
        validateKeyPointData()
    })

    keyPointImageURLElement.addEventListener("blur", () => {
        toursUtils.validationSingleInput(keyPointImageURLElement)
        validateKeyPointData()
    })

    keyPointImageElement.src = keyPointImageURLElement.value

    keyPointSubmitButton.textContent = "Submit"
    keyPointSubmitButton.addEventListener("click", () => {
        const name = keyPointNameElement.value
        const latitude = parseInt(keyPointLatitudeElement.value)
        const longitude = parseInt(keyPointLongitudeElement.value)
        const description = keyPointDescription.value
        const imageUrl = keyPointImageURLElement.value
        const newKeyPoint: KeyPoint = { order, name, description, latitude, longitude, imageUrl, tourId }
        submitKeyPointData(newKeyPoint)     
    })

    checkForPublishButton(tourById)

    order = order + 1

    keyPointCancelButton.disabled = true
    keyPointCancelButton.style.visibility = "hidden"
}


function validateKeyPointData(keyPointId?) {
    let keyPointNameFlag
    let keyPointLongitudeFlag
    let keyPointLatitudeFlag
    let keyPointDescriptionFlag
    let keyPointImageURLFlag
    let mainButton = document.querySelector("#saveKeyPointButtonElement") as HTMLButtonElement

    if (keyPointId) {
        keyPointNameFlag = toursUtils.validationFinal(document.getElementById(`keyPointNameElement${keyPointId}`) as HTMLInputElement)
        keyPointLongitudeFlag = toursUtils.validationFinal(document.getElementById(`keyPointLatitudeElement${keyPointId}`) as HTMLInputElement)
        keyPointLatitudeFlag = toursUtils.validationFinal(document.getElementById(`keyPointLongitudeElement${keyPointId}`) as HTMLInputElement)
        keyPointDescriptionFlag = toursUtils.validationFinal(document.getElementById(`keyPointDescription${keyPointId}`) as HTMLInputElement)
        keyPointImageURLFlag = toursUtils.validationFinal(document.getElementById(`keyPointImageURLElement${keyPointId}`) as HTMLInputElement)
        mainButton = document.getElementById(`saveKeyPointButtonElement${keyPointId}`) as HTMLButtonElement
    }
    else {
        keyPointNameFlag = toursUtils.validationFinal(keyPointNameElement)
        keyPointLongitudeFlag = toursUtils.validationFinal(keyPointLatitudeElement)
        keyPointLatitudeFlag = toursUtils.validationFinal(keyPointLongitudeElement)
        keyPointDescriptionFlag = toursUtils.validationFinal(keyPointDescription)
        keyPointImageURLFlag = toursUtils.validationFinal(keyPointImageURLElement)
    }

    if (!keyPointNameFlag || !keyPointDescriptionFlag || !keyPointLongitudeFlag || !keyPointLatitudeFlag || !keyPointImageURLFlag) {
        mainButton.disabled = true;
        mainButton.style.backgroundColor = "grey"
        return;
    }
    mainButton.disabled = false;
    mainButton.style.backgroundColor = "green"
    return;
}


function submitKeyPointData(keyPoint: KeyPoint): void {
    keyPointServices.add(keyPoint)
        .then(() => {
            updateTourData()
        })
        .catch(error => console.error(error.status, error.message))
}


document.addEventListener("DOMContentLoaded", () => {
    tourNameElement = document.querySelector("#tourNameElement") as HTMLInputElement
    tourDescriptionElement = document.querySelector("#tourDescriptionElement") as HTMLInputElement
    tourDateTimeElement = document.querySelector("#tourDateTimeElement") as HTMLInputElement
    tourMaxGuestsElement = document.querySelector("#tourMaxGuestsElement") as HTMLInputElement
    tourKeyPointButtonElement = document.getElementById("keyPointButtonElement") as HTMLButtonElement
    tourFormPublishButtonElement = document.getElementById("tourFormPublishButtonElement") as HTMLButtonElement
    tourCancelButtonElement = document.getElementById("tourFormCancelButtonElement") as HTMLButtonElement
    tourSubmitButtonElement = document.getElementById("tourFormSubmitButtonElement") as HTMLButtonElement

    keyPointOverviewSection = document.querySelector("#keyPointOverviewSection") as HTMLDivElement
    keyPointOverviewDiv = document.querySelector(".keyPointOverviewDiv") as HTMLDivElement
    keyPointOverviewDivTemplate = keyPointOverviewDiv.cloneNode(true) as HTMLDivElement
    keyPointOverviewDiv.remove();

    tourFormInitialize(guideId, tourId);
})