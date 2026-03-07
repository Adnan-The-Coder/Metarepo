import { Hono, Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { userProfiles } from '../db/schema';
import { createOrder, verifyOrder } from '../controllers/payment';

const paymentRoutes = new Hono();

// Request body size limit validation
const validateContentLength = async (c: Context, next: any) => {
  const contentLength = c.req.header('Content-Length');
  
  if (contentLength && parseInt(contentLength, 10) > 10240) { // 10KB limit
    return c.json({
      success: false,
      message: 'Request body too large. Maximum 10KB allowed.',
    }, 413);
  }

  await next();
};

// Auth middleware - validates Bearer token (UUID) exists in database
paymentRoutes.use('/*', validateContentLength);

paymentRoutes.use('/*', async (c: Context, next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        message: 'Missing or invalid Authorization header. Use Bearer <uuid>',
      }, 401);
    }

    const userUuid = authHeader.replace('Bearer ', '').trim();

    // Validate UUID format (basic validation)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userUuid)) {
      return c.json({
        success: false,
        message: 'Invalid token format. Must be a valid UUID.',
      }, 401);
    }

    // Check if user exists in database
    const db = drizzle(c.env.DB);
    const user = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.uuid, userUuid))
      .limit(1);

    if (user.length === 0) {
      return c.json({
        success: false,
        message: 'User not found. Invalid UUID.',
      }, 401);
    }

    // Store user UUID and profile in context for use in controllers
    c.set('userUuid', userUuid);
    c.set('user', user[0]);
    
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({
      success: false,
      message: 'Authentication failed',
    }, 500);
  }
});

// Health check endpoint for payments
paymentRoutes.get('/health', (c: Context) => {
  return c.json({
    success: true,
    message: 'Payment service is healthy',
    timestamp: new Date().toISOString(),
  }, 200);
});

// Create Razorpay order
paymentRoutes.post('/create-order', createOrder);

// Verify Razorpay payment
paymentRoutes.post('/verify-order', verifyOrder);

export default paymentRoutes;
