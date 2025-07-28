import { Jelo } from "../../models/jela.model.js";
import { JelaService } from "../../services/jela.service.js";
const url = window.location.search;
const searchParams = new URLSearchParams(url);
const restoranId = parseInt(searchParams.get('id'));


const jelaService = new JelaService(restoranId);

function ispisiJela(niz: Jelo[]): void {
    const tabela = document.querySelector('#korisniciBody') as HTMLTableElement;
    tabela.innerHTML = '';
  
    niz.forEach(jelo => {
      const noviRed = tabela.insertRow();
      const idCell = noviRed.insertCell();
      idCell.textContent = jelo.id.toString();
  
      const orderCell = noviRed.insertCell();
      const orderInput = document.createElement('input');
      orderInput.type = 'number';
      orderInput.value = jelo.order.toString();
      orderCell.appendChild(orderInput);
  
      const nameCell = noviRed.insertCell();
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = jelo.name;
      nameCell.appendChild(nameInput);
  
      const priceCell = noviRed.insertCell();
      const priceInput = document.createElement('input');
      priceInput.type = 'number';
      priceInput.step = '0.01';
      priceInput.value = jelo.price.toString();
      priceCell.appendChild(priceInput);
  
      const ingredientsCell = noviRed.insertCell();
      const ingredientsInput = document.createElement('input');
      ingredientsInput.type = 'text';
      ingredientsInput.value = jelo.ingredients;
      ingredientsInput.style.width = '300px'
      ingredientsCell.appendChild(ingredientsInput);
  
      const statusCell = noviRed.insertCell();
      const statusSelect = document.createElement('select');
      
      // Opcije koje želiš da prikažeš
      const statusOptions = ['U ponudi', 'Nema na stanju']; // ili jelo.status lista ako dinamički dolazi
      
      statusOptions.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.text = optionText;
        if (optionText === jelo.status) {
          option.selected = true; // automatski selektuj trenutno stanje
        }

        statusSelect.style.border = '1px solid #00b7ff';
        statusSelect.style.borderRadius = '20px'
        statusSelect.appendChild(option);
      });
      
      // Stilizacija ako ti treba fiksna širina i fleksibilni prikaz
      statusSelect.style.width = '150px';
      statusSelect.style.display = 'block'; // da ne izlazi van ćelije
      
      statusCell.appendChild(statusSelect);
  
      const imageUrlCell = noviRed.insertCell();
      const imageUrlInput = document.createElement('input');
      imageUrlInput.type = 'text';
      imageUrlInput.value = jelo.imageUrl;
      imageUrlCell.appendChild(imageUrlInput);
  
      const izbrisiCell = noviRed.insertCell();
      const izbrisiBtn = document.createElement('button');
      izbrisiBtn.textContent = 'Izbrisi';
      Object.assign(izbrisiBtn.style, {
        width: '190px',
        height: '50px',
        borderRadius: '5px',
        backgroundColor: '#0056b3'
      });
      izbrisiCell.appendChild(izbrisiBtn);
  
      izbrisiBtn.addEventListener('click', () => {
        const red = izbrisiBtn.closest('tr')!;
        const id = parseInt(red.cells[0].textContent!);
  
        jelaService.Delete(id)
        window.location.reload();
      });
    });

    const updateRow = tabela.insertRow();
    const updateCell = updateRow.insertCell();

    // Postavi širinu ćelije da obuhvati sve kolone (npr. ako ih ima 8)
    updateCell.colSpan = 8;
    updateCell.style.textAlign = 'center';

    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update';
    Object.assign(updateBtn.style, {
    width: '250px',
    height: '60px',
    fontSize: '18px',
    borderRadius: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
    });

    const dodajBtn = document.createElement('button');
    dodajBtn.textContent = 'Dodaj Jelo';
    Object.assign(dodajBtn.style, {
    width: '250px',
    height: '60px',
    margin: '20px',
    fontSize: '18px',
    borderRadius: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
    });

    dodajBtn.addEventListener('click', () =>{
        window.location.href =`../restaurantsJelaCreate/restaurantsJelaCreate.html?id=${restoranId}`
    })

    updateBtn.addEventListener('click', () => {
        const svaJela = prikupiIzTabele();

        jelaService.ReplaceMenu(svaJela)
        .then(() => alert('Jelovnik uspešno ažuriran!'))
        .catch(err => alert(`Greška: ${err.message}`));
    })

    updateCell.appendChild(updateBtn);
    updateCell.appendChild(dodajBtn);
}

function prikupiIzTabele(): Jelo[] {
    const rows = document.querySelectorAll('#korisniciBody tr');
    const jela: Jelo[] = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 7) {
            console.warn('Red nema dovoljno ćelija:', row);
            return;
        }

        const getInputValue = (cell: Element): string =>
            (cell.querySelector('input') as HTMLInputElement)?.value || '';

        const getSelectValue = (cell: Element): string =>
            (cell.querySelector('select') as HTMLSelectElement)?.value || '';

        const jelo: Jelo = {
            id: parseInt(cells[0]?.textContent || '0'),
            order: parseInt(getInputValue(cells[1])),
            name: getInputValue(cells[2]),
            price: parseFloat(getInputValue(cells[3])),
            ingredients: getInputValue(cells[4]),
            status: getSelectValue(cells[5]),
            imageUrl: getInputValue(cells[6]),
            restaurantId: jelaService.restoranId
        };

        // Provera da li je jelo validno — npr. ID i ime ne smeju biti prazni
        if (!isNaN(jelo.id) && jelo.name.trim() !== '') {
            jela.push(jelo);
        } else {
            console.warn('Preskočeno jelo zbog loših podataka:', jelo);
        }
    });

    return jela;
}


document.addEventListener('DOMContentLoaded', () => {
jelaService.Get().then((jela: Jelo[]) => {
    ispisiJela(jela);
});
})
  