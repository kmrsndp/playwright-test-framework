import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { log } from '../utils/logger';
import { TestUsers, CustomerInfo, ErrorMessages } from '../test-data';
import { type Product, type CartItem } from '../types/product';
import { type CustomerData } from '../types/user';

test.describe('Shopping Cart Workflows', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        log.info('Setting up test');
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        // Login before each test using TestUsers
        await loginPage.goto();
        await loginPage.login(TestUsers.standardUser.username, TestUsers.standardUser.password);
        await inventoryPage.waitForPageLoad();
    });

    test('complete purchase with multiple items and verify order total', async () => {
        const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
        const itemPrices: { [key: string]: number } = {};
        
        // Add items and store prices
        for (const item of items) {
            log.info(`Adding ${item} to cart`);
            await inventoryPage.addItemToCart(item);
            
            const priceText = await inventoryPage.getItemPrice(item);
            itemPrices[item] = parseFloat(priceText.replace('$', ''));
        }

        // Verify cart count
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(items.length);

        // Go to cart and verify items
        await inventoryPage.goToCart();
        for (const item of items) {
            const isItemInCart = await cartPage.verifyItemInCart(item);
            expect(isItemInCart).toBeTruthy();

            // Verify prices match
            const cartPrice = await cartPage.getItemPrice(item);
            expect(cartPrice).toBe(`$${itemPrices[item]}`);
        }

        // Complete checkout using CustomerInfo
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo(
            CustomerInfo.default.firstName,
            CustomerInfo.default.lastName,
            CustomerInfo.default.postalCode
        );

        // Verify total matches sum of items plus tax
        const totalText = await cartPage.getTotalPrice();
        const total = parseFloat(totalText.replace('Total: $', ''));
        const subtotal = Object.values(itemPrices).reduce((a, b) => a + b, 0);
        expect(total).toBeGreaterThan(subtotal); // Account for tax

        await cartPage.completePurchase();
        const confirmationMessage = await cartPage.getConfirmationMessage();
        expect(confirmationMessage).toBe('Thank you for your order!');
    });

    test('add and remove items from cart', async () => {
        const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
        
        // Add all items
        for (const item of items) {
            await inventoryPage.addItemToCart(item);
            const count = await inventoryPage.getCartItemCount();
            expect(count).toBeGreaterThan(0);
        }

        // Remove middle item
        await inventoryPage.removeFromCart(items[1]);
        
        // Verify cart count decreased
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(items.length - 1);

        // Go to cart and verify correct items
        await inventoryPage.goToCart();
        expect(await cartPage.verifyItemInCart(items[0])).toBeTruthy();
        expect(await cartPage.verifyItemInCart(items[1])).toBeFalsy();
        expect(await cartPage.verifyItemInCart(items[2])).toBeTruthy();
    });

    test('sort items and verify prices', async () => {
        // Get all items and prices
        const items = await inventoryPage.getAllItems();
        expect(items.length).toBeGreaterThan(0);

        // Sort by price high to low
        await inventoryPage.sortItems('hilo');
        
        // Verify prices are in descending order
        const prices = await inventoryPage.getAllPrices();
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);

        // Add most expensive item
        await inventoryPage.addItemToCart(items[0]);
        
        // Sort by price low to high
        await inventoryPage.sortItems('lohi');
        
        // Add least expensive item
        await inventoryPage.addItemToCart(items[items.length - 1]);

        // Verify cart has 2 items
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(2);
    });

    test('validate checkout information requirements', async () => {
        // Add one item to cart
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();

        // Try checking out with no information
        await cartPage.fillCheckoutInfo('', '', '');
        expect(await cartPage.getErrorMessage()).toBe(ErrorMessages.firstNameRequired);

        // Try with only first name
        await cartPage.fillCheckoutInfo(CustomerInfo.default.firstName, '', '');
        expect(await cartPage.getErrorMessage()).toBe(ErrorMessages.lastNameRequired);

        // Try with first and last name
        await cartPage.fillCheckoutInfo(CustomerInfo.default.firstName, CustomerInfo.default.lastName, '');
        expect(await cartPage.getErrorMessage()).toBe(ErrorMessages.postalCodeRequired);

        // Complete with all information
        await cartPage.fillCheckoutInfo(
            CustomerInfo.default.firstName,
            CustomerInfo.default.lastName,
            CustomerInfo.default.postalCode
        );
        
        // Verify we moved to the next step
        const total = await cartPage.getTotalPrice();
        expect(total).toBeTruthy();
    });
}); 