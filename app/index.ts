import { handleLogout } from "./users/pages/login/login.js"
const loginButton = document.getElementById('login-button') as HTMLElement;
const logoutButton = document.getElementById('logout-button') as HTMLElement;
const restaurantsLinkElement = document.getElementById('restaurants-link') as HTMLElement;
const toursOverviewLinkElement = document.getElementById('toursOverview-link') as HTMLElement;

function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        setUserLoginState(true);
    } else {
        setUserLoginState(false);
    }
}

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginButton.style.display = "none"
        logoutButton.style.display = "flex"
        logoutButton.addEventListener('click', handleLogout)
        restaurantsLinkElement.style.display = "flex"
        toursOverviewLinkElement.style.display = "flex"
    } else {
        loginButton.style.display = "flex"
        logoutButton.style.display = "none"
        restaurantsLinkElement.style.display = "none"
        toursOverviewLinkElement.style.display = "none"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    logoutButton.addEventListener('click', handleLogout)
    checkLoginStatus();
})

