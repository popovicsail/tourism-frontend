import { Review } from "../models/review.model.js";

export class ReviewService {
    private apiUrl: string

    constructor() {
        this.apiUrl = 'http://localhost:48696/api/restaurants/review';
    }

            getReviewById(reviewId: number): Promise<Review> {
                return fetch(`${this.apiUrl}/${reviewId}`)
                    .then(response => {
                        if (!response.ok) {
                            if (response.status === 404) {
                                console.warn('Recenzija nije pronađena.');
                                return null;
                            }
                            throw new Error(`Greška pri učitavanju recenzije: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then((data: Review) => {
                        return data as Review;
                    })
                    .catch(error => {
                        console.error('Greška prilikom povezivanja sa serverom:', error);
                        return null;
                    });
            }

            getReviewsByRestaurantId(restaurantId: number): Promise<Review[]> {
                return fetch(`${this.apiUrl}/${restaurantId}`)
                    .then(response => {
                        if (!response.ok) {
                            if (response.status === 404) {
                                console.warn("Nema recenzija za ovaj restoran.");
                                return []; // Vrati praznu listu ako nema rezultata
                            }
                            throw new Error(`Greška pri učitavanju recenzija: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then((data: Review[]) => {
                        return data as Review[];
                    })
                    .catch(error => {
                        console.error("Greška u komunikaciji sa serverom:", error);
                        return [];
                    });
            }

            deleteReview(reviewId: number): Promise<boolean> {
                return fetch(`/api/restaurants/review/${reviewId}`, {
                    method: "DELETE"
                })
                .then(response => {
                    if (response.status === 204) {
                        // Uspešno obrisano
                        return true;
                    }
                    if (response.status === 404) {
                        console.warn("Recenzija nije pronađena.");
                        return false;
                    }
                    throw new Error(`Greška pri brisanju recenzije: ${response.statusText}`);
                })
                .catch(error => {
                    console.error("Greška u komunikaciji sa serverom:", error.message);
                    return false;
                });
            }

            createReview(review: Review): Promise<Review> {
                return fetch(this.apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(review)
                })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 403) {
                            throw new Error("Ocena nije dozvoljena: možete oceniti restoran najranije sat vremena nakon rezervacije i najkasnije tri dana nakon posete.");
                        }
                        if (response.status === 400) {
                            throw new Error("Podaci o recenziji nisu validni.");
                        }
                        throw new Error(`Greška u zahtevu: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((created: Review) => {
                    return created as Review;
                })
                .catch(error => {
                    console.error("Greška pri kreiranju recenzije:", error.message);
                    return null;
                });
}}