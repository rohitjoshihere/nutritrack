import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateToken, generateResetToken } from '../utils/helpers.js';

/** POST /api/auth/register */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** POST /api/auth/login */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account blocked' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** GET /api/auth/me */
export const getMe = async (req, res) => {
  res.json(req.user);
};

/** POST /api/auth/forgot-password */
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ message: 'If email exists, reset link has been sent' });
    }
    const { resetToken, hashed } = generateResetToken();
    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log('Password reset URL:', resetUrl); // In production, send via email
    res.json({ message: 'If email exists, reset link has been sent', resetUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** POST /api/auth/reset-password/:token */
export const resetPassword = async (req, res) => {
  try {
    const crypto = await import('crypto');
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: 'Password updated successfully', token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
