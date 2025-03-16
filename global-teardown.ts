import { APIHelper } from './utils/api-helper';

async function globalTeardown() {
    // Create API helper
    const api = await APIHelper.create();

    try {
        // Clear any test data
        await api.clearCart();
        console.log('✓ Test data cleaned up');
    } catch (error) {
        console.error('✗ Failed to clean up test data:', error);
    }

    // Additional cleanup tasks can be added here
    // - Remove test users
    // - Reset application state
    // - Clean up test artifacts
}

export default globalTeardown; 