const mongoose = require('mongoose');

/**
 * 学生信息数据模型
 * 包含学生的基本信息、学籍信息、家庭信息等
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
        // 简单的身份证号验证（18位）
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
    lowercase: true,
    validate: {
      validator: function(email) {
        return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: '邮箱格式不正确'
    }
  },
  address: {
    type: String,
    maxlength: [200, '地址不能超过200个字符']
  },

  // 学籍信息
  studentId: {
    type: String,
    required: [true, '学号是必填项'],
    unique: true,
    validate: {
      validator: function(studentId) {
        // 学号格式验证（例如：2023001001）
        return /^\d{10}$/.test(studentId);
      },
      message: '学号格式不正确，应为10位数字'
    }
  },
  grade: {
    type: String,
    required: [true, '年级是必填项'],
    enum: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
  },
  class: {
    type: String,
    required: [true, '班级是必填项'],
    maxlength: [20, '班级名称不能超过20个字符']
  },
  major: {
    type: String,
    maxlength: [50, '专业名称不能超过50个字符']
  },
  enrollmentYear: {
    type: Number,
    required: [true, '入学年份是必填项'],
    min: [2000, '入学年份不能早于2000年'],
    max: [new Date().getFullYear(), '入学年份不能是未来年份']
  },
  status: {
    type: String,
    enum: ['在读', '休学', '退学', '毕业'],
    default: '在读'
  },

  // 家庭信息
  parentInfo: {
    fatherName: {
      type: String,
      maxlength: [50, '父亲姓名不能超过50个字符']
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
    motherPhone: {
      type: String,
      validate: {
        validator: function(phone) {
          return !phone || /^1[3-9]\d{9}$/.test(phone);
        },
        message: '母亲联系电话格式不正确'
      }
    },
    emergencyContact: {
      type: String,
      maxlength: [50, '紧急联系人姓名不能超过50个字符']
    },
    emergencyPhone: {
      type: String,
      validate: {
        validator: function(phone) {
          return !phone || /^1[3-9]\d{9}$/.test(phone);
        },
        message: '紧急联系电话格式不正确'
      }
    },
    homeAddress: {
      type: String,
      maxlength: [200, '家庭住址不能超过200个字符']
    }
  },

  // 其他信息
  avatar: {
    type: String, // 存储头像文件路径
    default: ''
  },
  notes: {
    type: String,
    maxlength: [500, '备注不能超过500个字符']
  }
}, {
  timestamps: true, // 自动添加createdAt和updatedAt字段
  versionKey: false // 去除__v字段
});

// 创建索引以提高查询性能
studentSchema.index({ studentId: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ grade: 1, class: 1 });
studentSchema.index({ enrollmentYear: 1 });

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

// 确保虚拟字段被序列化
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
