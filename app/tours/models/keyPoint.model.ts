import { KeyPointFlags } from "./keyPointFlags.model.js"

export interface KeyPoint {
    id?: number;
    order?: number;
    name: string;
    description: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    tourId: number;
    flags?: KeyPointFlags;
}