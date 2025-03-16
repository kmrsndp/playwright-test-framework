export interface User {
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    postalCode?: string;
}

export interface CustomerData {
    firstName: string;
    lastName: string;
    postalCode: string;
}

export interface TestUser extends User {
    firstName: string;
    lastName: string;
    postalCode: string;
} 