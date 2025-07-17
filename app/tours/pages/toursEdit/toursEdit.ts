import { handleLogout } from "../../../users/pages/login/login.js"
import { Tour } from "../../models/tour.model.js";
import { ToursServices } from "../../services/tours.services.js"
import { ToursUtils } from "../../utils/tours.utils.js"
import { TourKeyPoint } from "../../models/tourKeyPoint.model.js"
import { ToursKeyPointServices } from "../../services/toursKeyPoint.services.js";
import { TourKeyPointFlags } from "../../models/tourKeyPointFlags.model.js"
const url = window.location.search
const searchParams = new URLSearchParams(url)
const tourId = parseInt(searchParams.get("tourId"))

const toursServices = new ToursServices()
const toursUtils = new ToursUtils()
const keyPointServices = new ToursKeyPointServices(tourId)

let tourById: Tour
let tourByIdKeyPoints: TourKeyPoint[]

let tourEditMain
let tourNameInput
let tourDescriptionInput
let tourDateTimeInput
let tourMaxGuestsInput
let tourKeyPointButton
let tourPublishButton
let tourCancelButton
let tourSubmitButton

let tourEditNameFlag = false
let tourEditDescriptionFlag = false
let tourEditDateTimeFlag = false
let tourEditMaxGuestsFlag = false

let keyPointMain

let keypointCreateMain
let keyPointImageImg
let keyPointNameInput
let keyPointLatitudeInput
let keyPointLongitudeInput
let keyPointDescriptionInput
let keyPointImageURLInput
let keyPointSubmitButton

let keyPointCreateNameFlag = false
let keyPointCreateLongitudeFlag = false
let keyPointCreateLatitudeFlag = false
let keyPointCreateDescriptionFlag = false
let keyPointCreateImageURLFlag = false

let keyPointEditMain
let keyPointEditTemplateHandler
let keyPointEditTemplate

let order

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLElement;
    logoutButton.addEventListener('click', handleLogout)

    tourEditMain = document.getElementById("tour-edit-main") as HTMLDivElement
    tourNameInput = tourEditMain.querySelector(".tour-name-input") as HTMLInputElement
    tourDescriptionInput = tourEditMain.querySelector(".tour-description-input") as HTMLInputElement
    tourDateTimeInput = tourEditMain.querySelector(".tour-datetime-input") as HTMLInputElement
    tourMaxGuestsInput = tourEditMain.querySelector(".tour-maxguests-input") as HTMLInputElement
    tourKeyPointButton = tourEditMain.querySelector(".tour-keypoint-button") as HTMLButtonElement
    tourPublishButton = tourEditMain.querySelector(".tour-publish-button") as HTMLButtonElement
    tourCancelButton = tourEditMain.querySelector(".cancel-button") as HTMLButtonElement
    tourSubmitButton = tourEditMain.querySelector(".submit-button") as HTMLButtonElement

    keyPointMain = document.getElementById("keypoint-main") as HTMLDivElement

    keypointCreateMain = document.getElementById("keypoint-create-main") as HTMLDivElement
    keyPointImageImg = keypointCreateMain.querySelector(".keypoint-image-img") as HTMLInputElement
    keyPointNameInput = keypointCreateMain.querySelector(".keypoint-name-input") as HTMLInputElement
    keyPointLatitudeInput = keypointCreateMain.querySelector(".keypoint-latitude-input") as HTMLInputElement
    keyPointLongitudeInput = keypointCreateMain.querySelector(".keypoint-longitude-input") as HTMLInputElement
    keyPointDescriptionInput = keypointCreateMain.querySelector(".keypoint-description-input") as HTMLInputElement
    keyPointImageURLInput = keypointCreateMain.querySelector(".keypoint-imageurl-input") as HTMLInputElement
    keyPointSubmitButton = keypointCreateMain.querySelector(".keypoint-submit-button") as HTMLButtonElement

    keyPointEditMain = document.getElementById("keypoint-edit-main") as HTMLDivElement
    keyPointEditTemplateHandler = keyPointEditMain.querySelector("#keypoint-edit-template-handler") as HTMLDivElement
    keyPointEditTemplate = keyPointEditMain.querySelector("#keypoint-edit-template") as HTMLTemplateElement
    tourGetById()
    tourEditFormInitialize()
    keyPointCreateFormInitialize()
})


