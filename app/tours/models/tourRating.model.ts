export interface TourRating {
    id?:number,
    tourId:number;
    userId:number;
    ratingDate?:string;
    rating:number;
    comment?:string;
}