import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models';
import { sendEmail } from '../utils/sendEmail';

interface AuthRequest extends Request {
  user?: User;
}

// Generate JWT Token
const generateToken = (id: number): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, bio } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      bio,
      role: 'artist',
      isActive: false
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          bio: user.bio
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          bio: user.bio
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      bio: req.body.bio,
      contactInfo: req.body.contactInfo
    };

    await User.update(fieldsToUpdate, {
      where: { id: req.user!.id }
    });

    const user = await User.findByPk(req.user!.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email'
      });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    const resetExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.update(
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: resetExpire
      },
      { where: { id: user.id } }
    );

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password. 
      Please make a PUT request to: \n\n ${resetUrl}
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message
      });

      res.json({
        success: true,
        message: 'Email sent'
      });
    } catch (error) {
      await User.update(
        {
          resetPasswordToken: undefined,
          resetPasswordExpire: undefined
        },
        { where: { id: user.id } }
      );

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Set new password
    await User.update(
      {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined
      },
      { where: { id: user.id } }
    );

    const token = generateToken(user.id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
