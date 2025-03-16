import { request, APIRequestContext } from '@playwright/test';
import { TestUsers } from '../test-data/test-data.config';

export class APIHelper {
    private context: APIRequestContext;

    constructor(context: APIRequestContext) {
        this.context = context;
    }

    static async create(): Promise<APIHelper> {
        const context = await request.newContext({
            baseURL: 'https://www.saucedemo.com',
            extraHTTPHeaders: {
                'Accept': 'application/json'
            }
        });
        return new APIHelper(context);
    }

    async login(username = TestUsers.standardUser.username, password = TestUsers.standardUser.password) {
        const response = await this.context.post('/login', {
            data: {
                username,
                password
            }
        });
        return response;
    }

    async addToCart(productId: string) {
        const response = await this.context.post(`/cart/${productId}`, {});
        return response;
    }

    async removeFromCart(productId: string) {
        const response = await this.context.delete(`/cart/${productId}`);
        return response;
    }

    async getCart() {
        const response = await this.context.get('/cart');
        return response;
    }

    async clearCart() {
        const response = await this.context.delete('/cart');
        return response;
    }
} 