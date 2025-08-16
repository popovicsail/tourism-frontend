import { UserService } from "../../service/user.services.js";
import { User } from "../../model/user.model.js";

const userId = localStorage.getItem('id') ?? 'N/A';
const userName = localStorage.getItem('username') ?? 'N/A';
const userPass = localStorage.getItem('password')
const userRole = localStorage.getItem('role') ?? 'Nedefinisano';
const usernameInput = document.getElementById('edit-username') as HTMLInputElement;
const passwordInput = document.getElementById('edit-password') as HTMLInputElement;
const roleInput = document.getElementById ('edit-role') as HTMLSelectElement;
const roleSelect = document.getElementById('edit-role') as HTMLSelectElement;
const saveButton = document.getElementById('save') as HTMLButtonElement;
const userService = new UserService;


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
    roleSelect.value = userRole;
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


saveButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const updatedUser: User = {
    id: parseInt(userId),
    username: usernameInput.value.trim(),
    password: passwordInput.value.trim(),
    role: roleInput.value
  };

  try {
    await userService.updateUser(updatedUser);
    alert('Podaci su uspešno sačuvani.');

    localStorage.setItem('username', usernameInput.value);
    localStorage.setItem('password', passwordInput.value);
    localStorage.setItem('role', roleInput.value);
  } catch (err) {
    alert(`Greška pri ažuriranju: ${err.message || 'Nepoznata greška'}`);
  }
});




  