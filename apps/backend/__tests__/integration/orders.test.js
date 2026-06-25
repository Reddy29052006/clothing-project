const request = require('supertest');
const User = require('../../models/User');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Measurement = require('../../models/Measurement');
const jwt = require('jsonwebtoken');

// Mock Razorpay SDK so payment controller always falls back to MOCK mode
jest.mock('razorpay');

// Mock all Mongoose models used in order / payment controllers
jest.mock('../../models/User');
jest.mock('../../models/Order');
jest.mock('../../models/Product');
jest.mock('../../models/Measurement');

// Import app AFTER mocks are set up
const { app } = require('../../server');

describe('Orders and Payments API Integration Tests', () => {
  let token;
  const mockUserId = 'mock_user_id_123';
  const jwtSecret = process.env.JWT_SECRET || 'fitcraft_jwt';

  beforeAll(() => {
    // Generate valid authorization token
    token = jwt.sign({ id: mockUserId }, jwtSecret, { expiresIn: '1h' });
    // Unset Razorpay keys so payment controller runs in MOCK mode during tests
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock user lookup for 'protect' middleware
    User.findById.mockResolvedValue({
      _id: mockUserId,
      name: 'Test Customer',
      email: 'customer@test.com',
      role: 'user',
    });
  });

  describe('GET /api/orders/my', () => {
    test('should fetch user orders list when authorized', async () => {
      const mockOrders = [
        { _id: 'order1', orderId: 'FC-1001', totalPrice: 120, status: 'confirmed' },
        { _id: 'order2', orderId: 'FC-1002', totalPrice: 85, status: 'pending_payment' },
      ];

      const mockFindChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockOrders),
      };
      Order.find.mockReturnValue(mockFindChain);

      const response = await request(app)
        .get('/api/orders/my')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.orders).toHaveLength(2);
      expect(response.body.orders[0]).toHaveProperty('orderId', 'FC-1001');
    });

    test('should fail if authorization token is missing', async () => {
      const response = await request(app).get('/api/orders/my');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/payments/create-checkout-session', () => {
    test('should return checkout session URL and create pending orders', async () => {
      const mockCartPayload = {
        items: [
          {
            productId: 'product_id_1',
            selectedFabric: 'Cotton Premium',
            selectedColor: 'Navy Blue',
            fitPreference: 'slim',
          },
        ],
        deliveryAddress: {
          street: '123 Tailor Lane',
          city: 'Stitch City',
          state: 'CA',
          pincode: '90210',
        },
      };

      // Mock dependencies inside the controller
      Measurement.findOne.mockResolvedValue({
        chest: 100,
        waist: 85,
        shoulder: 44,
        hip: 98,
        inseam: 80,
        sleeve: 60,
        neck: 40,
        fitPreference: 'slim',
      });

      Product.findById.mockResolvedValue({
        _id: 'product_id_1',
        name: 'Classic Tuxedo',
        basePrice: 150,
        tailorsId: 'tailor_id_777',
        fabrics: [
          { name: 'Cotton Premium', surcharge: 25 },
        ],
      });

      Order.create.mockResolvedValue({
        _id: 'mock_created_order_id',
        orderId: 'FC-MOCK-99',
        totalPrice: 175,
      });

      Order.updateMany.mockResolvedValue({ nModified: 1 });

      const response = await request(app)
        .post('/api/payments/create-checkout-session')
        .set('Authorization', `Bearer ${token}`)
        .send(mockCartPayload);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('orderId');
      expect(response.body).toHaveProperty('amount');
      expect(response.body).toHaveProperty('currency', 'INR');
      // Mock mode: no Razorpay keys configured in test env
      expect(response.body.mode).toBe('mock');
      expect(response.body.url).toContain('/payment-success?session_id=mock_rzp_');
    });
  });
});
