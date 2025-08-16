import { RestaurantService } from "./restaurants.service";
const restaurantService = new RestaurantService();
import * as L from "leaflet";



export class IndexService {

    constructor() {
    }


    async mapCreate() {

    const restaurants = await restaurantService.getAll();
    const mapContainer = document.getElementById('map');


    if (!mapContainer) {
    console.error("Element #map nije pronađen u DOM-u!");
    return;
    }
    
    const map = L.map('map').setView([44.8176, 20.4633], 12);  // Koordinate za Beograd
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    restaurants.forEach(r => {
        const marker = L.marker([r.latitude, r.longitude]).addTo(map);
        marker.bindPopup(`
        <div style="text-align:center">
            <h3>${r.name}</h3>
             <img src="${r.imageUrl}" alt="${r.name}" width="100" height="100"><br>
            <p>${r.description}</p>
            <a href="restaurants/pages/restaurantsUserEndDetails/restaurantsUserEndDetails.html?restoranId=${r.id}"
            class="btn" style="display:inline-block;padding:8px 12px;background:#c0392b;color:#fff;border-radius:6px;text-decoration:none;">
            Poseti stranicu
            </a>
        </div>
        `);
    });
    }

}