function tourGetById() {
    Promise.all([
        toursServices.getByTourId(tourId),
        toursServices.getTourKeyPointsByTourId(tourId)
    ])
    .then(([tour, tourKeyPoints]) => {
        tourById = tour;
        tourByIdKeyPoints = tourKeyPoints;
        tourEditFormRenderData();
        keyPointEditSectionSetup();
    })
    .catch((error) => {
        console.error(error.status, error.message);
    });
}

function tourEditFormInitialize(): void {
    tourNameInput.addEventListener("input", () => {
        tourEditNameFlag = toursUtils.validationSingleInput(tourNameInput)
        tourEditFormCheckSubmitButton()
    })

    tourDescriptionInput.addEventListener("input", () => {
        tourEditDescriptionFlag = toursUtils.validationSingleInput(tourDescriptionInput)
        tourEditFormCheckSubmitButton()
    })

    tourDateTimeInput.addEventListener("input", () => {
        tourEditDateTimeFlag = toursUtils.validationSingleInput(tourDateTimeInput)
        tourEditFormCheckSubmitButton()
    })

    tourMaxGuestsInput.addEventListener("input", () => {
        tourEditMaxGuestsFlag = toursUtils.validationSingleInput(tourMaxGuestsInput)
        tourEditFormCheckSubmitButton()
    })

    tourKeyPointButton.addEventListener("click", () => {
        keyPointEditSectionSetup()
        keyPointMain.style.display = "flex"
    }, { once: true })

    tourPublishButton.addEventListener("click", () => {
        tourById.status = "Published"
        toursServices.update(tourById.id, tourById)
            .then(() => tourEditFormRenderData())
    })

    tourCancelButton.addEventListener("click", () => {
        window.location.href = `../toursOverview/toursOverview.html`
    })

    tourSubmitButton.addEventListener("click", () => {
        tourEditFormSubmitData()
    });
}


function tourEditFormRenderData() { //fills tourForm with values from tourById
    tourNameInput.value = tourById.name
    tourDescriptionInput.value = tourById.description
    tourDateTimeInput.value = tourById.dateTime.toString()
    tourMaxGuestsInput.value = tourById.maxGuests.toString()
    tourEditFormValidateData()
    tourEditFormCheckPublishStatus()
    tourEditFormCheckSubmitButton()
}


function tourEditFormValidateData() {
    tourEditNameFlag = toursUtils.validationSingleInput(tourNameInput)
    tourEditDescriptionFlag = toursUtils.validationSingleInput(tourDescriptionInput)
    tourEditDateTimeFlag = toursUtils.validationSingleInput(tourDateTimeInput)
    tourEditMaxGuestsFlag = toursUtils.validationSingleInput(tourMaxGuestsInput)
}


function tourEditFormCheckPublishStatus() {
    if (tourByIdKeyPoints.length < 2) {
        if (tourById.status !== "Not Ready") {
            tourById.status = "Not Ready";
            toursServices.update(tourById.id, tourById)
                .then(() => {
                    tourGetById()
                })
                .catch((error) => console.error(error.status, error.message));
        }
        tourPublishButton.disabled = true;
        tourPublishButton.style.backgroundColor = "gray";
        tourPublishButton.textContent = "2 Key Points needed to publish tour";
        return;
    }

    if (tourById.status === "Published") {
        tourPublishButton.disabled = true;
        tourPublishButton.style.backgroundColor = "gray";
        tourPublishButton.textContent = "Published";
        return;
    }

    if (tourById.status !== "Ready") {
        tourById.status = "Ready";
        toursServices.update(tourById.id, tourById)
            .then(() => {
                tourGetById()
            })
            .catch((error) => console.error(error.status, error.message));
    }
    tourPublishButton.disabled = false;
    tourPublishButton.style.backgroundColor = "green";
    tourPublishButton.textContent = "Publish tour";
}


function tourEditFormCheckSubmitButton(): boolean { //validationFinal za osposobljavanje tourSubmit dugmeta
    if (!tourEditNameFlag || !tourEditDescriptionFlag || !tourEditDateTimeFlag || !tourEditMaxGuestsFlag) {
        tourSubmitButton.disabled = true;
        tourSubmitButton.style.backgroundColor = "grey"
        return;
    }
    tourSubmitButton.disabled = false;
    tourSubmitButton.style.backgroundColor = "green"
    return;
}


