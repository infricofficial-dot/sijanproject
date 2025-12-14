# eSewa Payment Integration Guide

This application uses **eSewa Sandbox** for testing payment functionality. The sandbox environment allows you to test payments without using real money.

## 🔧 Configuration

### Environment Variables

The application is pre-configured with eSewa sandbox credentials in `.env.example`:

```env
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
```

These are the official test credentials provided by eSewa for sandbox testing.

### Setup Steps

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. The eSewa sandbox credentials are already set and will work for testing.

3. Start your application and test payments!

## 🧪 Testing Payments

### eSewa Sandbox Test Credentials

When you reach the eSewa payment page in sandbox mode, use these test credentials:

- **eSewa ID**: `9806800001` or `9806800002` or `9806800003`
- **MPIN**: `1234`
- **OTP**: `123456`

### Payment Flow

1. **Add items to cart** and proceed to checkout
2. **Fill in shipping details** and place order
3. You'll be redirected to **eSewa sandbox payment page**
4. Login with the test credentials above
5. Complete the payment
6. You'll be redirected back to the **Payment Success page**

## 📊 Payment Success Page Features

The enhanced Payment Success page displays:

### ✅ Payment Information
- Payment Method (eSewa)
- Payment Status (COMPLETED)
- Transaction ID from eSewa
- Amount Paid
- Payment Date and Time

### 📦 Order Summary
- List of all ordered items with quantities
- Subtotal, Tax, Shipping costs
- Discount (if coupon applied)
- Total amount

### 📍 Shipping Address
- Full recipient details
- Complete shipping address
- Contact phone number

## 🔄 API Endpoints

### Payment Initiation
```
POST /api/payments/esewa/initiate
Body: { orderId: "order-id" }
```

Initiates eSewa payment and returns form data to submit to eSewa gateway.

### Payment Success Callback
```
GET /api/payments/esewa/success?data=<base64_encoded_data>
```

eSewa redirects here after successful payment. Verifies payment and updates order status.

### Payment Failure Callback
```
GET /api/payments/esewa/failure
```

eSewa redirects here if payment fails.

### Get Payment Details
```
GET /api/payments/order/:orderId
```

Fetches payment details for a specific order.

### Get Address Details
```
GET /api/addresses/:id
```

Fetches shipping address details.

## 🚀 Production Deployment

When moving to production:

1. **Register with eSewa** for a merchant account
2. **Update environment variables** with production credentials:
   ```env
   ESEWA_MERCHANT_CODE=your_production_merchant_id
   ESEWA_SECRET_KEY=your_production_secret_key
   ```

3. **Update payment URL** in `server/routes.ts` (line ~702):
   ```typescript
   // Change from sandbox to production URL
   paymentUrl: 'https://epay.esewa.com.np/api/epay/main/v2/form'
   ```

## 🔒 Security Features

- **HMAC-SHA256 signature verification** for all payment callbacks
- **Session-based authentication** for order access
- **User authorization checks** for payment and address data
- **Secure payment data storage** with transaction IDs

## 📝 Important Notes

- Sandbox payments are **NOT real transactions**
- All test payments will show as successful
- Sandbox credentials work only in test environment
- Always use HTTPS in production for secure payment processing

## 🐛 Troubleshooting

### Payment Not Redirecting Back
- Check that your success/failure URLs are correctly set
- Ensure your server is accessible from eSewa (not localhost in production)

### Payment Shows as Pending
- Verify signature validation in success callback
- Check eSewa response data format
- Review server logs for errors

### Order Not Updating After Payment
- Confirm payment webhook endpoints are working
- Check database connection
- Verify order ID matches between payment and order records

## 📚 Additional Resources

- [eSewa Developer Documentation](https://developer.esewa.com.np/)
- [eSewa Sandbox Testing Guide](https://developer.esewa.com.np/pages/sandbox)
- [eSewa API Integration](https://developer.esewa.com.np/pages/Epay)

---

For support or questions about eSewa integration, refer to the official eSewa developer portal.
