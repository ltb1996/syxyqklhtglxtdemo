const mongoose = require('mongoose');
require('dotenv').config();

/**
 * 数据库连接配置
 * 连接到MongoDB数据库并配置连接选项
 */
const connectDB = async () => {
  try {
    // 设置mongoose连接选项（移除了不支持的选项）
    const options = {
      maxPoolSize: 10, // 最大连接池大小
      serverSelectionTimeoutMS: 5000, // 服务器选择超时时间
      socketTimeoutMS: 45000, // Socket超时时间
    };

    // 连接数据库
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB连接成功: ${conn.connection.host}`);
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB连接错误:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB连接断开');
    });

    // 优雅关闭数据库连接
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔐 MongoDB连接已关闭');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
