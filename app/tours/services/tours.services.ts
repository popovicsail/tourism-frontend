import { Tour } from "../models/tour.model.js"

export class ToursServices {
    private apiUrl: string
    private pagedDefault: string

    constructor() {
        this.apiUrl = "http://localhost:48696/api/tours"
        this.pagedDefault = ""
    }

    getAll(): Promise<Tour[]> {
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
                return responseData.data as Tour[];
            })
            .catch(error => {
                console.error('Error', error.status)
                throw error
            });
    }

    getByTourId(tourId:number): Promise<Tour> {
        return fetch(this.apiUrl + `/${tourId}` + this.pagedDefault)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((responseData) => {
                return responseData as Tour;
            })
            .catch(error => {
                console.error('Error', error.status)
                throw error
            });
    }

    getByGuideId(guideId: number): Promise<Tour[]> {
        return fetch(this.apiUrl + `?guideId=${guideId}` + this.pagedDefault)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((responseData) => {
                return responseData as Tour[];
            })
            .catch(error => {
                console.error('Error', error.status)
                throw error
            });
    }

    add(formData: Tour): Promise<Tour> {
        return fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
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

    update(tourId:number, formData: Tour): Promise<Tour> {
        return fetch(this.apiUrl + `/${tourId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
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

    delete(tourId:number): Promise<void> {
        return fetch(this.apiUrl + `/${tourId}`, {
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
                alert('ERROR: Tour deletion unsuccessful');
                throw error;
            });
    }
}