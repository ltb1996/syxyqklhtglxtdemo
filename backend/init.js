const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
require('dotenv').config();

/**
 * 初始化脚本 - 创建默认管理员用户和大学生测试数据
 */
const initializeData = async () => {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ 数据库连接成功');

    // 检查是否已存在管理员用户
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (!existingAdmin) {
      // 创建默认管理员用户
      const adminUser = new User({
        username: 'admin',
        email: 'admin@university.edu.cn',
        password: '123456',
        name: '系统管理员',
        role: 'admin',
        status: 'active'
      });

      await adminUser.save();
      console.log('✅ 管理员用户创建成功');
      console.log('📋 登录信息：');
      console.log('   用户名: admin');
      console.log('   密码: 123456');
    } else {
      console.log('⚠️ 管理员用户已存在:', existingAdmin.username);
    }

    // 检查是否已存在学生数据
    const existingStudents = await Student.countDocuments();
    
    if (existingStudents === 0) {
      // 创建大学生测试数据
      const testStudents = [
        {
          name: '张三',
          gender: '男',
          birthday: new Date('2002-03-15'),
          idCard: '110101200203150001',
          phone: '13800138001',
          email: 'zhangsan@student.university.edu.cn',
          nationality: '中国',
          politicalStatus: '共青团员',
          studentId: '2021010101',
          college: '计算机科学与技术学院',
          major: '计算机科学与技术',
          class: '计科2101班',
          grade: '大三',
          degree: '本科',
          enrollmentYear: 2021,
          expectedGraduationYear: 2025,
          status: '在读',
          dormitory: {
            building: '1号楼',
            room: '301'
          },
          academicInfo: {
            gpa: 3.8,
            totalCredits: 160,
            completedCredits: 120,
            rank: 5,
            totalStudents: 120,
            scholarships: [
              {
                name: '国家励志奖学金',
                year: 2022,
                amount: 5000,
                level: '国家级'
              }
            ],
            awards: [
              {
                name: '优秀学生干部',
                year: 2022,
                level: '校级',
                description: '担任班长期间表现优秀'
              }
            ]
          },
          familyInfo: {
            fatherName: '张建国',
            fatherOccupation: '工程师',
            fatherPhone: '13900139001',
            motherName: '李美华',
            motherOccupation: '教师',
            motherPhone: '13900139002',
            familyIncome: '中等',
            homeAddress: {
              province: '北京市',
              city: '北京市',
              district: '海淀区',
              detail: '中关村大街1号'
            },
            emergencyContact: {
              name: '张建国',
              relationship: '父亲',
              phone: '13900139001'
            }
          },
          careerInfo: {
            internships: [
              {
                company: '腾讯科技',
                position: '前端开发实习生',
                startDate: new Date('2023-07-01'),
                endDate: new Date('2023-08-31'),
                description: '参与微信小程序开发'
              }
            ],
            jobIntention: {
              industry: '互联网',
              position: '前端工程师',
              location: '北京',
              expectedSalary: '15-20K'
            },
            skills: ['JavaScript', 'Vue.js', 'React', 'Node.js', 'Python'],
            certifications: [
              {
                name: '全国计算机等级考试二级',
                issuer: '教育部考试中心',
                issueDate: new Date('2022-06-01')
              }
            ],
            languages: [
              {
                language: '英语',
                level: '高级',
                certificate: 'CET-6'
              }
            ]
          },
          tags: ['优秀学生', '学生干部', '技术达人']
        },
        {
          name: '李四',
          gender: '女',
          birthday: new Date('2001-08-20'),
          idCard: '110101200108200002',
          phone: '13800138002',
          email: 'lisi@student.university.edu.cn',
          nationality: '中国',
          politicalStatus: '中共党员',
          studentId: '2020020201',
          college: '经济管理学院',
          major: '工商管理',
          class: '工商2001班',
          grade: '大四',
          degree: '本科',
          enrollmentYear: 2020,
          expectedGraduationYear: 2024,
          status: '在读',
          dormitory: {
            building: '2号楼',
            room: '205'
          },
          academicInfo: {
            gpa: 3.9,
            totalCredits: 160,
            completedCredits: 150,
            rank: 2,
            totalStudents: 100,
            scholarships: [
              {
                name: '国家奖学金',
                year: 2022,
                amount: 8000,
                level: '国家级'
              },
              {
                name: '校级一等奖学金',
                year: 2021,
                amount: 3000,
                level: '校级'
              }
            ],
            awards: [
              {
                name: '三好学生',
                year: 2022,
                level: '校级',
                description: '品学兼优，全面发展'
              }
            ]
          },
          familyInfo: {
            fatherName: '李国强',
            fatherOccupation: '企业家',
            fatherPhone: '13900139003',
            motherName: '王丽娟',
            motherOccupation: '会计师',
            motherPhone: '13900139004',
            familyIncome: '较好',
            homeAddress: {
              province: '上海市',
              city: '上海市',
              district: '浦东新区',
              detail: '陆家嘴金融区'
            },
            emergencyContact: {
              name: '李国强',
              relationship: '父亲',
              phone: '13900139003'
            }
          },
          careerInfo: {
            internships: [
              {
                company: '德勤咨询',
                position: '管理咨询实习生',
                startDate: new Date('2023-06-01'),
                endDate: new Date('2023-08-31'),
                description: '参与企业战略咨询项目'
              }
            ],
            jobIntention: {
              industry: '咨询',
              position: '管理咨询师',
              location: '上海',
              expectedSalary: '20-25K'
            },
            skills: ['数据分析', 'Excel', 'PowerPoint', '项目管理', 'SQL'],
            certifications: [
              {
                name: '初级会计师',
                issuer: '财政部',
                issueDate: new Date('2022-05-01')
              }
            ],
            languages: [
              {
                language: '英语',
                level: '高级',
                certificate: 'IELTS 7.5'
              }
            ]
          },
          tags: ['优秀学生', '学霸', '全面发展']
        },
        {
          name: '王五',
          gender: '男',
          birthday: new Date('2003-01-10'),
          idCard: '110101200301100003',
          phone: '13800138003',
          email: 'wangwu@student.university.edu.cn',
          nationality: '中国',
          politicalStatus: '共青团员',
          studentId: '2022030301',
          college: '机械工程学院',
          major: '机械设计制造及其自动化',
          class: '机械2201班',
          grade: '大二',
          degree: '本科',
          enrollmentYear: 2022,
          expectedGraduationYear: 2026,
          status: '在读',
          dormitory: {
            building: '3号楼',
            room: '408'
          },
          academicInfo: {
            gpa: 3.5,
            totalCredits: 160,
            completedCredits: 80,
            rank: 15,
            totalStudents: 80,
            scholarships: [],
            awards: [
              {
                name: '机械设计大赛三等奖',
                year: 2023,
                level: '校级',
                description: '创新设计作品获奖'
              }
            ]
          },
          familyInfo: {
            fatherName: '王建军',
            fatherOccupation: '工人',
            fatherPhone: '13900139005',
            motherName: '刘秀英',
            motherOccupation: '农民',
            motherPhone: '13900139006',
            familyIncome: '一般',
            homeAddress: {
              province: '河南省',
              city: '郑州市',
              district: '中原区',
              detail: '建设路100号'
            },
            emergencyContact: {
              name: '王建军',
              relationship: '父亲',
              phone: '13900139005'
            }
          },
          careerInfo: {
            internships: [],
            jobIntention: {
              industry: '制造业',
              position: '机械工程师',
              location: '郑州',
              expectedSalary: '8-12K'
            },
            skills: ['AutoCAD', 'SolidWorks', '机械制图', 'MATLAB'],
            certifications: [],
            languages: [
              {
                language: '英语',
                level: '中级',
                certificate: 'CET-4'
              }
            ]
          },
          tags: ['勤奋好学', '动手能力强']
        }
      ];

      await Student.insertMany(testStudents);
      console.log(`✅ 成功创建 ${testStudents.length} 条大学生测试数据`);
      
      // 显示创建的学生信息
      testStudents.forEach((student, index) => {
        console.log(`📚 学生${index + 1}: ${student.name} - ${student.college} - ${student.major} - ${student.grade}`);
      });
    } else {
      console.log(`⚠️ 已存在 ${existingStudents} 条学生数据`);
    }

    console.log('🎉 数据初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    process.exit(1);
  }
};

initializeData();
