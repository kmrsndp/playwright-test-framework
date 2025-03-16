import { Page } from '@playwright/test';
import { CheckoutLocators } from '../locators/CheckoutLocators';

export class CheckoutPage {
    private page: Page;
    private locators: CheckoutLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = new CheckoutLocators();
    }

    async fillShippingInfo(firstName: string, lastName: string, postalCode: string) {
        await this.page.fill(this.locators.firstNameInput, firstName);
        await this.page.fill(this.locators.lastNameInput, lastName);
        await this.page.fill(this.locators.postalCodeInput, postalCode);
    }

    async continueToOverview() {
        await this.page.click(this.locators.continueButton);
    }

    async getTotalPrice(): Promise<string> {
        const totalElement = await this.page.locator(this.locators.totalPrice);
        return totalElement.textContent() || '';
    }

    async finishCheckout() {
        await this.page.click(this.locators.finishButton);
    }

    async getConfirmationMessage(): Promise<string> {
        const messageElement = await this.page.locator(this.locators.confirmationMessage);
        return messageElement.textContent() || '';
    }

    async isOrderComplete(): Promise<boolean> {
        const completeHeader = await this.page.locator(this.locators.completeHeader);
        return await completeHeader.isVisible();
    }
} 