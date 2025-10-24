import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