function tourEditFormSubmitData(): void {
    tourById.name = tourNameInput.value
    tourById.description = tourDescriptionInput.value
    tourById.dateTime = tourDateTimeInput.value
    tourById.maxGuests = parseInt(tourMaxGuestsInput.value)

    toursServices.update(tourById.id, tourById)
        .then(() => {
            tourEditFormRenderData()
            keyPointEditSectionSetup()
        })
        .catch(error => console.error(error.status, error.message))
}


function keyPointCreateFormInitialize() {
    keyPointNameInput.addEventListener("input", () => {
        keyPointCreateNameFlag = toursUtils.validationSingleInput(keyPointNameInput)
        keyPointCreateCheckSubmitButton()
    })

    keyPointLatitudeInput.addEventListener("input", () => {
        keyPointCreateLatitudeFlag = toursUtils.validationSingleInput(keyPointLatitudeInput)
        keyPointCreateCheckSubmitButton()
    })

    keyPointLongitudeInput.addEventListener("input", () => {
        keyPointCreateLongitudeFlag = toursUtils.validationSingleInput(keyPointLongitudeInput)
        keyPointCreateCheckSubmitButton()
    })

    keyPointDescriptionInput.addEventListener("input", () => {
        keyPointCreateDescriptionFlag = toursUtils.validationSingleInput(keyPointDescriptionInput)
        keyPointCreateCheckSubmitButton()
    })

    keyPointImageURLInput.addEventListener("input", () => {
        keyPointCreateImageURLFlag = toursUtils.validationSingleInput(keyPointImageURLInput)
        keyPointImageImg.src = keyPointImageURLInput.value
        keyPointCreateCheckSubmitButton()
    })

    keyPointSubmitButton.addEventListener("click", () => {
        keyPointCreateSubmitFormData()
    })
    keyPointCreateCheckSubmitButton()
}


function keyPointCreateCheckSubmitButton() {
    if (!keyPointCreateNameFlag || !keyPointCreateLongitudeFlag || !keyPointCreateLatitudeFlag || !keyPointCreateDescriptionFlag || !keyPointCreateImageURLFlag) {
        keyPointSubmitButton.disabled = true;
        keyPointSubmitButton.style.backgroundColor = "grey"
        return;
    }
    keyPointSubmitButton.disabled = false;
    keyPointSubmitButton.style.backgroundColor = "green"
    return;
}


