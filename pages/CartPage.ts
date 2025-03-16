import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { log } from '../utils/logger';
import { CartLocators } from '../locators/CartLocators';

export class CartPage extends BasePage {
    private locators: CartLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new CartLocators();
    }

    /**
     * Proceed to checkout
     */
    async proceedToCheckout(): Promise<void> {
        await this.click(this.locators.checkoutButton);
        log.info('Proceeding to checkout');
    }

    /**
     * Fill checkout information
     * @param firstName - Customer's first name
     * @param lastName - Customer's last name
     * @param postalCode - Customer's postal code
     */
    async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.fill(this.locators.firstNameInput, firstName);
        await this.fill(this.locators.lastNameInput, lastName);
        await this.fill(this.locators.postalCodeInput, postalCode);
        await this.click(this.locators.continueButton);
        log.info('Filled checkout information');
    }

    /**
     * Complete purchase
     */
    async completePurchase(): Promise<void> {
        await this.click(this.locators.finishButton);
        log.info('Completed purchase');
    }

    /**
     * Get confirmation message
     * @returns Confirmation message text
     */
    async getConfirmationMessage(): Promise<string> {
        const messageElement = this.page.locator(this.locators.confirmationMessage);
        return await messageElement.textContent() || '';
    }

    /**
     * Verify item is in cart
     * @param itemName - Name of the item to verify
     */
    async verifyItemInCart(itemName: string): Promise<boolean> {
        const item = this.page.locator(this.locators.cartItem(itemName));
        return await item.isVisible();
    }

    /**
     * Get item price in cart
     * @param itemName - Name of the item
     */
    async getItemPrice(itemName: string): Promise<string> {
        const priceElement = this.page.locator(this.locators.itemPrice(itemName));
        return await priceElement.textContent() || '';
    }

    /**
     * Get total price
     */
    async getTotalPrice(): Promise<string> {
        const totalElement = this.page.locator(this.locators.totalPrice);
        return await totalElement.textContent() || '';
    }

    async getErrorMessage(): Promise<string> {
        const errorElement = this.page.locator(this.locators.errorMessage);
        return await errorElement.textContent() || '';
    }
} 