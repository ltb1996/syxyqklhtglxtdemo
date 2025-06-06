const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * 用户模型 - 用于管理员认证
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名是必填项'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名不能超过20个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱是必填项'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: '邮箱格式不正确'
    }
  },
  password: {
    type: String,
    required: [true, '密码是必填项'],
    minlength: [6, '密码至少6个字符'],
    select: false // 默认查询时不返回密码字段
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'operator'],
    default: 'operator'
  },
  name: {
    type: String,
    required: [true, '真实姓名是必填项'],
    trim: true,
    maxlength: [50, '姓名不能超过50个字符']
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  // 只有密码被修改时才进行加密
  if (!this.isModified('password')) return next();
  
  try {
    // 生成盐值并加密密码
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 实例方法：验证密码
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('密码验证失败');
  }
};

// 实例方法：更新最后登录时间
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
