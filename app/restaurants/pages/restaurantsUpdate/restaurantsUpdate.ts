import { Restaurant } from '../../models/restaurant.model.js';
import { RestaurantService } from '../../services/restaurants.service.js'

const url = window.location.search;
const searchParams = new URLSearchParams(url)
const restoranId = parseInt(searchParams.get('id'))
const restoranService = new RestaurantService();
const nameIzmena = (document.getElementById("name") as HTMLInputElement)
const descriptionIzmena = (document.getElementById("description") as HTMLInputElement)
const capacityIzmena = ((document.getElementById("capacity") as HTMLInputElement))
const imageUrlIzmena = (document.getElementById("image") as HTMLInputElement)
const latitude = ((document.getElementById("Latitude") as HTMLInputElement))
const longitude = ((document.getElementById("Longitude") as HTMLInputElement))
const status = (document.getElementById("Status") as HTMLInputElement)

function getById(id) {
    restoranService.getById(id)
    .then((restaurant:Restaurant) => {
        nameIzmena.value = restaurant.name
        descriptionIzmena.value = restaurant.description
        capacityIzmena.value = restaurant.capacity.toString()
        imageUrlIzmena.value = restaurant.imageUrl
        latitude.value = restaurant.latitude.toString()
        longitude.value = restaurant.longitude.toString()
        status.value = restaurant.status;
    })
    .catch ((error) => {
        console.error(error.status, error.message)
    })
}

const cancelBtn = document.querySelector("#cancel")
cancelBtn.addEventListener("click",function() {
    window.location.href = "../../../index.html";
})

const submitBtn = document.querySelector("#Dodaj")
submitBtn.addEventListener("click", function() {
    const formData: Restaurant = {
        name: nameIzmena.value,
        description: descriptionIzmena.value,
        capacity: parseInt(capacityIzmena.value),
        imageUrl: imageUrlIzmena.value,
        latitude: parseFloat(latitude.value),
        longitude: parseFloat(longitude.value),
        status: status.value,
        ownerID: parseInt(localStorage.getItem('id')),
    };
  restoranService.update(restoranId,formData);
  window.location.href = "../../../index.html";
})


document.addEventListener('DOMContentLoaded', () => {
    getById(restoranId)
});