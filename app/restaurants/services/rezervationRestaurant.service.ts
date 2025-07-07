import { Reservation } from "../models/rezervacija.model";

export class ReservationService{
    private apiUrl: string
    private pagedDefault: string
    restoranId:number

    
    constructor(restoranId:number) {
        this.restoranId = restoranId
        this.apiUrl = `http://localhost:48696/api/restaurantReservetion`;
        this.pagedDefault = "";
    }

    getAll(): Promise<Reservation[]> {
            return fetch(this.apiUrl + this.pagedDefault)
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(errorMessage => {
                            throw { status: response.status, message: errorMessage }
                        })
                    }
                    return response.json()
                })
                .then((responseData) => {
                    return responseData.data as Reservation[];
                })
                .catch(error => {
                    console.error('Error', error.status)
                    throw error
                });
        }

    Post(formData: Reservation): Promise<Reservation> {
        const url = `${this.apiUrl}/${this.restoranId}`
        return fetch(url,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        .then(async (response) => {
            if (!response.ok) {
                const errorText = await response.text(); // Uhvati tekst greške sa servera
                alert(`${errorText}`); // Prikaz greške korisniku
                throw { status: response.status, message: errorText }; // Baci grešku za dalje rukovanje
            }
                return response.json();
            })
            .then((createdReservation: Reservation) => {
                return createdReservation;
            })
            .catch(error => {
                console.error('Error:', error.status);
                throw error;
            });
    }


    Delete(reservationId: number): Promise<void> {
        const url = `${this.apiUrl}/${reservationId}`;
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