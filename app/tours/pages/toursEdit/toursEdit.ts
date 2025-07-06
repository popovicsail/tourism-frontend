import { handleLogout } from "../../../users/pages/login/login.js"
import { Tour } from "../../models/tour.model.js";
import { ToursServices } from "../../services/tours.services.js"
import { ToursUtils } from "../../utils/tours.utils.js"
import { KeyPoint } from "../../models/keyPoint.model.js"
import { KeyPointServices } from "../../services/keyPoint.services.js";
import { KeyPointFlags } from "../../models/keyPointFlags.model.js"
const url = window.location.search
const searchParams = new URLSearchParams(url)
const tourId = parseInt(searchParams.get("tourId"))
const toursServices = new ToursServices()
const toursUtils = new ToursUtils()
let keyPointServices
let tourById: Tour

let tourEditNameInput
let tourEditDescriptionInput
let tourEditDateTimeInput
let tourEditMaxGuestsInput
let tourEditKeyPointButton
let tourEditPublishButton
let tourEditCancelButton
let tourEditSubmitButton

let tourEditNameFlag = false
let tourEditDescriptionFlag = false
let tourEditDateTimeFlag = false
let tourEditMaxGuestsFlag = false

let keyPointSection
let keyPointEditSectionTemplateHandler
let keyPointEditSectionTemplate

let keyPointCreateImageImg
let keyPointCreateNameInput
let keyPointCreateLatitudeInput
let keyPointCreateLongitudeInput
let keyPointCreateDescriptionInput
let keyPointCreateImageURLInput
let keyPointCreateSubmitButton

let keyPointCreateNameFlag = false
let keyPointCreateLongitudeFlag = false
let keyPointCreateLatitudeFlag = false
let keyPointCreateDescriptionFlag = false
let keyPointCreateImageURLFlag = false

let order

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('#logout-button') as HTMLElement;
    logoutButton.addEventListener('click', handleLogout)

    tourEditNameInput = document.getElementById("tour-edit-name-input") as HTMLInputElement
    tourEditDescriptionInput = document.getElementById("tour-edit-description-input") as HTMLInputElement
    tourEditDateTimeInput = document.getElementById("tour-edit-datetime-input") as HTMLInputElement
    tourEditMaxGuestsInput = document.getElementById("tour-edit-maxguests-input") as HTMLInputElement
    tourEditKeyPointButton = document.getElementById("tour-keypoint-edit-button") as HTMLButtonElement
    tourEditPublishButton = document.getElementById("tour-edit-publish-button") as HTMLButtonElement
    tourEditCancelButton = document.getElementById("tour-edit-cancel-button") as HTMLButtonElement
    tourEditSubmitButton = document.getElementById("tour-edit-submit-button") as HTMLButtonElement

    keyPointSection = document.getElementById("keypoint-section") as HTMLDivElement
    keyPointEditSectionTemplateHandler = document.getElementById("keypoint-edit-section-template-handler") as HTMLDivElement
    keyPointEditSectionTemplate = document.getElementById("keypoint-edit-section-template") as HTMLDivElement

    keyPointCreateImageImg = document.getElementById("keypoint-create-image-img") as HTMLInputElement
    keyPointCreateNameInput = document.getElementById("keypoint-create-name-input") as HTMLInputElement
    keyPointCreateLatitudeInput = document.getElementById("keypoint-create-latitude-input") as HTMLInputElement
    keyPointCreateLongitudeInput = document.getElementById("keypoint-create-longitude-input") as HTMLInputElement
    keyPointCreateDescriptionInput = document.getElementById("keypoint-create-description-input") as HTMLInputElement
    keyPointCreateImageURLInput = document.getElementById("keypoint-create-imageurl-input") as HTMLInputElement
    keyPointCreateSubmitButton = document.getElementById("keypoint-create-submit-button") as HTMLButtonElement

    tourGetById()
    tourEditFormInitialize()
    keyPointCreateFormInitialize()
})


