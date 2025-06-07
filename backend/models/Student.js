const mongoose = require('mongoose');

/**
 * 大学生信息数据模型
 * 包含大学生的基本信息、学籍信息、学术信息、就业信息等
 */
const studentSchema = new mongoose.Schema({
  // 基本信息
  name: {
    type: String,
    required: [true, '姓名是必填项'],
    trim: true,
    maxlength: [50, '姓名不能超过50个字符']
  },
  gender: {
    type: String,
    required: [true, '性别是必填项'],
    enum: ['男', '女'],
    default: '男'
  },
  birthday: {
    type: Date,
    required: [true, '出生日期是必填项'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: '出生日期不能是未来时间'
    }
  },
  idCard: {
    type: String,
    required: [true, '身份证号是必填项'],
    unique: true,
    validate: {
      validator: function(idCard) {
        return /^\d{17}[\dXx]$/.test(idCard);
      },
      message: '身份证号格式不正确'
    }
  },
  phone: {
    type: String,
    required: [true, '联系电话是必填项'],
    validate: {
      validator: function(phone) {
        return /^1[3-9]\d{9}$/.test(phone);
      },
      message: '手机号格式不正确'
    }
  },
  email: {
    type: String,
    required: [true, '邮箱是必填项'],
    lowercase: true,
    unique: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: '邮箱格式不正确'
    }
  },
  nationality: {
    type: String,
    default: '中国',
    maxlength: [50, '国籍不能超过50个字符']
  },
  politicalStatus: {
    type: String,
    enum: ['群众', '共青团员', '中共党员', '中共预备党员', '民主党派', '其他'],
    default: '群众'
  },

  // 学籍信息
  studentId: {
    type: String,
    required: [true, '学号是必填项'],
    unique: true,
    validate: {
      validator: function(studentId) {
        // 大学学号格式验证（例如：2023010101）
        return /^\d{10}$/.test(studentId);
      },
      message: '学号格式不正确，应为10位数字'
    }
  },
  college: {
    type: String,
    required: [true, '学院是必填项'],
    maxlength: [100, '学院名称不能超过100个字符']
  },
  major: {
    type: String,
    required: [true, '专业是必填项'],
    maxlength: [100, '专业名称不能超过100个字符']
  },
  class: {
    type: String,
    required: [true, '班级是必填项'],
    maxlength: [50, '班级名称不能超过50个字符']
  },
  grade: {
    type: String,
    required: [true, '年级是必填项'],
    enum: ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '博一', '博二', '博三', '博四']
  },
  degree: {
    type: String,
    required: [true, '学历层次是必填项'],
    enum: ['本科', '硕士', '博士']
  },
  enrollmentYear: {
    type: Number,
    required: [true, '入学年份是必填项'],
    min: [2000, '入学年份不能早于2000年'],
    max: [new Date().getFullYear(), '入学年份不能是未来年份']
  },
  expectedGraduationYear: {
    type: Number,
    required: [true, '预计毕业年份是必填项'],
    min: [2000, '毕业年份不能早于2000年']
  },
  status: {
    type: String,
    enum: ['在读', '休学', '退学', '毕业', '肄业', '延期毕业'],
    default: '在读'
  },
  dormitory: {
    building: {
      type: String,
      maxlength: [50, '宿舍楼不能超过50个字符']
    },
    room: {
      type: String,
      maxlength: [20, '宿舍房间号不能超过20个字符']
    }
  },

  // 学术信息
  academicInfo: {
    gpa: {
      type: Number,
      min: [0, 'GPA不能小于0'],
      max: [4.0, 'GPA不能大于4.0']
    },
    totalCredits: {
      type: Number,
      min: [0, '总学分不能小于0'],
      default: 0
    },
    completedCredits: {
      type: Number,
      min: [0, '已修学分不能小于0'],
      default: 0
    },
    rank: {
      type: Number,
      min: [1, '排名不能小于1']
    },
    totalStudents: {
      type: Number,
      min: [1, '总人数不能小于1']
    },
    scholarships: [{
      name: String,
      year: Number,
      amount: Number,
      level: {
        type: String,
        enum: ['国家级', '省级', '校级', '院级']
      }
    }],
    awards: [{
      name: String,
      year: Number,
      level: {
        type: String,
        enum: ['国家级', '省级', '校级', '院级']
      },
      description: String
    }]
  },

  // 家庭信息
  familyInfo: {
    fatherName: {
      type: String,
      maxlength: [50, '父亲姓名不能超过50个字符']
    },
    fatherOccupation: {
      type: String,
      maxlength: [100, '父亲职业不能超过100个字符']
    },
    fatherPhone: {
      type: String,
      validate: {
        validator: function(phone) {
          return !phone || /^1[3-9]\d{9}$/.test(phone);
        },
        message: '父亲联系电话格式不正确'
      }
    },
    motherName: {
      type: String,
      maxlength: [50, '母亲姓名不能超过50个字符']
    },
    motherOccupation: {
      type: String,
      maxlength: [100, '母亲职业不能超过100个字符']
    },
    motherPhone: {
      type: String,
      validate: {
        validator: function(phone) {
          return !phone || /^1[3-9]\d{9}$/.test(phone);
        },
        message: '母亲联系电话格式不正确'
      }
    },
    familyIncome: {
      type: String,
      enum: ['贫困', '一般', '中等', '较好', '优越']
    },
    homeAddress: {
      province: String,
      city: String,
      district: String,
      detail: String
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    }
  },

  // 就业信息
  careerInfo: {
    internships: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      description: String
    }],
    jobIntention: {
      industry: String,
      position: String,
      location: String,
      expectedSalary: String
    },
    skills: [String],
    certifications: [{
      name: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date
    }],
    languages: [{
      language: String,
      level: {
        type: String,
        enum: ['初级', '中级', '高级', '母语']
      },
      certificate: String
    }]
  },

  // 其他信息
  avatar: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    maxlength: [1000, '备注不能超过1000个字符']
  },
  tags: [String] // 标签，如：优秀学生、学生干部、特长生等
}, {
  timestamps: true,
  versionKey: false
});

// 创建索引
studentSchema.index({ studentId: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ college: 1, major: 1 });
studentSchema.index({ grade: 1, class: 1 });
studentSchema.index({ enrollmentYear: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ 'academicInfo.gpa': -1 });

// 虚拟字段：计算年龄
studentSchema.virtual('age').get(function() {
  if (!this.birthday) return null;
  const today = new Date();
  const birthDate = new Date(this.birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// 虚拟字段：计算学习进度
studentSchema.virtual('studyProgress').get(function() {
  if (!this.academicInfo?.totalCredits || !this.academicInfo?.completedCredits) return 0;
  return Math.round((this.academicInfo.completedCredits / this.academicInfo.totalCredits) * 100);
});

// 确保虚拟字段被序列化
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

// 实例方法：获取完整地址
studentSchema.methods.getFullAddress = function() {
  const addr = this.familyInfo?.homeAddress;
  if (!addr) return '';
  return `${addr.province || ''}${addr.city || ''}${addr.district || ''}${addr.detail || ''}`;
};

// 静态方法：按学院统计学生数量
studentSchema.statics.getStatsByCollege = function() {
  return this.aggregate([
    { $group: { _id: '$college', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
