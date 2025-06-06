const express = require('express');
const { body, query } = require('express-validator');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStatistics
} = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

/**
 * 学生信息相关路由
 * 所有路由都需要认证
 */

// 应用认证中间件到所有路由
router.use(authenticate);

// 获取学生列表
router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('页码必须是大于0的整数'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('每页数量必须是1-100之间的整数'),
  handleValidationErrors
], getStudents);

// 获取统计信息
router.get('/statistics', getStatistics);

// 根据ID获取学生信息
router.get('/:id', getStudentById);

// 创建学生信息
router.post('/', [
  // 基本信息验证
  body('name')
    .notEmpty()
    .withMessage('姓名是必填项')
    .isLength({ max: 50 })
    .withMessage('姓名不能超过50个字符'),
  body('gender')
    .isIn(['男', '女'])
    .withMessage('性别只能是男或女'),
  body('birthday')
    .isISO8601()
    .withMessage('出生日期格式不正确')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('出生日期不能是未来时间');
      }
      return true;
    }),
  body('idCard')
    .matches(/^\d{17}[\dXx]$/)
    .withMessage('身份证号格式不正确'),
  body('phone')
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('邮箱格式不正确'),

  // 学籍信息验证
  body('studentId')
    .matches(/^\d{10}$/)
    .withMessage('学号必须是10位数字'),
  body('grade')
    .isIn(['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'])
    .withMessage('年级选择不正确'),
  body('class')
    .notEmpty()
    .withMessage('班级是必填项')
    .isLength({ max: 20 })
    .withMessage('班级名称不能超过20个字符'),
  body('enrollmentYear')
    .isInt({ min: 2000, max: new Date().getFullYear() })
    .withMessage('入学年份不正确'),

  // 家庭信息验证（可选）
  body('parentInfo.fatherPhone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('父亲联系电话格式不正确'),
  body('parentInfo.motherPhone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('母亲联系电话格式不正确'),
  body('parentInfo.emergencyPhone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('紧急联系电话格式不正确'),

  handleValidationErrors
], createStudent);

// 更新学生信息
router.put('/:id', [
  // 基本信息验证（可选更新）
  body('name')
    .optional()
    .notEmpty()
    .withMessage('姓名不能为空')
    .isLength({ max: 50 })
    .withMessage('姓名不能超过50个字符'),
  body('gender')
    .optional()
    .isIn(['男', '女'])
    .withMessage('性别只能是男或女'),
  body('birthday')
    .optional()
    .isISO8601()
    .withMessage('出生日期格式不正确')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('出生日期不能是未来时间');
      }
      return true;
    }),
  body('idCard')
    .optional()
    .matches(/^\d{17}[\dXx]$/)
    .withMessage('身份证号格式不正确'),
  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('邮箱格式不正确'),

  // 学籍信息验证（可选更新）
  body('studentId')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('学号必须是10位数字'),
  body('grade')
    .optional()
    .isIn(['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'])
    .withMessage('年级选择不正确'),
  body('class')
    .optional()
    .notEmpty()
    .withMessage('班级不能为空')
    .isLength({ max: 20 })
    .withMessage('班级名称不能超过20个字符'),
  body('enrollmentYear')
    .optional()
    .isInt({ min: 2000, max: new Date().getFullYear() })
    .withMessage('入学年份不正确'),

  handleValidationErrors
], updateStudent);

// 删除学生信息（需要管理员权限）
router.delete('/:id', authorize('admin', 'teacher'), deleteStudent);

module.exports = router;
