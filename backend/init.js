const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

/**
 * 初始化脚本 - 创建默认管理员用户
 */
const initializeAdmin = async () => {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ 数据库连接成功');

    // 检查是否已存在管理员用户
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️ 管理员用户已存在:', existingAdmin.username);
      process.exit(0);
    }

    // 创建默认管理员用户
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: '123456', // 默认密码，首次登录后请修改
      name: '系统管理员',
      role: 'admin',
      status: 'active'
    });

    await adminUser.save();
    
    console.log('🎉 管理员用户创建成功!');
    console.log('📋 登录信息：');
    console.log('   用户名: admin');
    console.log('   邮箱: admin@example.com');
    console.log('   密码: 123456');
    console.log('⚠️ 请及时登录并修改默认密码！');

  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
  } finally {
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('🔐 数据库连接已关闭');
    process.exit(0);
  }
};

// 运行初始化
initializeAdmin();
