const Student = require('../models/Student');
const { success, error, paginated } = require('../utils/response');
const mongoose = require('mongoose');

/**
 * 学生信息控制器
 * 处理学生信息的CRUD操作
 */

// 获取学生列表（支持分页和搜索）
const getStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      grade = '',
      class: className = '',
      status = ''
    } = req.query;

    // 构建查询条件
    const query = {};
    
    // 搜索条件
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { studentId: searchRegex },
        { phone: searchRegex },
        { 'parentInfo.fatherName': searchRegex },
        { 'parentInfo.motherName': searchRegex }
      ];
    }

    // 筛选条件
    if (grade) query.grade = grade;
    if (className) query.class = className;
    if (status) query.status = status;

    // 计算分页
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 执行查询
    const [students, total] = await Promise.all([
      Student.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Student.countDocuments(query)
    ]);

    paginated(res, students, total, page, limit, '获取学生列表成功');
  } catch (err) {
    console.error('获取学生列表错误:', err);
    error(res, '获取学生列表失败', 500);
  }
};

// 根据ID获取单个学生信息
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(res, '无效的学生ID', 400);
    }

    const student = await Student.findById(id);

    if (!student) {
      return error(res, '学生信息不存在', 404);
    }

    success(res, student, '获取学生信息成功');
  } catch (err) {
    console.error('获取学生信息错误:', err);
    error(res, '获取学生信息失败', 500);
  }
};

// 创建新学生
const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();

    success(res, student, '学生信息创建成功', 201);
  } catch (err) {
    console.error('创建学生信息错误:', err);
    
    // 处理重复键错误
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      return error(res, `${field === 'studentId' ? '学号' : '身份证号'}：${value} 已存在`, 400);
    }
    
    error(res, err.message || '创建学生信息失败', 500);
  }
};

// 更新学生信息
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(res, '无效的学生ID', 400);
    }

    const student = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return error(res, '学生信息不存在', 404);
    }

    success(res, student, '学生信息更新成功');
  } catch (err) {
    console.error('更新学生信息错误:', err);
    
    // 处理重复键错误
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      return error(res, `${field === 'studentId' ? '学号' : '身份证号'}：${value} 已存在`, 400);
    }
    
    error(res, err.message || '更新学生信息失败', 500);
  }
};

// 删除学生信息
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return error(res, '无效的学生ID', 400);
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return error(res, '学生信息不存在', 404);
    }

    success(res, null, '学生信息删除成功');
  } catch (err) {
    console.error('删除学生信息错误:', err);
    error(res, '删除学生信息失败', 500);
  }
};

// 获取统计信息
const getStatistics = async (req, res) => {
  try {
    const [
      totalStudents,
      gradeStats,
      statusStats
    ] = await Promise.all([
      // 总学生数
      Student.countDocuments(),
      
      // 按年级统计
      Student.aggregate([
        { $group: { _id: '$grade', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // 按状态统计
      Student.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const statistics = {
      total: totalStudents,
      byGrade: gradeStats,
      byStatus: statusStats
    };

    success(res, statistics, '获取统计信息成功');
  } catch (err) {
    console.error('获取统计信息错误:', err);
    error(res, '获取统计信息失败', 500);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStatistics
};
