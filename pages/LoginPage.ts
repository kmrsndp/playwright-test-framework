import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { log } from '../utils/logger';
import { LoginLocators } from '../locators/LoginLocators';

export class LoginPage extends BasePage {
    private locators: LoginLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new LoginLocators();
    }

    /**
     * Navigate to login page
     */
    async goto(): Promise<void> {
        log.info('Navigating to login page');
        await this.navigate('/');
    }

    /**
     * Login with username and password
     * @param username - Username to login with
     * @param password - Password to login with
     */
    async login(username: string, password: string): Promise<void> {
        log.info(`Attempting to login with username: ${username}`);
        await this.fill(this.locators.usernameInput, username);
        await this.fill(this.locators.passwordInput, password);
        await this.click(this.locators.loginButton);
        log.info(`Logged in as ${username}`);
    }

    /**
     * Get error message text if present
     * @returns Error message text or empty string
     */
    async getErrorMessage(): Promise<string> {
        log.debug('Getting error message if present');
        const errorElement = this.page.locator(this.locators.errorMessage);
        return await errorElement.textContent() || '';
    }

    /**
     * Check if user is on login page
     * @returns true if on login page
     */
    async isOnLoginPage(): Promise<boolean> {
        log.debug('Checking if user is on login page');
        return await this.isVisible(this.locators.loginButton);
    }
} 