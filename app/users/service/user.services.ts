import { User } from "../model/user.model";
import { TourRating } from "../../tours/models/tourRating.model";
import { TourReservation } from "../../tours/models/tourReservation.model";

export class UserService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = 'http://localhost:48696/api/users';
    }

    login(username: string, password: string): Promise<User> {
        const url = `${this.apiUrl}/login`;

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password})
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then((user: User) => {
            return user;
        })
        .catch(error => {
            console.error('Login error:', error.message);
            throw error;
        });
    }

        getTourReservationsByUserId(userId: number): Promise<TourReservation[]> {
            return fetch(this.apiUrl + `/${userId}/tour-reservations`)
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(errorMessage => {
                            throw { status: response.status, message: errorMessage }
                        })
                    }
                    return response.json()
                })
                .then((responseData) => {
                    return responseData as TourReservation[];
                })
                .catch(error => {
                    console.error('Error', error.status)
                    throw error
                });
        }
    
        getTourRatingsByUserId(userId: number): Promise<TourRating[]> {
            return fetch(this.apiUrl + `/${userId}/tour-ratings`)
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

        updateUser(user: User): Promise<void> {
            const url = `${this.apiUrl}/${user.id}`;
        
            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage };
                    });
                }
            })
            .catch(error => {
                console.error('Update error:', error.message || error);
                throw error;
            });
        }

        createUser(user: User): Promise<void> {
            const url = this.apiUrl;
        
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        throw { status: response.status, message: errorMessage };
                    });
                }
            })
            .catch(error => {
                console.error('Create error:', error.message || error);
                throw error;
            });
        }
        
        
}