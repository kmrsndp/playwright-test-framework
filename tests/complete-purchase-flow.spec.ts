import { expect } from '@playwright/test';
import { test } from '../fixtures/test-fixtures';
import { TestUsers } from '../test-data';

test.describe('Complete Purchase Flow Tests', () => {
    /**
     * Problem Statement:
     * Verify that a user can complete a full purchase flow by:
     * - Logging in successfully
     * - Adding multiple items to cart
     * - Sorting items by price and adding the most expensive item
     * - Verifying cart contents and total price
     * - Completing checkout with shipping information
     * - Verifying order confirmation and thank you message
     * 
     * Additional Requirements:
     * - Fetch and verify prices for all displayed items
     * - Place an order for at least 3 items with total value over $100
     */

    test('verify all product prices and sort functionality', async ({ loginPage, inventoryPage }) => {
        // Login
        await loginPage.goto();
        await loginPage.login(TestUsers.standardUser.username, TestUsers.standardUser.password);
        await inventoryPage.waitForPageLoad();

        // Get all product prices and verify they are valid
        const productPrices = await inventoryPage.getAllPrices();
        expect(productPrices.length).toBeGreaterThan(0);
        productPrices.forEach((price: number) => {
            expect(price).toBeGreaterThan(0);
        });

        // Sort items by price high to low
        await inventoryPage.sortItems('hilo');
        
        // Verify sorting worked correctly
        const sortedPrices = await inventoryPage.getAllPrices();
        
        // Verify prices are in descending order
        for (let i = 0; i < sortedPrices.length - 1; i++) {
            expect(sortedPrices[i]).toBeGreaterThanOrEqual(sortedPrices[i + 1]);
        }
    });

    test('complete high-value purchase with multiple items', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
        // Login
        await loginPage.goto();
        await loginPage.login(TestUsers.standardUser.username, TestUsers.standardUser.password);
        await inventoryPage.waitForPageLoad();

        // Sort by price high to low to easily find expensive items
        await inventoryPage.sortItems('hilo');

        // Get all items and their prices
        const items = await inventoryPage.getAllItems();
        const prices = await inventoryPage.getAllPrices();
        
        // Calculate how many items we need to reach $100
        let totalPrice = 0;
        const selectedProducts = [];
        
        for (let i = 0; i < items.length; i++) {
            totalPrice += prices[i];
            selectedProducts.push(items[i]);
            
            // Add item to cart
            await inventoryPage.addItemToCart(items[i]);
            
            // Break if we have at least 3 items and total is over $100
            if (selectedProducts.length >= 3 && totalPrice >= 100) {
                break;
            }
        }

        // Verify we have enough items and value
        expect(selectedProducts.length).toBeGreaterThanOrEqual(3);
        expect(totalPrice).toBeGreaterThanOrEqual(100);

        // Go to cart
        await inventoryPage.goToCart();

        // Verify cart contents
        for (const productName of selectedProducts) {
            const isInCart = await cartPage.verifyItemInCart(productName);
            expect(isInCart).toBeTruthy();
        }

        // Proceed to checkout
        await cartPage.proceedToCheckout();

        // Fill shipping information
        await checkoutPage.fillShippingInfo(
            TestUsers.standardUser.firstName,
            TestUsers.standardUser.lastName,
            TestUsers.standardUser.postalCode
        );

        // Continue to overview
        await checkoutPage.continueToOverview();

        // Verify total price on overview page
        const finalTotal = await checkoutPage.getTotalPrice();
        const finalTotalValue = parseFloat(finalTotal.replace('Total: $', ''));
        expect(finalTotalValue).toBeGreaterThanOrEqual(100);

        // Complete purchase
        await checkoutPage.finishCheckout();

        // Verify success message
        const confirmationMessage = await checkoutPage.getConfirmationMessage();
        expect(confirmationMessage).toContain('Thank you for your order');

        // Verify order completion
        const orderComplete = await checkoutPage.isOrderComplete();
        expect(orderComplete).toBeTruthy();
    });
}); 