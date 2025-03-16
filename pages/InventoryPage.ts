import { Page } from '@playwright/test';
import { InventoryLocators } from '../locators/InventoryLocators';
import { log } from '../utils/logger';

interface ProductInfo {
    name: string;
    price: string;
}

export class InventoryPage {
    private page: Page;
    private locators: InventoryLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = new InventoryLocators();
    }

    /**
     * Wait for inventory page to load
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForSelector(this.locators.inventoryContainer, { state: 'visible', timeout: 10000 });
    }

    /**
     * Add an item to cart by its name
     * @param itemName - Name of the item to add
     */
    async addItemToCart(itemName: string): Promise<void> {
        const addButton = this.page.locator(this.locators.addToCartButton(itemName));
        await addButton.waitFor({ state: 'visible', timeout: 5000 });
        await addButton.click();
        log.info(`Added ${itemName} to cart`);
    }

    /**
     * Remove an item from cart by its name
     * @param itemName - Name of the item to remove
     */
    async removeFromCart(itemName: string): Promise<void> {
        const removeButton = this.page.locator(this.locators.removeButton(itemName));
        await removeButton.waitFor({ state: 'visible', timeout: 5000 });
        await removeButton.click();
        log.info(`Removed ${itemName} from cart`);
    }

    /**
     * Get the number of items in cart
     * @returns Number of items in cart
     */
    async getCartItemCount(): Promise<number> {
        try {
            const cartBadge = this.page.locator(this.locators.cartBadge);
            await cartBadge.waitFor({ state: 'visible', timeout: 5000 });
            const count = await cartBadge.textContent();
            return count ? parseInt(count) : 0;
        } catch (error) {
            // If badge is not visible, it means cart is empty
            return 0;
        }
    }

    /**
     * Navigate to cart page
     */
    async goToCart(): Promise<void> {
        const cartLink = this.page.locator(this.locators.cartLink);
        await cartLink.waitFor({ state: 'visible', timeout: 5000 });
        await cartLink.click();
    }

    /**
     * Get price of an item
     * @param itemName - Name of the item
     * @returns Price of the item
     */
    async getItemPrice(itemName: string): Promise<string> {
        const priceElement = this.page.locator(this.locators.itemPrice(itemName));
        await priceElement.waitFor({ state: 'visible', timeout: 5000 });
        return await priceElement.textContent() || '';
    }

    /**
     * Get all item names
     * @returns Array of item names
     */
    async getAllItems(): Promise<string[]> {
        const itemElements = this.page.locator(this.locators.inventoryItemName);
        await itemElements.first().waitFor({ state: 'visible', timeout: 5000 });
        return await itemElements.allTextContents();
    }

    /**
     * Get all item prices
     * @returns Array of item prices
     */
    async getAllPrices(): Promise<number[]> {
        const priceElements = this.page.locator(this.locators.inventoryItemPrice);
        await priceElements.first().waitFor({ state: 'visible', timeout: 5000 });
        const prices = await priceElements.allTextContents();
        return prices.map((price: string) => parseFloat(price.replace('$', '')));
    }

    /**
     * Sort items by price
     * @param order - Sort order ('hilo' for high to low, 'lohi' for low to high)
     */
    async sortItems(order: 'hilo' | 'lohi'): Promise<void> {
        const sortSelect = this.page.locator(this.locators.sortDropdown);
        
        // Wait for the dropdown to be visible and enabled
        await this.page.waitForSelector(this.locators.sortDropdown, { 
            state: 'visible',
            timeout: 10000
        });

        // Perform the sort
        await sortSelect.selectOption(order);
        log.info(`Sorting items by price ${order === 'hilo' ? 'high to low' : 'low to high'}`);

        // Wait for a short time to let the sort complete
        await this.page.waitForTimeout(1000);

        // Verify the sort was successful
        const prices = await this.getAllPrices();
        const isSorted = order === 'hilo' 
            ? prices.every((price, i) => i === 0 || price <= prices[i - 1])
            : prices.every((price, i) => i === 0 || price >= prices[i - 1]);

        if (!isSorted) {
            throw new Error(`Items were not sorted correctly in ${order} order`);
        }
    }

    async getAllProductPrices(): Promise<string[]> {
        const prices = await this.page.locator(this.locators.itemPrice).allTextContents();
        return prices;
    }

    async getAllProductsWithPrices(): Promise<ProductInfo[]> {
        const products = await this.page.$$('.inventory_item');
        const productInfos: ProductInfo[] = [];

        for (const product of products) {
            const name = await product.locator('.inventory_item_name').textContent() || '';
            const price = await product.locator('.inventory_item_price').textContent() || '';
            productInfos.push({ name, price });
        }

        return productInfos;
    }
} 