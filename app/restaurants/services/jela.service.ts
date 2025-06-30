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