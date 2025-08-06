import { ReservationService } from "../../../restaurants/services/rezervationRestaurant.service.js";
import { Reservation } from "../../../restaurants/models/rezervacija.model.js";

const userId = localStorage.getItem('id') ?? 'N/A';
const userName = localStorage.getItem('username') ?? 'N/A';
const userPass = localStorage.getItem('password')
const userRole = localStorage.getItem('role') ?? 'Nedefinisano';
const reservationService = new ReservationService;
let reservations


async function fetchAndRenderReservations(userId: number) {
    try {
      reservations = await reservationService.getAll(userId);
    } catch (error) {
      console.error("Greška prilikom povlačenja rezervacija:", error.message);
    }
}
function renderUserProfile() {  
    document.getElementById('user-id')!.textContent = userId;
    document.getElementById('user-username')!.textContent = userName;
    document.getElementById('user-role')!.textContent = userRole;
    
}

function renderEditForm(){
    const form = document.getElementById('edit-user-form')!;
    form.style.display = 'flex';
  
    // Prepopuni ako imaš user objekat
    (document.getElementById('edit-username') as HTMLInputElement).value = userName;
    (document.getElementById('edit-password') as HTMLInputElement).value = userPass;
}
function renderRestaurantTable(data: Reservation[]) {
    const tbody = document.querySelector('#restaurant-table tbody')!;
    tbody.innerHTML = ''; // očisti prethodne redove
  
    data.forEach((r) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.restaurantId}</td>
        <td>${new Date(r.date).toLocaleDateString()}</td>
        <td>${r.meal}</td>
        <td>${r.numberOfPeople}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  

function renderActivityDetails(type: 'restoran' | 'tura', data: Reservation | any) {
  const detailsBox = document.getElementById('activity-details')!;
  detailsBox.style.display = 'block';

  if (type === 'restoran') {
    detailsBox.innerHTML = `
      <h4>Detalji rezervacije</h4>
      <p><strong>Restoran ID:</strong> ${data.restaurantId}</p>
      <p><strong>Datum:</strong> ${new Date(data.date).toLocaleString()}</p>
      <p><strong>Obrok:</strong> ${data.meal}</p>
      <p><strong>Broj osoba:</strong> ${data.numberOfPeople}</p>
    `;
  }
  
    if (type === 'tura') {
      detailsBox.innerHTML = `
        <h4>Detalji ture</h4>
        <p><strong>Tura:</strong> ${data.tura}</p>
        <p><strong>Datum:</strong> ${new Date(data.datum).toLocaleString()}</p>
        <p><strong>Lokacija:</strong> ${data.lokacija}</p>
        <p><strong>Opis:</strong> ${data.detalji}</p>
      `;
    }
  }

  function showActivityTable(type: 'restoran' | 'tura') {
    const restaurantTable = document.getElementById('restaurant-table')!;
    const tourTable = document.getElementById('tour-table')!;
    const detailsBox = document.getElementById('activity-details')!;
    detailsBox.innerHTML = ''; // resetuj detalje
  
    if (type === 'restoran') {
      restaurantTable.style.display = 'table';
      tourTable.style.display = 'none';
    } else {
      restaurantTable.style.display = 'none';
      tourTable.style.display = 'table';
    }
  }

  

document.querySelectorAll('.sidebar li').forEach((li) => {
    li.addEventListener('click', () => {
      document.querySelectorAll('.sidebar li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
  
      const tabId = li.textContent?.toLowerCase().replace(/\s+/g, '-');
      document.querySelectorAll('.content section').forEach(sec => sec.classList.remove('active'));
      const target = document.getElementById(`${tabId}-view`) || document.getElementById(`${tabId}-form`);
      if (target) target.classList.add('active');
    });
});


document.getElementById('profile-link')?.addEventListener('click', () => {
renderUserProfile();
});

document.getElementById('edit-user-tab')!.addEventListener('click', () => {
renderEditForm();
});

document.getElementById('btn-restorani')!.addEventListener('click', () => {
showActivityTable('restoran');
renderRestaurantTable(reservations)
});
  
document.getElementById('btn-ture')!.addEventListener('click', () => {
showActivityTable('tura');
});

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderReservations(parseInt(userId))
})


  