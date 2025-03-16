export class CartLocators {
    readonly checkoutButton = '[data-test="checkout"]';
    readonly firstNameInput = '[data-test="firstName"]';
    readonly lastNameInput = '[data-test="lastName"]';
    readonly postalCodeInput = '[data-test="postalCode"]';
    readonly continueButton = '[data-test="continue"]';
    readonly finishButton = '[data-test="finish"]';
    readonly confirmationMessage = '.complete-header';
    readonly errorMessage = '[data-test="error"]';
    readonly totalPrice = '.summary_total_label';

    cartItem(itemName: string): string {
        return `//div[text()='${itemName}' and contains(@class, 'inventory_item_name')]`;
    }

    itemPrice(itemName: string): string {
        return `//div[text()='${itemName}']/ancestor::div[contains(@class, 'cart_item')]//div[@class='inventory_item_price']`;
    }
} 