import { UserService } from "../../service/user.services.js"; // prilagodi putanju

const form = document.getElementById("register-form") as HTMLFormElement;
const passwordInput = form.password as HTMLInputElement;
const confirmInput = form.confirmPassword as HTMLInputElement;
const roleSelect = document.getElementById ('select-role') as HTMLSelectElement;
const roleDesc = document.getElementById("role-description")!;
const submitBtn = form.querySelector("button")!;
const userService = new UserService;

const roleMap: Record<string, string> = {
  turista: "Može rezervisati ture i ostavljati komentare.",
  vodic: "Može kreirati i upravljati turama.",
  vlasnik: "Može dodavati vodiče i upravljati objektima."
};

roleSelect.addEventListener("change", () => {
  roleDesc.textContent = roleMap[roleSelect.value] || "";
});

form.addEventListener("input", () => {
  const isValid =
    form.username.value.trim().length > 2 &&
    passwordInput.value.length >= 8 &&
    passwordInput.value === confirmInput.value &&
    roleSelect.value !== "";

  submitBtn.disabled = !isValid;
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
