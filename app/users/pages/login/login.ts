import { UserService } from "../../service/user.services.js";
const userService = new UserService();
let submitButton

function handleLogin(event: Event) {
    event.preventDefault();

    const form = document.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    userService.login(username, password)
        .then((user) => {
            localStorage.setItem('guideId', String(user.id));
            localStorage.setItem('username', user.username);
            localStorage.setItem('role', user.role);
            localStorage.setItem('password', password);
            window.location.href = "../../../index.html";
        })
        .catch((error) => {
            console.error('Login failed', error.message);
        });
}

export function handleLogout() {
    localStorage.removeItem('guideId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('password');
    window.location.href = "../../../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    submitButton = document.getElementById("submitButton") as HTMLButtonElement;
    submitButton.addEventListener("click", handleLogin)
})