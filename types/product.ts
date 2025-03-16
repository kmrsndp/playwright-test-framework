export interface Product {
    name: string;
    price: string;
}

export interface CartItem extends Product {
    quantity: number;
} 