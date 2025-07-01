import { Restaurant } from "./models/restaurant.model.js";
import { RestaurantService } from "./services/restaurants.service.js";
import { handleLogout } from "../users/pages/login/login.js";

const restoranService = new RestaurantService();
const dodajBtn = document.querySelector("#Dodaj") as HTMLElement
let logoutButton


function ispisiRestorane(){
    const tabela = document.querySelector('#usersBody') as HTMLTableElement
    
    if (!tabela) {
        console.error('Tabela sa ID-jem "usersBody" nije pronađena.');
        return;
    }
    
    tabela.innerHTML = ''

    restoranService.getByOwner().then((response) => {
        const nizRestorana: Restaurant[] = response; {
         nizRestorana.forEach((restoran) => {
            const noviRed = tabela.insertRow()
    
            const idCell = noviRed.insertCell();
            idCell.textContent = restoran.id.toString();
    
            const nazivCell = noviRed.insertCell();
            nazivCell.textContent = restoran.name;
    
            const opisCell = noviRed.insertCell();
            opisCell.textContent = restoran.description;
    
            const capacityCell = noviRed.insertCell();
            capacityCell.textContent = restoran.capacity.toString();

            const slikaCell = noviRed.insertCell();
            const img = document.createElement("img");

            img.src = restoran.imageUrl;
            img.alt = restoran.name || "Slika restorana";
            img.width = 100;

            slikaCell.appendChild(img);

            const latitudeCell = noviRed.insertCell();
            latitudeCell.textContent = restoran.latitude.toString();

            const longitudeCell = noviRed.insertCell();
            longitudeCell.textContent = restoran.longitude.toString();

            const statusCell = noviRed.insertCell();
            statusCell.textContent = restoran.status;

            const izmeniCell = noviRed.insertCell();
            const izmeniBtn = document.createElement('button');
            izmeniBtn.textContent = 'Izmeni';

            izmeniBtn.addEventListener('click', () => {
                const red = izmeniBtn.closest('tr')!;
                const id = parseInt(red.cells[0].textContent!);
                window.location.href = `pages/restaurantsUpdate/restaurantsUpdate.html?id=${id}`;
            });

            izmeniCell.appendChild(izmeniBtn);

            const izbrisiCell = noviRed.insertCell();
            const izbrisiBtn = document.createElement('button');
            izbrisiBtn.textContent = 'Izbrisi';
            izbrisiCell.appendChild(izbrisiBtn);

            izbrisiBtn.addEventListener('click', () => {
                const confirmation = confirm("Da li ste sigurni da želite da izbrišete restoran?");

                if (confirmation) {
                            const red = izbrisiBtn.closest('tr')!;
                            const id = parseInt(red.cells[0].textContent!);
                            restoranService.deleteUser(id)
                            alert("Restoran je uspešno izbrisan.");
                            window.location.href = '../index.html';

         }});
            
         });
     }}).catch((error) => {
         console.error('Greška prilikom učitavanja restorana:', error);
     });
}

dodajBtn.addEventListener('click', () => {
    window.location.href = "pages/restaurantsCreate/restaurantsCreate.html"; 
  });

document.addEventListener('DOMContentLoaded', ispisiRestorane);

document.addEventListener("DOMContentLoaded", () => {
        logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;
        logoutButton.addEventListener('click', handleLogout)
})
