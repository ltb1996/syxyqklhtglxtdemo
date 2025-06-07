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
      college = '',
      degree = '',
      status = '',
      class: className = ''
    } = req.query;

    // 构建查询条件
    const query = {};
    
    // 搜索条件 - 更新为大学生字段
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { studentId: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { college: searchRegex },
        { major: searchRegex },
        { class: searchRegex }
      ];
    }

    // 筛选条件 - 添加大学生特有的筛选
    if (grade) query.grade = grade;
    if (college) query.college = college;
    if (degree) query.degree = degree;
    if (status) query.status = status;
    if (className) query.class = className;

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

// 获取统计信息 - 更新为大学生统计
const getStatistics = async (req, res) => {
  try {
    console.log('开始获取统计信息...');
    
    const [
      totalStudents,
      gradeStats,
      collegeStats,
      degreeStats,
      statusStats,
      avgGpaResult,
      excellentStudents
    ] = await Promise.all([
      // 总学生数
      Student.countDocuments(),
      
      // 按年级统计
      Student.aggregate([
        { $group: { _id: '$grade', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // 按学院统计
      Student.aggregate([
        { $group: { _id: '$college', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // 按学历统计
      Student.aggregate([
        { $group: { _id: '$degree', count: { $sum: 1 } } }
      ]),
      
      // 按状态统计
      Student.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // 平均GPA
      Student.aggregate([
        { $match: { 'academicInfo.gpa': { $exists: true, $ne: null } } },
        { $group: { _id: null, avgGpa: { $avg: '$academicInfo.gpa' } } }
      ]),
      
      // 优秀学生数（GPA >= 3.7）
      Student.countDocuments({ 'academicInfo.gpa': { $gte: 3.7 } })
    ]);

    // 单独计算奖学金统计
    const scholarshipStudentsCount = await Student.countDocuments({
      'academicInfo.scholarships.0': { $exists: true }
    });

    // 按奖学金级别统计
    const scholarshipStats = await Student.aggregate([
      { $match: { 'academicInfo.scholarships.0': { $exists: true } } },
      { $unwind: '$academicInfo.scholarships' },
      { $group: { _id: '$academicInfo.scholarships.level', count: { $sum: 1 } } }
    ]);

    console.log('奖学金统计结果:', scholarshipStats);
    console.log('获奖学金学生数:', scholarshipStudentsCount);

    const statistics = {
      total: totalStudents,
      byGrade: gradeStats,
      byCollege: collegeStats,
      byDegree: degreeStats,
      byStatus: statusStats,
      avgGpa: avgGpaResult[0]?.avgGpa ? Number(avgGpaResult[0].avgGpa.toFixed(2)) : 0,
      excellentCount: excellentStudents,
      scholarshipStudentsCount, // 获得奖学金的学生总数
      scholarships: scholarshipStats.reduce((acc, item) => {
        if (item._id) {
          acc[item._id] = item.count;
        }
        return acc;
      }, {})
    };

    console.log('最终统计结果:', statistics);
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
