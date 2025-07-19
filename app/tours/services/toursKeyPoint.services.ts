import { TourKeyPoint } from "../models/tourKeyPoint.model.js"
import { Tour } from "../models/tour.model.js"

export class ToursKeyPointServices {
    private apiUrl: string

    constructor() {
        this.apiUrl = `http://localhost:48696/api/tour-key-points/`
    }

    add(keyPointData: TourKeyPoint): Promise<TourKeyPoint> {
        return fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(keyPointData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((keyPoint: TourKeyPoint) => {
                return keyPoint;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    update(keyPointData: TourKeyPoint): Promise<Tour> {
        return fetch(this.apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(keyPointData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((tour: Tour) => {
                return tour;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    delete(keyPointId: number): Promise<void> {
        return fetch(this.apiUrl + keyPointId, {
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
                alert('ERROR: Reservation deletion unsuccessful');
                throw error;
            });
    }
}