import { APIHelper } from './utils/api-helper';
import { TestUsers } from './test-data';

async function globalSetup() {
    // Create API helper
    const api = await APIHelper.create();

    // Verify API endpoints are accessible
    try {
        await api.login(
            TestUsers.standardUser.username,
            TestUsers.standardUser.password
        );
        console.log('✓ API endpoints are accessible');
    } catch (error) {
        console.error('✗ API endpoints are not accessible');
        throw error;
    }

    // Additional setup tasks can be added here
    // - Database cleanup
    // - Test data preparation
    // - Environment configuration
}

export default globalSetup; 