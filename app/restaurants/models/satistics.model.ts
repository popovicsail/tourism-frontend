export interface RestoranStatistics {
    restoranId:number
    restoranName:string
    totalBookings:number  
}

export interface MonthlyOccupancy{
    Month:string
    OccupancyRate:number
}

export interface MonthlyOccupancyStatistic{
    RestaurantName:string
    MonthlyOccupancy:MonthlyOccupancy[]
}