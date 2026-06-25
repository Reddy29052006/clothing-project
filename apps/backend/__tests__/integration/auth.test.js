const request = require('supertest');
const { app } = require('../../server');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

// Mock User Model
jest.mock('../../models/User');

describe('Authentication API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully with correct details', async () => {
      const mockUserData = {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'password123',
        role: 'user',
      };

      // Mock user save outcome
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: 'mock_user_id_123',
        name: mockUserData.name,
        email: mockUserData.email,
        role: mockUserData.role,
        comparePassword: async () => true,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(mockUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'customer@test.com');
      expect(response.body.user).toHaveProperty('role', 'user');
    });

    test('should fail to register if user already exists', async () => {
      const mockUserData = {
        name: 'Duplicate User',
        email: 'duplicate@test.com',
        password: 'password123',
        role: 'user',
      };

      User.findOne.mockResolvedValue({ email: 'duplicate@test.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send(mockUserData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should authenticate and login user with valid credentials', async () => {
      const mockLoginData = {
        email: 'customer@test.com',
        password: 'password123',
      };

      const mockUserInstance = {
        _id: 'mock_user_id_123',
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'hashed_password_abc',
        role: 'user',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserInstance),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(mockLoginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('customer@test.com');
    });

    test('should reject authentication for wrong password', async () => {
      const mockLoginData = {
        email: 'customer@test.com',
        password: 'wrongpassword',
      };

      const mockUserInstance = {
        _id: 'mock_user_id_123',
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'hashed_password_abc',
        role: 'user',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserInstance),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(mockLoginData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });
});
