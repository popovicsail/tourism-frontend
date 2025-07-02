import { handleLogout } from "./users/pages/login/login.js"
const loginButton = document.getElementById('login-button') as HTMLElement;
const logoutButton = document.getElementById('logout-button') as HTMLElement;
const restaurantsLinkElement = document.getElementById('restaurants-link') as HTMLAnchorElement;
const toursOverviewLinkElement = document.getElementById('toursOverview-link') as HTMLElement;

function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        setUserLoginState(true);
    } else {
        setUserLoginState(false);
    }
}

function checkUserRole() {
    const role = localStorage.getItem('role');
    console.log('Uloga iz localStorage:', role);
    
    if (role?.trim().toLowerCase() === 'turista') {
        restaurantsLinkElement.setAttribute('href', 'restaurants/pages/restaurantsUserEndView/restaurantsUserEndView.html');
    }

    console.log('Trenutni href:', restaurantsLinkElement.getAttribute('href'));
}

function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginButton.style.display = "none"
        logoutButton.style.display = "flex"
        logoutButton.addEventListener('click', handleLogout)
        restaurantsLinkElement.style.display = "flex"
        toursOverviewLinkElement.style.display = "flex"

        checkUserRole();
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

