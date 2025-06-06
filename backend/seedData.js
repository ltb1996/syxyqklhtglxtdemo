const mongoose = require('mongoose');
const Student = require('./models/Student');
require('dotenv').config();

/**
 * 创建测试学生数据
 */
const createTestStudents = async () => {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ 数据库连接成功');

    // 测试学生数据
    const testStudents = [
      {
        name: '张三',
        gender: '男',
        birthday: new Date('2010-05-15'),
        idCard: '123456789012345678',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        address: '北京市朝阳区',
        studentId: '2023001001',
        grade: '三年级',
        class: '三年级一班',
        major: '普通教育',
        enrollmentYear: 2021,
        status: '在读',
        parentInfo: {
          fatherName: '张父',
          fatherPhone: '13800138002',
          motherName: '张母',
          motherPhone: '13800138003',
          homeAddress: '北京市朝阳区某小区'
        },
        notes: '表现优秀的学生'
      },
      {
        name: '李四',
        gender: '女',
        birthday: new Date('2011-03-20'),
        idCard: '123456789012345679',
        phone: '13800138004',
        studentId: '2023001002',
        grade: '二年级',
        class: '二年级二班',
        enrollmentYear: 2022,
        status: '在读',
        parentInfo: {
          fatherName: '李父',
          fatherPhone: '13800138005',
          motherName: '李母',
          motherPhone: '13800138006'
        }
      }
    ];

    // 检查是否已有测试数据
    const existingCount = await Student.countDocuments();
    if (existingCount > 0) {
      console.log('⚠️ 数据库中已有学生数据，跳过创建测试数据');
      return;
    }

    // 创建测试学生
    await Student.insertMany(testStudents);
    console.log('🎉 测试学生数据创建成功!');
    console.log(`📊 已创建 ${testStudents.length} 条学生记录`);

  } catch (error) {
    console.error('❌ 创建测试数据失败:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 数据库连接已关闭');
    process.exit(0);
  }
};

createTestStudents();
