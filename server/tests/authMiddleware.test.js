/**
 * Unit tests for authMiddleware.js
 */

const jwt = require('jsonwebtoken');

// Mock config
jest.mock('../config/config', () => ({
    config: {
        jwt: {
            secret: 'test_secret_key',
            expiry: '1h'
        }
    }
}));

const { protectTeacher, protectAdmin, optionalAuth } = require('../middleware/authMiddleware');

describe('Auth Middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            header: jest.fn()
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    describe('protectTeacher', () => {
        it('should return 401 if no token provided', () => {
            mockReq.header.mockReturnValue(null);
            
            protectTeacher(mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ code: 'NO_TOKEN' })
            );
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 if token format is invalid', () => {
            mockReq.header.mockReturnValue('InvalidToken');
            
            protectTeacher(mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ code: 'NO_TOKEN' })
            );
        });

        it('should call next() for valid teacher token', () => {
            const token = jwt.sign(
                { id: '123', role: 'teacher', email: 'test@test.com' },
                'test_secret_key'
            );
            mockReq.header.mockReturnValue(`Bearer ${token}`);
            
            protectTeacher(mockReq, mockRes, mockNext);
            
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user).toBeDefined();
            expect(mockReq.user.role).toBe('teacher');
        });

        it('should call next() for valid admin token', () => {
            const token = jwt.sign(
                { id: '123', role: 'admin', username: 'admin' },
                'test_secret_key'
            );
            mockReq.header.mockReturnValue(`Bearer ${token}`);
            
            protectTeacher(mockReq, mockRes, mockNext);
            
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user.role).toBe('admin');
        });

        it('should return 403 for non-teacher/admin role', () => {
            const token = jwt.sign(
                { id: '123', role: 'student' },
                'test_secret_key'
            );
            mockReq.header.mockReturnValue(`Bearer ${token}`);
            
            protectTeacher(mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ code: 'FORBIDDEN' })
            );
        });

        it('should return 401 for expired token', () => {
            const token = jwt.sign(
                { id: '123', role: 'teacher' },
                'test_secret_key',
                { expiresIn: '-1s' } // Already expired
            );
            mockReq.header.mockReturnValue(`Bearer ${token}`);
            
            protectTeacher(mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ code: 'TOKEN_EXPIRED' })
            );
        });
    });

    describe('protectAdmin', () => {
        it('should return 401 if no token provided', () => {
            mockReq.header.mockReturnValue(null);
            
            protectAdmin(mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(401);
        });

        it('should call next() for valid admin token', () => {
            const token = jwt.sign(
                { id: '123', role: 'admin', username: 'admin' },
                'test_secret_key'
            );
            mockReq.header.mockReturnValue(`Bearer ${token}`);
            
            protectAdmin(mockReq, mockRes, mockNext);
            
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 403 for teacher token (admin only)', () => {
            const token = jwt.sign(
                { id: '123', role: 'teacher' },
                'test_secret_key'
            );
            mockReq.header.mockReturnValue(`Bearer ${token}`);
            
            protectAdmin(mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ code: 'ADMIN_ONLY' })
            );
        });
    });

    describe('optionalAuth', () => {
        it('should call next() without token', () => {
            mockReq.header.mockReturnValue(null);
            
            optionalAuth(mockReq, mockRes, mockNext);
            
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user).toBeUndefined();
        });

        it('should set user for valid token', () => {
            const token = jwt.sign(
                { id: '123', role: 'teacher' },
                'test_secret_key'
            );
            mockReq.header.mockReturnValue(`Bearer ${token}`);
            
            optionalAuth(mockReq, mockRes, mockNext);
            
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user).toBeDefined();
        });

        it('should call next() without user for invalid token', () => {
            mockReq.header.mockReturnValue('Bearer invalid_token');
            
            optionalAuth(mockReq, mockRes, mockNext);
            
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user).toBeUndefined();
        });
    });
});
