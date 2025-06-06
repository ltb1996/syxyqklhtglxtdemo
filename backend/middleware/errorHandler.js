/*
 * @Author: ltb1996 610030835@qq.com
 * @Date: 2025-06-06 21:42:36
 * @LastEditors: ltb1996 610030835@qq.com
 * @LastEditTime: 2025-06-06 21:42:49
 * @FilePath: \syxyqklhtglxtdemo\backend\utils\errorHandler.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { error } = require('../utils/response');

/**
 * 全局错误处理中间件
 * 捕获并处理所有未被处理的错误
 */
const errorHandler = (err, req, res, next) => {
  console.error('错误详情:', err);

  // Mongoose验证错误
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    return error(res, '数据验证失败', 400, messages);
  }

  // Mongoose重复键错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    return error(res, `${field}：${value} 已存在`, 400);
  }

  // Mongoose无效ObjectId错误
  if (err.name === 'CastError') {
    return error(res, '无效的ID格式', 400);
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return error(res, '无效的访问令牌', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return error(res, '访问令牌已过期', 401);
  }

  // 默认错误
  return error(res, err.message || '服务器内部错误', err.statusCode || 500);
};

module.exports = errorHandler;
