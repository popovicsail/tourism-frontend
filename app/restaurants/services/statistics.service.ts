import {RestoranStatistics} from "../models/satistics.model.js"
//import {MonthlyOccupancy} from "../models/satistics.model.js"
import {MonthlyOccupancyStatistic} from "../models/satistics.model.js"


export class StatisticsService{
    private apiUrl: string;

    constructor() {
        this.apiUrl = `http://localhost:48696/api/restaurants/statistics`;
    }

    private idVlasnika: string = localStorage.getItem('id')

    GetTotalReservationsForYear(): Promise<RestoranStatistics[]>{
        return fetch(this.apiUrl + `/total-reservations?ownerId=${this.idVlasnika}`)
                    .then(response => {
                        if (!response.ok) {
                            return response.text().then(errorMessage => {
                                throw { status: response.status, message: errorMessage }
                            })
                        }
                        return response.json()
                    })
                    .then((responseData) => {
                        return responseData as RestoranStatistics[];
                    })
                    .catch(error => {
                        console.error('Error', error.status)
                        throw error
                    });
    }


    GetOccupancyByMonth(restoranId:number): Promise<MonthlyOccupancyStatistic>{
        return fetch(this.apiUrl + `/occupancy-by-month/${restoranId}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    throw { status: response.status, message: errorMessage }
                })
            }
            return response.json()
        })
        .then((responseData) => {
            return responseData as MonthlyOccupancyStatistic;
        })
        .catch(error => {
            console.error('Error', error.status)
            throw error
        });
    }
}