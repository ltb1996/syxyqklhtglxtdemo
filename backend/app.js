const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// 导入数据库连接
const connectDB = require('./config/database');

// 创建Express应用
const app = express();

// 连接数据库
connectDB();

// 安全中间件
app.use(helmet());

// 跨域配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:5173', // Vue开发服务器的默认端口
  credentials: true
}));

// 限流配置
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP最多100个请求
  message: '请求过于频繁，请稍后再试'
});
app.use(limiter);

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 基础路由 - 健康检查
app.get('/', (req, res) => {
  res.json({
    message: '学生信息管理系统API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));

// 404处理
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  });
});

// 全局错误处理中间件
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📡 API地址: http://localhost:${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV}`);
});

module.exports = app;
