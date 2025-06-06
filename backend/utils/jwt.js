const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * JWT工具函数
 * 用于生成和验证JWT token
 */

// 生成JWT token
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
      issuer: 'student-management-system'
    });
  } catch (error) {
    throw new Error('Token生成失败');
  }
};

// 验证JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token已过期');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token无效');
    } else {
      throw new Error('Token验证失败');
    }
  }
};

module.exports = {
  generateToken,
  verifyToken
};
