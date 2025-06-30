import { Restaurant } from "../models/restaurant.model.js";

export class RestaurantService{
    private apiUrl: string
    private pagedDefault: string

    constructor() {
        this.apiUrl = 'http://localhost:48696/api/restaurants';
        this.pagedDefault = "";
    }

    private idVlasnika: string = localStorage.getItem('id')
    


    getAll(): Promise<Restaurant[]> {
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
                return responseData.data as Restaurant[];
            })
            .catch(error => {
                console.error('Error', error.status)
                throw error
            });
    }
    
    getById(restaurantId: number): Promise<Restaurant> {
        return fetch(this.apiUrl + '/' + restaurantId + this.pagedDefault)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage };
                    });
                }
                return response.json();
            })
            .then((responseData) => {
                console.log('Odgovor sa servera:', responseData);

                // Mapiranje odgovora sa servera na model Restaurant
                const restaurant: Restaurant = responseData as Restaurant;
                restaurant.jela = responseData.meals
                return restaurant;
            })
            .catch(error => {
                console.error('Error', error.status);
                throw error;
            });
    }

    Post(formData: Restaurant): Promise<Restaurant> {
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
            .then((restaurant: Restaurant) => {
                return restaurant;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }


    getByOwner(): Promise<Restaurant[]>{
        return fetch(this.apiUrl + `?ownerId=${this.idVlasnika}` + this.pagedDefault)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage }
                    })
                }
                return response.json()
            })
            .then((responseData) => {
                return responseData as Restaurant[];
            })
            .catch(error => {
                console.error('Error', error.status)
                throw error
            });
    }

    
    deleteUser(restaurantId:number): void {
        fetch(this.apiUrl +'/'+ restaurantId + this.pagedDefault, {
        method: 'DELETE'
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Request failed. Status: ' + response.status);
        }
        })
        .catch(error => {
        console.error('Error:', error.message);
        alert('Došlo je do greške pri brisanju korisnika.');
        });
    }



    update(restaurantId: number, formData: Restaurant): Promise<Restaurant> {
        return fetch(this.apiUrl + '/' + restaurantId, {
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
            .then((restaurant: Restaurant) => {
                return restaurant;
            })
            .catch(error => {
                console.error('Error:', error.status)
                throw error
            });
    }
}

