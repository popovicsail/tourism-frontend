import { UserService } from "../../service/user.services.js"; // prilagodi putanju

const form = document.getElementById("register-form") as HTMLFormElement;
const usernameInput = form.username as HTMLInputElement;
const passwordInput = form.password as HTMLInputElement;
const confirmInput = form.confirmPassword as HTMLInputElement;
const roleSelect = document.getElementById ('select-role') as HTMLSelectElement;
const roleDesc = document.getElementById("role-description")!;
const submitBtn = form.querySelector("button")!;
const feedback = document.getElementById("form-feedback")!;
const userService = new UserService;

const roleMap: Record<string, string> = {
  turista: "Može rezervisati ture i ostavljati komentare.",
  vodic: "Može kreirati i upravljati turama.",
  vlasnik: "Može dodavati vodiče i upravljati objektima."
};

roleSelect.addEventListener("change", () => {
  roleDesc.textContent = roleMap[roleSelect.value] || "";
});

document.addEventListener('DOMContentLoaded', () => {

  
    const validateForm = () => {
      const isValid =
        usernameInput.value.trim().length > 2 &&
        passwordInput.value.length >= 8 &&
        passwordInput.value === confirmInput.value &&
        roleSelect.value !== "";
  
      if (!isValid) {
        submitBtn.disabled = true;
        submitBtn.style.background = "red";
        feedback.textContent = "Molimo vas da ispravno popunite sva polja.";
        feedback.style.color = "red";
      } else {
        submitBtn.disabled = false;
        submitBtn.style.background = ""; // vraća na default
        feedback.textContent = "Podaci su validni. Možete nastaviti.";
        feedback.style.color = "green";
      }
    };
  
    // Provera odmah po učitavanju
    validateForm();
  
    // Provera pri svakom unosu
    form.addEventListener("input", validateForm);
  });
  

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    username: form.username.value.trim(),
    password: passwordInput.value,
    role: roleSelect.value
  };

  try {
    await userService.createUser(user);
    alert("Uspešna registracija!");
    window.location.href = "index.html"; // 👈 Preusmerenje
  } catch (error) {
    const err = error as { message?: string };
    alert(`Greška: ${err.message || "Nešto nije u redu."}`);
    console.error("Create error:", err);
  } 
});
