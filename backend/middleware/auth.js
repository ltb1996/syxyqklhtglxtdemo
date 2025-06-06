/*
 * @Author: ltb1996 610030835@qq.com
 * @Date: 2025-06-06 21:41:26
 * @LastEditors: ltb1996 610030835@qq.com
 * @LastEditTime: 2025-06-06 21:41:42
 * @FilePath: \syxyqklhtglxtdemo\backend\utils\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');

/**
 * 身份认证中间件
 * 验证用户token并设置用户信息
 */
const authenticate = async (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, '请提供有效的访问令牌', 401);
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀

    // 验证token
    const decoded = verifyToken(token);
    
    // 查找用户
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return error(res, '用户不存在', 401);
    }

    if (user.status !== 'active') {
      return error(res, '用户账户已被禁用', 401);
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();

  } catch (err) {
    console.error('认证错误:', err.message);
    return error(res, err.message || '认证失败', 401);
  }
};

/**
 * 权限检查中间件
 * 检查用户是否有指定权限
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, '请先登录', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, '权限不足，无法访问此资源', 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
