/*
 * @Author: ltb1996 610030835@qq.com
 * @Date: 2025-06-06 21:41:01
 * @LastEditors: ltb1996 610030835@qq.com
 * @LastEditTime: 2025-06-06 21:41:18
 * @FilePath: \syxyqklhtglxtdemo\backend\utils\response.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 统一响应格式工具
 * 标准化API响应格式
 */

// 成功响应
const success = (res, data = null, message = '操作成功', code = 200) => {
  return res.status(code).json({
    success: true,
    code,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// 错误响应
const error = (res, message = '操作失败', code = 500, details = null) => {
  return res.status(code).json({
    success: false,
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  });
};

// 分页响应
const paginated = (res, data, total, page, limit, message = '获取成功') => {
  return res.status(200).json({
    success: true,
    code: 200,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  success,
  error,
  paginated
};
