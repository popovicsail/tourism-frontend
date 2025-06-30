import { Restaurant } from '../../models/restaurant.model.js';
import { RestaurantService } from '../../services/restaurants.service.js'
import { handleLogout } from "../../../users/pages/login/login.js";
let logoutButton

const restoranService = new RestaurantService();

const submitBtn = document.querySelector("#Dodaj")
submitBtn.addEventListener("click", function() {
    const formData: Restaurant = {
        name: (document.getElementById("name") as HTMLInputElement).value,
        description: (document.getElementById("description") as HTMLInputElement).value,
        capacity: parseInt((document.getElementById("capacity") as HTMLInputElement).value) || 0, // Convert to number
        imageUrl: (document.getElementById("image") as HTMLInputElement).value,
        latitude: parseFloat((document.getElementById("Latitude") as HTMLInputElement).value) || 0, // Convert to number
        longitude: parseFloat((document.getElementById("Longitude") as HTMLInputElement).value) || 0, // Convert to number
        status: (document.getElementById("Status") as HTMLInputElement).value,
        ownerID: parseInt(localStorage.getItem('id')),
    };
  restoranService.Post(formData);
  window.location.href = "../../restaurants.html";
})

const cancelBtn = document.querySelector("#cancel")
cancelBtn.addEventListener("click",function() {
    window.location.href = "../../restaurants.html";
})

document.addEventListener('DOMContentLoaded', () => {
            logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
            logoutButton.addEventListener('click', handleLogout)
});