import { Jelo } from "../../models/jela.model.js";
import { JelaService } from "../../services/jela.service.js";
import { RestaurantUtils } from '../../utils/restaurants.utils.js'

const url = window.location.search;
const searchParams = new URLSearchParams(url);
const restoranIdUpdate = parseInt(searchParams.get('id'));
const restoranUtils = new RestaurantUtils();
const jelaService = new JelaService(restoranIdUpdate);
const orderCreate = document.querySelector('#order') as HTMLInputElement;
const nameCreate = document.querySelector('#name') as HTMLInputElement;
const PriceCreate = document.querySelector('#Price') as HTMLInputElement;
const ingredientsCreate = document.querySelector('#ingredients') as HTMLInputElement;
const imageCreate = document.querySelector('#image') as HTMLInputElement;
const selectCreate = document.querySelector('#status') as HTMLInputElement;
const submitBtn = document.querySelector("#zavrsi") as HTMLButtonElement;
const cancelBtn = document.querySelector('#cancel') as HTMLButtonElement;




function restaurantFormInitialize(): void {
    orderCreate.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(orderCreate)
        validationRestaurantFormData()
    })

    nameCreate.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(nameCreate)
        validationRestaurantFormData()
    })

    PriceCreate.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(PriceCreate)
        validationRestaurantFormData()
    })

    ingredientsCreate.addEventListener("blur", () => {
        restoranUtils.validationSingleInput(ingredientsCreate)
        validationRestaurantFormData()
    })

    selectCreate.addEventListener('blur',() => {
        restoranUtils.validationSingleInput(selectCreate)
        validationRestaurantFormData()
    })


    cancelBtn.addEventListener("click",function() {
        window.location.href = `../menuUpdate/menuUpdate.html?id=${restoranIdUpdate}`;
    })

    submitBtn.addEventListener("click", () => {
        submitRestaurantFormData()
    });

    console.log('restaurantFormInitialize')
}



async function submitRestaurantFormData(){
    const formData: Jelo = {
        order: parseInt(orderCreate.value),
        name: nameCreate.value,
        price: parseInt(PriceCreate.value) || 0,
        ingredients: ingredientsCreate.value,
        imageUrl: imageCreate.value,
        status: selectCreate.value,
        restaurantId: restoranIdUpdate,
    };
    try {
        const createdMeal = await jelaService.Post(formData);
        const restaurantId = createdMeal.id;

        console.log(`Kreirano jelo sa ID: ${restaurantId}`);
        window.location.href = `../menuUpdate/menuUpdate.html?id=${restoranIdUpdate}`;
    } catch (error) {
        console.error("Greška prilikom kreiranja restorana:", error.message);
    }
}



function validationRestaurantFormData() {
    const orderCreateFlag = restoranUtils.validationFinal(orderCreate)
    const nameCreateFlag = restoranUtils.validationFinal(nameCreate)
    const PriceCreateFlag = restoranUtils.validationFinal(PriceCreate)
    const ingredientsCreateFlag = restoranUtils.validationFinal(ingredientsCreate)
    console.log('validationRestaurantFormData')


    if (!orderCreateFlag || !nameCreateFlag || !PriceCreateFlag || !ingredientsCreateFlag) {
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = "grey"
        return;
    }
    submitBtn.style.backgroundColor = "#007bff"
    submitBtn.disabled = false;
    return;
}



document.addEventListener("DOMContentLoaded", () => {
    restaurantFormInitialize();
})