function tourGetById() { //Updateuje tourById sa najsvezijim podacima i prikazuje ih
    toursServices.getByTourId(tourId)
        .then((tour: Tour) => {
            tourById = tour
            keyPointServices = new KeyPointServices(tourById.id)
            tourEditFormRenderData()
            keyPointEditSectionSetup()
        })
        .catch((error) => {
            console.error(error.status, error.message)
        })
}


function tourEditFormInitialize(): void {
    tourEditNameInput.addEventListener("blur", () => {
        tourEditNameFlag = toursUtils.validationSingleInput(tourEditNameInput)
        tourEditFormCheckSubmitButton()
    })

    tourEditDescriptionInput.addEventListener("blur", () => {
        tourEditDescriptionFlag = toursUtils.validationSingleInput(tourEditDescriptionInput)
        tourEditFormCheckSubmitButton()
    })

    tourEditDateTimeInput.addEventListener("blur", () => {
        tourEditDateTimeFlag = toursUtils.validationSingleInput(tourEditDateTimeInput)
        tourEditFormCheckSubmitButton()
    })

    tourEditMaxGuestsInput.addEventListener("blur", () => {
        tourEditMaxGuestsFlag = toursUtils.validationSingleInput(tourEditMaxGuestsInput)
        tourEditFormCheckSubmitButton()
    })

    tourEditKeyPointButton.addEventListener("click", () => {
        keyPointEditSectionSetup()
        keyPointSection.style.display = "flex"
    }, { once: true })

    tourEditPublishButton.addEventListener("click", () => {
        tourById.status = "Published"
        toursServices.update(tourById.id, tourById)
            .then(() => tourEditFormRenderData())
    })

    tourEditCancelButton.addEventListener("click", () => {
        window.location.href = `../toursOverview/toursOverview.html`
    })

    tourEditSubmitButton.addEventListener("click", () => {
        tourEditFormSubmitData()
    });
}


function tourEditFormRenderData() { //fills tourForm with values from tourById
    tourEditNameInput.value = tourById.name
    tourEditDescriptionInput.value = tourById.description
    tourEditDateTimeInput.value = tourById.dateTime.toString()
    tourEditMaxGuestsInput.value = tourById.maxGuests.toString()
    tourEditFormValidateData()
    tourEditFormCheckPublishStatus()
    tourEditFormCheckSubmitButton()
}


function tourEditFormValidateData() {
    tourEditNameFlag = toursUtils.validationSingleInput(tourEditNameInput)
    tourEditDescriptionFlag = toursUtils.validationSingleInput(tourEditDescriptionInput)
    tourEditDateTimeFlag = toursUtils.validationSingleInput(tourEditDateTimeInput)
    tourEditMaxGuestsFlag = toursUtils.validationSingleInput(tourEditMaxGuestsInput)
}


