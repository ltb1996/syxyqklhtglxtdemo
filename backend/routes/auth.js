/*
 * @Author: ltb1996 610030835@qq.com
 * @Date: 2025-06-06 21:47:06
 * @LastEditors: ltb1996 610030835@qq.com
 * @LastEditTime: 2025-06-06 21:47:19
 * @FilePath: \syxyqklhtglxtdemo\backend\routes\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const { body } = require('express-validator');
const {
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

/**
 * 认证相关路由
 */

// 用户登录
router.post('/login', [
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 3 })
    .withMessage('用户名至少3个字符'),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
    .isLength({ min: 6 })
    .withMessage('密码至少6个字符'),
  handleValidationErrors
], login);

// 获取用户信息（需要认证）
router.get('/profile', authenticate, getProfile);

// 更新用户信息（需要认证）
router.put('/profile', [
  authenticate,
  body('name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('姓名长度应在1-50个字符之间'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('邮箱格式不正确'),
  handleValidationErrors
], updateProfile);

// 修改密码（需要认证）
router.put('/password', [
  authenticate,
  body('oldPassword')
    .notEmpty()
    .withMessage('原密码不能为空'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新密码至少6个字符')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('新密码必须包含字母和数字'),
  handleValidationErrors
], changePassword);

// 用户登出（需要认证）
router.post('/logout', authenticate, logout);

module.exports = router;