function keyPointEditSectionSetup() {
    keyPointEditTemplateHandler.innerHTML = ''
    order = 1

    tourByIdKeyPoints.forEach((keyPoint: TourKeyPoint) => {
        const keyPointId = keyPoint.id
        const keyPointFlag: TourKeyPointFlags = {}
        keyPoint.flags = keyPointFlag

        const keyPointEditFragment = keyPointEditTemplate.content.cloneNode(true) as DocumentFragment
        const keyPointEditSection = keyPointEditFragment.querySelector(".keypoint-edit-section") as HTMLDivElement

        const keyPointEditImageImg = keyPointEditSection.querySelector(".keypoint-image-img") as HTMLImageElement
        const keyPointEditNameInput = keyPointEditSection.querySelector(".keypoint-name-input") as HTMLInputElement
        const keyPointEditLatitudeInput = keyPointEditSection.querySelector(".keypoint-latitude-input") as HTMLInputElement
        const keyPointEditLongitudeInput = keyPointEditSection.querySelector(".keypoint-longitude-input") as HTMLInputElement
        const keyPointEditDescriptionInput = keyPointEditSection.querySelector(".keypoint-description-input") as HTMLTextAreaElement
        const keyPointEditImageURLInput = keyPointEditSection.querySelector(".keypoint-imageurl-input") as HTMLInputElement
        const keyPointEditDeleteButton = keyPointEditSection.querySelector(".keypoint-delete-button") as HTMLButtonElement
        const keyPointEditSaveButton = keyPointEditSection.querySelector(".keypoint-save-button") as HTMLButtonElement

        keyPointEditSection.id = `keypoint-edit-section${keyPointId}`
        keyPointEditSection.classList.add("keypoint-form-section")

        keyPointEditImageImg.src = keyPoint.imageUrl

        keyPointEditNameInput.value = keyPoint.name
        keyPoint.flags.keyPointEditNameFlag = toursUtils.validationSingleInput(keyPointEditNameInput)
        keyPointEditNameInput.addEventListener("input", () => {
            keyPoint.flags.keyPointEditNameFlag = toursUtils.validationSingleInput(keyPointEditNameInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })

        keyPointEditLatitudeInput.value = keyPoint.latitude.toString()
        keyPoint.flags.keyPointEditLatitudeFlag = toursUtils.validationSingleInput(keyPointEditLatitudeInput)
        keyPointEditLatitudeInput.addEventListener("input", () => {
            keyPoint.flags.keyPointEditLatitudeFlag = toursUtils.validationSingleInput(keyPointEditLatitudeInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })

        keyPointEditLongitudeInput.value = keyPoint.longitude.toString()
        keyPoint.flags.keyPointEditLongitudeFlag = toursUtils.validationSingleInput(keyPointEditLongitudeInput)
        keyPointEditLongitudeInput.addEventListener("input", () => {
            keyPoint.flags.keyPointEditLongitudeFlag = toursUtils.validationSingleInput(keyPointEditLongitudeInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })

        keyPointEditDescriptionInput.value = keyPoint.description
        keyPoint.flags.keyPointEditDescriptionFlag = toursUtils.validationSingleInput(keyPointEditDescriptionInput)
        keyPointEditDescriptionInput.addEventListener("input", () => {
            keyPoint.flags.keyPointEditDescriptionFlag = toursUtils.validationSingleInput(keyPointEditDescriptionInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })

        keyPointEditImageURLInput.value = keyPoint.imageUrl
        keyPoint.flags.keyPointEditImageURLFlag = toursUtils.validationSingleInput(keyPointEditImageURLInput)
        keyPointEditImageURLInput.addEventListener("blur", () => {
            keyPoint.flags.keyPointEditImageURLFlag = toursUtils.validationSingleInput(keyPointEditImageURLInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })

        keyPointEditDeleteButton.addEventListener("click", () => {
            keyPointServices.delete(keyPointId)
                .then(() => {
                    tourGetById()
                })
                .catch(error => console.error(error.status, error.message))
        })

        //----------------------------------------------TO BE IMPLEMENTED
        keyPointEditSaveButton.id = `keypoint-edit-save-button${keyPoint.id}`
        keyPointEditSaveButton.addEventListener("", () => {
            keyPointServices.add(keyPoint)
                .then(() => {
                    tourGetById()
                })
                .catch(error => console.error(error.status, error.message))
        })
        keyPointEditSaveButton.disabled = true
        keyPointEditSaveButton.textContent = "DISABLED"
        //----------------------------------------------

        keyPointEditTemplateHandler.style.display = "flex"
        keyPointEditTemplateHandler.append(keyPointEditSection)

        order++

        keyPointEditCheckSubmitButton(keyPoint)
    })
}


function keyPointEditCheckSubmitButton(keyPoint) {
    const keyPointEditSaveButton = document.getElementById(`keypoint-edit-save-button${keyPoint.id}`) as HTMLButtonElement

    if (!keyPoint.flags.keyPointEditNameFlag || !keyPoint.flags.keyPointEditLatitudeFlag || !keyPoint.flags.keyPointEditLongitudeFlag || !keyPoint.flags.keyPointEditDescriptionFlag || !keyPoint.flags.keyPointEditImageURLFlag) {
        keyPointEditSaveButton.disabled = true;
        keyPointEditSaveButton.style.backgroundColor = "grey"
        return;
    }
    keyPointEditSaveButton.disabled = false;
    keyPointEditSaveButton.style.backgroundColor = "green"
    return;
}


function keyPointCreateSubmitFormData() {
    const name = keyPointNameInput.value
    const latitude = parseInt(keyPointLatitudeInput.value)
    const longitude = parseInt(keyPointLongitudeInput.value)
    const description = keyPointDescriptionInput.value
    const imageUrl = keyPointImageURLInput.value
    const newKeyPoint: TourKeyPoint = { order, name, description, latitude, longitude, imageUrl, tourId }

    keyPointNameInput.value = ''
    keyPointLatitudeInput.value = ''
    keyPointLongitudeInput.value = ''
    keyPointDescriptionInput.value = ''
    keyPointImageURLInput.value = ''
    keyPointImageImg.src = ''

    keyPointServices.add(newKeyPoint)
        .then(() => {
            tourGetById()
        })
        .catch(error => console.error(error.status, error.message))
}