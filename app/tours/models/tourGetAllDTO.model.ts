import {Tour} from "./tour.model"

export interface TourGetAllDTO {
    data: Tour[];
    totalCount: number;
}