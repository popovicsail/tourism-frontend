export interface Tour {
    id?: number;
    name: string;
    description: string;
    dateTime: string;
    maxGuests: number;
    status: string;
    //guide: Guide; Ovo treba implementirati kasnije
    guideId: number;
    //keyPoints: number[];
}