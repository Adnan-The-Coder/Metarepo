/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from 'hono';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Response type for consistency
interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
  isOk?: boolean;
}

// Validate amount
const isValidAmount = (amount: any): boolean => {
  return typeof amount === 'number' && amount > 0 && Number.isFinite(amount);
};

export const createOrder = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const { amount, notes } = body;

    // Validate amount
    if (!isValidAmount(amount)) {
      return c.json({
        success: false,
        message: 'Invalid amount. Must be a positive number.',
      } as PaymentResponse, 400);
    }

    // Amount validation: minimum 1 paise, maximum reasonable limit
    if (amount < 1 || amount > 500000000) { // 5 crore INR max
      return c.json({
        success: false,
        message: 'Amount must be between ₹0.01 and ₹50,00,000',
      } as PaymentResponse, 400);
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: c.env.RAZORPAY_LIVE_KEY_ID as string,
      key_secret: c.env.RAZORPAY_LIVE_KEY_SECRET as string,
    });

    if (!c.env.RAZORPAY_LIVE_KEY_ID || !c.env.RAZORPAY_LIVE_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured');
    }

    // Create order with optional notes
    const orderPayload: any = {
      amount,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Add notes if provided
    if (notes && typeof notes === 'object') {
      orderPayload.notes = notes;
    }

    const order = await razorpay.orders.create(orderPayload);

    return c.json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      },
    } as PaymentResponse);

  } catch (error: any) {
    console.error('Create order error:', error);
    
    const statusCode = error?.statusCode || 500;
    const message = error?.message || 'Failed to create payment order';

    return c.json({
      success: false,
      message,
    } as PaymentResponse, statusCode);
  }
};

// Generate HMAC SHA256 signature for verification
const generateSignature = (orderId: string, paymentId: string, keySecret: string): string => {
  const hmac = crypto.createHmac('sha256', keySecret);
  hmac.update(`${orderId}|${paymentId}`);
  return hmac.digest('hex');
};

// Constant-time comparison to prevent timing attacks
const secureCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

export const verifyOrder = async (c: Context): Promise<Response> => {
  try {
    const body = await c.req.json();
    const { orderId, razorpayPaymentId, razorpaySignature } = body;

    // Validate required fields
    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return c.json({
        success: false,
        isOk: false,
        message: 'Missing required fields: orderId, razorpayPaymentId, razorpaySignature',
      } as PaymentResponse, 400);
    }

    // Validate field types and format
    if (
      typeof orderId !== 'string' ||
      typeof razorpayPaymentId !== 'string' ||
      typeof razorpaySignature !== 'string'
    ) {
      return c.json({
        success: false,
        isOk: false,
        message: 'Invalid field types. All fields must be strings.',
      } as PaymentResponse, 400);
    }

    // Validate signature format (should be hex string)
    if (!/^[a-f0-9]{64}$/.test(razorpaySignature)) {
      return c.json({
        success: false,
        isOk: false,
        message: 'Invalid signature format',
      } as PaymentResponse, 400);
    }

    const keySecret = c.env.RAZORPAY_LIVE_KEY_SECRET as string;

    if (!keySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    // Generate expected signature
    const expectedSignature = generateSignature(orderId, razorpayPaymentId, keySecret);

    // Secure comparison to prevent timing attacks
    if (!secureCompare(expectedSignature, razorpaySignature)) {
      console.warn(`Signature mismatch for payment ${razorpayPaymentId}`);
      return c.json({
        success: false,
        isOk: false,
        message: 'Payment verification failed. Signature mismatch.',
      } as PaymentResponse, 401);
    }

    // Payment verified successfully
    return c.json({
      success: true,
      isOk: true,
      message: 'Payment verified successfully',
      data: {
        orderId,
        paymentId: razorpayPaymentId,
        verifiedAt: new Date().toISOString(),
      },
    } as PaymentResponse, 200);

  } catch (error: any) {
    console.error('Verify order error:', error);
    
    const statusCode = error?.statusCode || 500;
    const message = error?.message || 'Payment verification failed';

    return c.json({
      success: false,
      isOk: false,
      message,
    } as PaymentResponse, statusCode);
  }
};
