const { validationResult } = require('express-validator');
const { error } = require('../utils/response');

/**
 * 验证结果处理中间件
 * 处理express-validator的验证结果
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return error(res, '输入数据验证失败', 400, errorMessages);
  }
  
  next();
};

module.exports = {
  handleValidationErrors
};
