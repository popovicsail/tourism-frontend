import {Reservation} from "../models/reservation.model.js"

export class ReservationServices {
    private apiUrl: string

    constructor() {
        this.apiUrl = `http://localhost:48696/api/reservations`
    }

    add(reservationData: Reservation, reservationAmount:number): Promise<Reservation> {
        return fetch(this.apiUrl + `?reservationAmount=${reservationAmount}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((reservation: Reservation) => {
                return reservation;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    delete(tourId: number): Promise<void> {
        return fetch(this.apiUrl + `?tourId=${tourId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(message => {
                        throw new Error(`Greška ${response.status}: ${message}`);
                    });
                }
            })
            .catch(error => {
                console.error('Greška pri brisanju:', error.message);
                alert('ERROR: Key Point deletion unsuccessful');
                throw error;
            });
    }
}