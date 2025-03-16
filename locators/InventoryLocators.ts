export class InventoryLocators {
    readonly inventoryContainer = "#inventory_container";
    readonly cartLink = ".shopping_cart_link";
    readonly cartBadge = ".shopping_cart_badge";
    readonly sortDropdown = '.product_sort_container';
    readonly inventoryItemName = '.inventory_item_name';
    readonly inventoryItemPrice = '.inventory_item_price';

    addToCartButton(itemName: string): string {
        return `//div[text()='${itemName}']/ancestor::div[@class='inventory_item']//button[contains(@data-test, 'add-to-cart')]`;
    }

    removeButton(itemName: string): string {
        return `//div[text()='${itemName}']/ancestor::div[@class='inventory_item']//button[contains(@data-test, 'remove')]`;
    }

    itemPrice(itemName: string): string {
        return `//div[text()='${itemName}']/ancestor::div[@class='inventory_item']//div[@class='inventory_item_price']`;
    }
} 