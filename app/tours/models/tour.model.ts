import { KeyPoint } from "./keyPoint.model.js"
import { Guide } from "../../users/model/guide.model.js";

export interface Tour {
    id?: number;
    name: string;
    description: string;
    dateTime: string;
    maxGuests: number;
    status: string;
    guide?: Guide;
    guideId: number;
    keyPoints?: KeyPoint[];
}