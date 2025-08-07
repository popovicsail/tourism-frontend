export interface User {
    id?: number;
    username: string;
    password: string;
    role: string;
    reservations?: number[];
}