import { Jelo } from "../models/jela.model";

export class JelaService{
    private apiUrl: string
    private pagedDefault: string
    restoranId:number

    
    constructor(restoranId:number) {
        this.restoranId = restoranId
        this.apiUrl = `http://localhost:48696/api/restaurants/${restoranId}/meals`;
        this.pagedDefault = "";
    }

    ReplaceMenu(noviJelovnik: Jelo[]): Promise<void> {
        const url = this.apiUrl;
      
        return fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noviJelovnik)
        })
          .then(response => {
            if (!response.ok) {
              return response.text().then(errorMessage => {
                throw { status: response.status, message: errorMessage };
              });
            }
          })
          .catch(error => {
            console.error('Greška pri ReplaceMenu:', error.message ?? error.status);
            throw error;
          });
      }    

    Get(): Promise<Jelo[]> {
        const url = `${this.apiUrl}`;
        
        return fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => {
            if (!response.ok) {
              return response.text().then(errorMessage => {
                throw { status: response.status, message: errorMessage };
              });
            }
            return response.json()
          })
          .then((responseData) => {
            return responseData as Jelo[];
            })
          .catch(error => {
            console.error('Greška pri GET pozivu:', error.message ?? error.status);
            throw error;
          });
      }
      

    Post(formData: Jelo): Promise<Jelo> {
        const url = this.apiUrl;
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage };
                    });
                }
                return response.json();
            })
            .then((createdMeal: Jelo) => {
                return createdMeal;
            })
            .catch(error => {
                console.error('Error:', error.status);
                throw error;
            });
    }


    Delete(mealId: number): Promise<void> {
        const url = `${this.apiUrl}/${mealId}`; // Dinamički zamenjujemo ID restorana i ID jela
        return fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.status === 204) {
                // Uspešno obrisano, ništa ne vraća — sve u redu
                return;
            }
        
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    throw { status: response.status, message: errorMessage };
                });
            }
        })
        .catch(error => {
            console.error('Error:', error.status);
            throw error;
        });
    }
}