export class CommonLocators {
    button(name: string): string {
        return `[data-test="${name}"]`;
    }

    input(name: string): string {
        return `[data-test="${name}"]`;
    }

    readonly shoppingCart = '.shopping_cart_link';
    readonly cartBadge = '.shopping_cart_badge';
    readonly errorMessage = '[data-test="error"]';

    container(id: string): string {
        return `#${id}_container`;
    }
} 