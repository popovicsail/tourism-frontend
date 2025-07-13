import { Jelo } from "./jela.model.js";
import { Review } from "./review.model.js";

export interface Restaurant {
id?:number
name:string
description:string
capacity:number
imageUrl:string
latitude:number
longitude:number
averageRating?:number
status:string
ownerID:number
jela?: Jelo[];
reviews?: Review[];
}