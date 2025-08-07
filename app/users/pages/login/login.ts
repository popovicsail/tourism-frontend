import { UserService } from "../../service/user.services.js";
const userService = new UserService();
let submitButton: HTMLButtonElement;
document.addEventListener("DOMContentLoaded", () => {
    submitButton = document.getElementById("submit-button") as HTMLButtonElement;
    submitButton.addEventListener("click", (event) => {
        handleLogin(event)
    })
})

function handleLogin(event: Event) {
    event.preventDefault();

    const form = document.getElementById("login-form") as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    userService.login(username, password)
        .then((user) => {
            localStorage.setItem('id', String(user.id));
            localStorage.setItem('username', user.username);
            localStorage.setItem('role', user.role);
            localStorage.setItem('password', password);
            localStorage.setItem('reservations', JSON.stringify(user.reservations))
            window.location.href = "../../../index.html";
        })
        .catch((error) => {
            console.error('Login failed', error.message);
        });
}

export function handlePermission() {
    const role = localStorage.getItem("role")
    const loginButton = document.getElementById('login-button') as HTMLElement;
    const logoutButton = document.getElementById('logout-button') as HTMLElement;

    if (!role) {
        loginButton.style.display = "flex"
        logoutButton.style.display = "none"
        return;
    }

    if (role == "turista") {
        const accControlPanel = document.getElementById("accControlPanel") as HTMLLIElement
        accControlPanel.style.display = "flex"
        const toursLookupLink = document.getElementById("tours-lookup-link") as HTMLLIElement
        toursLookupLink.style.display = "flex"
        const restaurantsEndView = document.getElementById("restaurants-end-view") as HTMLLIElement
        restaurantsEndView.style.display = "flex"
        const reservationsEndView = document.getElementById("reservation-lookup-link") as HTMLLIElement
        reservationsEndView.style.display = "flex"
        const registerBtn = document.getElementById('register-button') as HTMLLIElement
        registerBtn.style.display = 'none'
    }
    else if (role == "vodic") {
        const toursOverviewLink = document.getElementById("toursOverview-link") as HTMLLIElement
        toursOverviewLink.style.display = "flex"
        const accControlPanel = document.getElementById("accControlPanel") as HTMLLIElement
        accControlPanel.style.display = "flex"
        const registerBtn = document.getElementById('register-button') as HTMLLIElement
        registerBtn.style.display = 'none'
    }
    else if (role == "vlasnik") {
        const toursRestaurantsLink = document.getElementById("restaurants-link") as HTMLLIElement
        const statisticsLink = document.getElementById("statistics-restaurant") as HTMLLIElement
        toursRestaurantsLink.style.display = "flex"
        statisticsLink.style.display = "flex"
        const accControlPanel = document.getElementById("accControlPanel") as HTMLLIElement
        accControlPanel.style.display = "flex"
        const registerBtn = document.getElementById('register-button') as HTMLLIElement
        registerBtn.style.display = 'none'
    }

    loginButton.style.display = "none"
    logoutButton.style.display = "flex"
    logoutButton.addEventListener("click", () => handleLogout())
}   


export function handleLogout() {
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('password');
    localStorage.removeItem('reservations');
    window.location.href = "../../../index.html";
}