function tourEditFormCheckPublishStatus() {
    if (tourById.keyPoints.length < 2) {
        if (tourById.status !== "Not Ready") {
            tourById.status = "Not Ready";
            toursServices.update(tourById.id, tourById)
                .then(() => {
                    tourGetById()
                })
                .catch((error) => console.error(error.status, error.message));
        }
        tourEditPublishButton.disabled = true;
        tourEditPublishButton.style.backgroundColor = "gray";
        tourEditPublishButton.textContent = "2 Key Points needed to publish tour";
        return;
    }

    if (tourById.status === "Published") {
        tourEditPublishButton.disabled = true;
        tourEditPublishButton.style.backgroundColor = "gray";
        tourEditPublishButton.textContent = "Published";
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
    tourEditPublishButton.disabled = false;
    tourEditPublishButton.style.backgroundColor = "green";
    tourEditPublishButton.textContent = "Publish tour";
}


function tourEditFormCheckSubmitButton(): boolean { //validationFinal za osposobljavanje tourSubmit dugmeta
    if (!tourEditNameFlag || !tourEditDescriptionFlag || !tourEditDateTimeFlag || !tourEditMaxGuestsFlag) {
        tourEditSubmitButton.disabled = true;
        tourEditSubmitButton.style.backgroundColor = "grey"
        return;
    }
    tourEditSubmitButton.disabled = false;
    tourEditSubmitButton.style.backgroundColor = "green"
    return;
}


function tourEditFormSubmitData(): void {
    tourById.name = tourEditNameInput.value
    tourById.description = tourEditDescriptionInput.value
    tourById.dateTime = tourEditDateTimeInput.value
    tourById.maxGuests = parseInt(tourEditMaxGuestsInput.value)

    toursServices.update(tourById.id, tourById)
        .then(() => {
            tourEditFormRenderData()
            keyPointEditSectionSetup()
        })
        .catch(error => console.error(error.status, error.message))
}




function keyPointCreateFormInitialize() {
    keyPointCreateNameInput.addEventListener("blur", () => {
        keyPointCreateNameFlag = toursUtils.validationSingleInput(keyPointCreateNameInput)
        keyPointCreateCheckSubmitButton()
    })

    keyPointCreateLatitudeInput.addEventListener("blur", () => {
        keyPointCreateLatitudeFlag = toursUtils.validationSingleInput(keyPointCreateLatitudeInput)
        keyPointCreateCheckSubmitButton()
    })

    keyPointCreateLongitudeInput.addEventListener("blur", () => {
        keyPointCreateLongitudeFlag = toursUtils.validationSingleInput(keyPointCreateLongitudeInput)
        keyPointCreateCheckSubmitButton()
    })

    keyPointCreateDescriptionInput.addEventListener("blur", () => {
        keyPointCreateDescriptionFlag = toursUtils.validationSingleInput(keyPointCreateDescriptionInput)
        keyPointCreateCheckSubmitButton()
    })

    keyPointCreateImageURLInput.addEventListener("blur", () => {
        keyPointCreateImageURLFlag = toursUtils.validationSingleInput(keyPointCreateImageURLInput)
        keyPointCreateImageImg.src = keyPointCreateImageURLInput.value
        keyPointCreateCheckSubmitButton()
    })

    keyPointCreateSubmitButton.addEventListener("click", () => {
        keyPointCreateSubmitFormData()
    })
    keyPointCreateCheckSubmitButton()
}


function keyPointCreateCheckSubmitButton() {
    if (!keyPointCreateNameFlag || !keyPointCreateLongitudeFlag || !keyPointCreateLatitudeFlag || !keyPointCreateDescriptionFlag || !keyPointCreateImageURLFlag) {
        keyPointCreateSubmitButton.disabled = true;
        keyPointCreateSubmitButton.style.backgroundColor = "grey"
        return;
    }
    keyPointCreateSubmitButton.disabled = false;
    keyPointCreateSubmitButton.style.backgroundColor = "green"
    return;
}




function keyPointEditSectionSetup() {
    keyPointEditSectionTemplateHandler.innerHTML = ''
    order = 1

    tourById.keyPoints.forEach((keyPoint: KeyPoint) => {
        const keyPointId = keyPoint.id
        const keyPointFlag: KeyPointFlags = {}
        keyPoint.flags = keyPointFlag

        const keyPointEditSection = keyPointEditSectionTemplate.cloneNode(true) as HTMLDivElement

        const keyPointEditImageImg = keyPointEditSection.querySelector("#keypoint-edit-image-img") as HTMLImageElement
        const keyPointEditNameInput = keyPointEditSection.querySelector("#keypoint-edit-name-input") as HTMLInputElement
        const keyPointEditLatitudeInput = keyPointEditSection.querySelector("#keypoint-edit-latitude-input") as HTMLInputElement
        const keyPointEditLongitudeInput = keyPointEditSection.querySelector("#keypoint-edit-longitude-input") as HTMLInputElement
        const keyPointEditDescriptionInput = keyPointEditSection.querySelector("#keypoint-edit-description-input") as HTMLTextAreaElement
        const keyPointEditImageURLInput = keyPointEditSection.querySelector("#keypoint-edit-imageurl-input") as HTMLInputElement
        const keyPointEditDeleteButton = keyPointEditSection.querySelector("#keypoint-edit-delete-button") as HTMLButtonElement
        const keyPointEditSaveButton = keyPointEditSection.querySelector("#keypoint-edit-save-button") as HTMLButtonElement

        keyPointEditSection.id = `keypoint-edit-section${keyPointId}`

        keyPointEditImageImg.src = keyPoint.imageUrl

        keyPointEditNameInput.id = `keypoint-edit-name-input${keyPointId}`
        keyPointEditNameInput.value = keyPoint.name
        keyPoint.flags.keyPointEditNameFlag = toursUtils.validationSingleInput(keyPointEditNameInput)
        keyPointEditNameInput.addEventListener("blur", () => {
            keyPoint.flags.keyPointEditNameFlag = toursUtils.validationSingleInput(keyPointEditNameInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })

        keyPointEditLatitudeInput.id = `keypoint-edit-latitude-input${keyPointId}`
        keyPointEditLatitudeInput.value = keyPoint.latitude.toString()
        keyPoint.flags.keyPointEditLatitudeFlag = toursUtils.validationSingleInput(keyPointEditLatitudeInput)
        keyPointEditLatitudeInput.addEventListener("blur", () => {
            keyPoint.flags.keyPointEditLatitudeFlag = toursUtils.validationSingleInput(keyPointEditLatitudeInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })

        keyPointEditLongitudeInput.id = `keypoint-edit-longitude-input${keyPointId}`
        keyPointEditLongitudeInput.value = keyPoint.longitude.toString()
        keyPoint.flags.keyPointEditLongitudeFlag = toursUtils.validationSingleInput(keyPointEditLongitudeInput)
        keyPointEditLongitudeInput.addEventListener("blur", () => {
            keyPoint.flags.keyPointEditLongitudeFlag = toursUtils.validationSingleInput(keyPointEditLongitudeInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })


        keyPointEditDescriptionInput.id = `keypoint-edit-description-input${keyPointId}`
        keyPointEditDescriptionInput.value = keyPoint.description
        keyPoint.flags.keyPointEditDescriptionFlag = toursUtils.validationSingleInput(keyPointEditDescriptionInput)
        keyPointEditDescriptionInput.addEventListener("blur", () => {
            keyPoint.flags.keyPointEditDescriptionFlag = toursUtils.validationSingleInput(keyPointEditDescriptionInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })

        keyPointEditImageURLInput.id = `keypoint-edit-imageurl-input${keyPointId}`
        keyPointEditImageURLInput.value = keyPoint.imageUrl
        keyPoint.flags.keyPointEditImageURLFlag = toursUtils.validationSingleInput(keyPointEditImageURLInput)
        keyPointEditImageURLInput.addEventListener("blur", () => {
            keyPoint.flags.keyPointEditImageURLFlag = toursUtils.validationSingleInput(keyPointEditImageURLInput)
            keyPointEditCheckSubmitButton(keyPoint)
        })


        keyPointEditDeleteButton.id = `keypoint-edit-delete-button${keyPointId}`
        keyPointEditDeleteButton.addEventListener("click", () => {
            keyPointServices.delete(keyPointId)
                .then(() => {
                    tourGetById()
                })
                .catch(error => console.error(error.status, error.message))
        })

        //----------------------------------------------TO BE IMPLEMENTED
        keyPointEditSaveButton.id = `keypoint-edit-save-button${keyPointId}`
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

        keyPointEditSection.style.display = "flex"
        keyPointEditSectionTemplateHandler.append(keyPointEditSection)

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
    const name = keyPointCreateNameInput.value
    const latitude = parseInt(keyPointCreateLatitudeInput.value)
    const longitude = parseInt(keyPointCreateLongitudeInput.value)
    const description = keyPointCreateDescriptionInput.value
    const imageUrl = keyPointCreateImageURLInput.value
    const newKeyPoint: KeyPoint = { order, name, description, latitude, longitude, imageUrl, tourId }

    keyPointCreateNameInput.value = ''
    keyPointCreateLatitudeInput.value = ''
    keyPointCreateLongitudeInput.value = ''
    keyPointCreateDescriptionInput.value = ''
    keyPointCreateImageURLInput.value = ''
    keyPointCreateImageImg.src = ''

    keyPointServices.add(newKeyPoint)
        .then(() => {
            tourGetById()
        })
        .catch(error => console.error(error.status, error.message))
}