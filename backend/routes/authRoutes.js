const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    getAllUsers,
    getUserById,
    UpdatePicture,
    editUser,
    deleteUser,
    refreshToken
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// user routes
router.post('/signup', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);

// route for editing profile
router.put('/users/profile', protect, UpdatePicture);

// admin-only routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/edit', protect, authorize('admin'), editUser);
router.get('/users/search', protect, authorize('admin'), getUserById);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;