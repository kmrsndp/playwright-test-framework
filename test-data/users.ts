import { type User } from '../types/user';

export const TestUsers = {
    standardUser: {
        username: 'standard_user',
        password: 'secret_sauce',
        firstName: 'John',
        lastName: 'Doe',
        postalCode: '12345'
    },
    lockedOutUser: {
        username: 'locked_out_user',
        password: 'secret_sauce'
    },
    problemUser: {
        username: 'problem_user',
        password: 'secret_sauce'
    },
    performanceGlitchUser: {
        username: 'performance_glitch_user',
        password: 'secret_sauce'
    }
} as const;

export const CustomerInfo = {
    default: {
        firstName: 'John',
        lastName: 'Doe',
        postalCode: '12345'
    },
    invalid: {
        firstName: '',
        lastName: '',
        postalCode: ''
    }
} as const; 