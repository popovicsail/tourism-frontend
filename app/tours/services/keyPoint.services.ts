import { KeyPoint } from "../models/keyPoint.model.js"
import { Tour } from "../models/tour.model.js"

export class KeyPointServices {
    private apiUrl: string

    constructor(tourId) {
        this.apiUrl = `http://localhost:48696/api/tours/${tourId}/key-points`
    }

    add(keyPointData: KeyPoint): Promise<KeyPoint> {
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
            .then((keyPoint: KeyPoint) => {
                return keyPoint;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

    update(keyPointData: KeyPoint): Promise<Tour> {
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
        return fetch(this.apiUrl + '/' + keyPointId, {
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