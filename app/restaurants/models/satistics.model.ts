export interface RestoranStatistics {
    restoranId:number
    restoranName:string
    totalBookings:number  
}

export interface MonthlyOccupancy{
    month:string
    occupancyRate:number
}

export interface MonthlyOccupancyStatistic{
    restaurantName:string
    monthlyOccupancy:MonthlyOccupancy[]
}