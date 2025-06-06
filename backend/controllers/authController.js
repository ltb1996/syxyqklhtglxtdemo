const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');

/**
 * 用户认证控制器
 * 处理登录、注册、用户信息等功能
 */

// 用户登录
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户（包含密码字段）
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    }).select('+password');

    if (!user) {
      return error(res, '用户名或密码错误', 401);
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return error(res, '账户已被禁用，请联系管理员', 401);
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return error(res, '用户名或密码错误', 401);
    }

    // 生成JWT token
    const token = generateToken({
      id: user._id,
      username: user.username,
      role: user.role
    });

    // 更新最后登录时间
    await user.updateLastLogin();

    // 返回用户信息（不包含密码）
    const userInfo = {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      lastLogin: user.lastLogin
    };

    success(res, {
      token,
      user: userInfo
    }, '登录成功');

  } catch (err) {
    console.error('登录错误:', err);
    error(res, '登录失败，请稍后重试', 500);
  }
};

// 获取当前用户信息
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    const userInfo = {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    success(res, userInfo, '获取用户信息成功');
  } catch (err) {
    console.error('获取用户信息错误:', err);
    error(res, '获取用户信息失败', 500);
  }
};

// 更新用户信息
const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return error(res, '用户不存在', 404);
    }

    success(res, user, '用户信息更新成功');
  } catch (err) {
    console.error('更新用户信息错误:', err);
    error(res, err.message || '更新用户信息失败', 500);
  }
};

// 修改密码
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    // 获取用户（包含密码）
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return error(res, '用户不存在', 404);
    }

    // 验证旧密码
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return error(res, '原密码错误', 400);
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    success(res, null, '密码修改成功');
  } catch (err) {
    console.error('修改密码错误:', err);
    error(res, err.message || '修改密码失败', 500);
  }
};

// 用户登出
const logout = async (req, res) => {
  try {
    // 在实际应用中，这里可以将token加入黑名单
    // 现在只是返回成功响应
    success(res, null, '登出成功');
  } catch (err) {
    console.error('登出错误:', err);
    error(res, '登出失败', 500);
  }
};

module.exports = {
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
};
