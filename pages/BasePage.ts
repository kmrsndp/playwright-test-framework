import { Page } from '@playwright/test';
import { log } from '../utils/logger';

export class BasePage {
    constructor(protected page: Page) {}

    /**
     * Navigate to a specific URL with retry logic
     * @param url - The URL to navigate to
     */
    async navigate(url: string): Promise<void> {
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                log.info(`Navigating to ${url} (Attempt ${retryCount + 1}/${maxRetries})`);
                await this.page.goto(url, {
                    waitUntil: 'networkidle',
                    timeout: 30000
                });
                return;
            } catch (error) {
                retryCount++;
                if (retryCount === maxRetries) {
                    log.error(`Failed to navigate to ${url} after ${maxRetries} attempts`);
                    throw error;
                }
                log.warn(`Navigation failed, retrying... (${retryCount}/${maxRetries})`);
                await this.page.waitForTimeout(1000 * retryCount); // Exponential backoff
            }
        }
    }

    /**
     * Get current page URL
     * @returns Current page URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Wait for element to be visible with retry logic
     * @param selector - The selector to wait for
     * @param timeout - Optional timeout in milliseconds
     */
    async waitForElement(selector: string, timeout = 10000): Promise<void> {
        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                log.debug(`Waiting for element: ${selector} (Attempt ${retryCount + 1}/${maxRetries})`);
                await this.page.waitForSelector(selector, { 
                    state: 'visible',
                    timeout 
                });
                return;
            } catch (error) {
                retryCount++;
                if (retryCount === maxRetries) {
                    log.error(`Element ${selector} not found after ${maxRetries} attempts`);
                    throw error;
                }
                log.warn(`Element not found, retrying... (${retryCount}/${maxRetries})`);
                await this.page.waitForTimeout(500 * retryCount);
            }
        }
    }

    /**
     * Get text content of an element with retry
     * @param selector - The selector to get text from
     */
    async getText(selector: string): Promise<string> {
        await this.waitForElement(selector);
        log.debug(`Getting text from element: ${selector}`);
        const element = await this.page.locator(selector);
        return (await element.textContent()) || '';
    }

    /**
     * Click on an element with retry logic
     * @param selector - The selector to click
     */
    async click(selector: string): Promise<void> {
        await this.waitForElement(selector);
        log.debug(`Clicking element: ${selector}`);
        try {
            await this.page.click(selector);
        } catch (error) {
            log.warn(`Click failed, retrying with force: ${selector}`);
            await this.page.click(selector, { force: true });
        }
    }

    /**
     * Fill input field with retry logic
     * @param selector - The selector of input field
     * @param value - The value to fill
     */
    async fill(selector: string, value: string): Promise<void> {
        await this.waitForElement(selector);
        log.debug(`Filling ${selector} with value: ${value}`);
        try {
            await this.page.fill(selector, value);
        } catch (error) {
            log.warn(`Fill failed, retrying with force: ${selector}`);
            await this.page.fill(selector, value, { force: true });
        }
    }

    /**
     * Check if element is visible
     * @param selector - The selector to check
     */
    async isVisible(selector: string): Promise<boolean> {
        try {
            log.debug(`Checking visibility of element: ${selector}`);
            const element = await this.page.locator(selector);
            return await element.isVisible();
        } catch (error) {
            return false;
        }
    }
} 