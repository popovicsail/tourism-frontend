import { Tour } from "../models/tour.model.js"
import { tourGetAllDTO } from "../models/tourGetAllDTO.model.js"
import { TourFilters } from "../models/tourFilters.model.js"

export class ToursServices {
    private apiUrl: string

    constructor() {
        this.apiUrl = "http://localhost:48696/api/tours"
    }

    getAll(filters:TourFilters): Promise<tourGetAllDTO> {
        const params = new URLSearchParams();

        if (filters) {
            if (filters.page !== undefined) {
                params.append("page", filters.page.toString())
            }
            if (filters.pageSize !== undefined) {
                params.append("pageSize", filters.pageSize.toString())
            }
            if (filters.orderBy) {
                params.append("orderBy", filters.orderBy)
            }
            if (filters.orderDirection) {
                params.append("orderDirection", filters.orderDirection)
            }
            if (filters.tourStatus) {
                params.append("tourStatus", filters.tourStatus)
            }
        }

        const url = this.apiUrl + (params.toString() ? "?" + params.toString() : "")

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((responseData) => {
                return responseData as tourGetAllDTO;
            })
            .catch(error => {
                console.error('Error', error.status)
                throw error
            });
    }

    getByTourId(tourId: number): Promise<Tour> {
        return fetch(this.apiUrl + `/${tourId}`)
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
        return fetch(this.apiUrl + `?guideId=${guideId}`)
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

    update(tourId: number, formData: Tour): Promise<Tour> {
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

    delete(tourId: number): Promise<void> {
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