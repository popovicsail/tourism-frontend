import {Tour} from "./tour.model"

export interface tourGetAllDTO {
    data: Tour[];
    totalCount: number;
}