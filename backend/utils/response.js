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

// 分页响应 - 修改为前端期望的格式
const paginated = (res, students, total, page, limit, message = '获取成功') => {
  return res.status(200).json({
    success: true,
    code: 200,
    message,
    data: {
      students,  // 学生数组
      total,     // 总数
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
