# CashFree Payment Integration Guide for RepCore Gym

## Overview

This document provides information about the CashFree payment integration implemented in the RepCore Gym e-commerce application.

## Setup Instructions

### Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```
# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_API_URL=https://sandbox.cashfree.com/pg/v3 # Use https://api.cashfree.com/pg/v3 for production
```

### Backend Integration

The backend integration is implemented in `Backend/Controllers/Payment.js` and includes:

1. **Creating a Payment Order**: Sends order details to CashFree and returns a payment token
2. **Verifying Payment Status**: Checks the status of a payment with CashFree
3. **Webhook Handler**: Processes payment notifications from CashFree

### Frontend Integration

The frontend integration is implemented in `Frontend/src/Pages/Checkout.jsx` and includes:

1. **Payment Method Selection**: Allows users to choose between online payment and cash on delivery
2. **CashFree Checkout**: Initializes the CashFree checkout UI when online payment is selected
3. **Payment Verification**: Verifies the payment status after the user completes the payment

## Testing

### Test Cards

Use the following test cards for testing in sandbox mode:

- **Success Payment**:
  - Card Number: 4111 1111 1111 1111
  - Expiry: Any future date
  - CVV: Any 3 digits
  - Name: Any name
  - OTP: 123456

- **Failure Payment**:
  - Card Number: 4111 1111 1111 1111
  - Expiry: Any future date
  - CVV: Any 3 digits
  - Name: Any name
  - OTP: Any OTP except 123456

### Test UPI

- **Success Payment**: success@upi
- **Failure Payment**: failure@upi

## Customization

The CashFree checkout UI can be customized by modifying the `checkoutOptions` object in `Checkout.jsx`. The following options are available:

- **Components**: Control which payment methods are displayed and their order
- **Theme**: Customize the colors and fonts of the checkout UI
- **Callbacks**: Handle success, failure, and cancellation events

## Going Live

To switch from sandbox to production mode:

1. Update the `CASHFREE_API_URL` environment variable to use the production URL
2. Update the `mode` parameter in the `cashfree.initializeApp()` call to 'production'
3. Replace the test API credentials with production credentials

## Troubleshooting

- **Payment Verification Fails**: Check that the order ID is correctly passed to the verification endpoint
- **Checkout UI Doesn't Load**: Ensure the CashFree script is loaded correctly
- **Payment Fails**: Check the error message in the browser console and verify API credentials

## Resources

- [CashFree Documentation](https://docs.cashfree.com/docs/)
- [CashFree API Reference](https://docs.cashfree.com/reference/)
- [CashFree JavaScript SDK](https://docs.cashfree.com/docs/cashfree-js)