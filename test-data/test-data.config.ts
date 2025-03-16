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

export const TestProducts = {
    backpack: {
        name: 'Sauce Labs Backpack',
        price: '29.99'
    },
    bikeLight: {
        name: 'Sauce Labs Bike Light',
        price: '9.99'
    },
    boltTShirt: {
        name: 'Sauce Labs Bolt T-Shirt',
        price: '15.99'
    },
    fleeceJacket: {
        name: 'Sauce Labs Fleece Jacket',
        price: '49.99'
    },
    onesie: {
        name: 'Sauce Labs Onesie',
        price: '7.99'
    },
    redTShirt: {
        name: 'Test.allTheThings() T-Shirt (Red)',
        price: '15.99'
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

export const ErrorMessages = {
    firstNameRequired: 'First Name is required',
    lastNameRequired: 'Last Name is required',
    postalCodeRequired: 'Postal Code is required',
    lockedOutUser: 'Epic sadface: Sorry, this user has been locked out.'
} as const; 