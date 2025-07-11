import { TourRating } from "../models/tourRating.model.js"

export class TourRatingServices {
    private apiUrl: string

    constructor() {
        this.apiUrl = `http://localhost:48696/api/comments`
    }

    getAll(): Promise<TourRating> {
        return fetch(this.apiUrl)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((responseData) => {
                return responseData as TourRating;
            })
            .catch(error => {
                console.error('Error', error.status)
                throw error
            });
    }

    getById(id, idType): Promise<TourRating[]> {
        const params = new URLSearchParams();

        if (idType) {
            if (idType == "tourId") {
                params.append("idType", "tourId")
            }
            else if (idType =="userId") {
                params.append("idType", "userId")
            }
        }

        return fetch(this.apiUrl + `/${id}` + (params.toString() ? "?" + params.toString() : ""))
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((responseData) => {
                return responseData as TourRating[];
            })
            .catch(error => {
                console.error('Error', error.status)
                throw error
            });
    }

    add(tourRatingData: TourRating): Promise<TourRating> {
        return fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tourRatingData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((tourRatingData: TourRating) => {
                return tourRatingData;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }

}