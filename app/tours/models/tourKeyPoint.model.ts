import { TourKeyPointFlags } from "./tourKeyPointFlags.model.js"

export interface TourKeyPoint {
    id?: number;
    order?: number;
    name: string;
    description: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    tourId: number;
    flags?: TourKeyPointFlags;
}