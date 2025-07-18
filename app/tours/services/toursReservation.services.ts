import { TourReservation } from "../models/tourReservation.model.js"

export class ToursReservationServices {
    private apiUrl: string

    constructor() {
        this.apiUrl = `http://localhost:48696/api/tour-reservations`
    }

    add(reservationData: TourReservation, reservationAmount: number): Promise<TourReservation> {
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
            .then((reservation: TourReservation) => {
                return reservation;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    delete(reservationId: number): Promise<void> {
        return fetch(this.apiUrl + `?reservationId=${reservationId}`, {
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