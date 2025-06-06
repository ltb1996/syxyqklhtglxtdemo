# 学生信息后台管理系统

## 项目简介
这是一个基于Node.js + MongoDB + Vue3的学生信息后台管理系统，主要用于管理学生的基本信息、学籍信息、成绩信息等。

## 技术栈
- **后端**: Node.js + Express.js + Mongoose
- **数据库**: MongoDB
- **前端**: Vue3 + Vite + Element Plus
- **开发工具**: Nodemon, ESLint, Prettier

## 项目结构 
syxyqklhtglxtdemo/
├── backend/ # 后端代码
│ ├── config/ # 配置文件
│ ├── controllers/ # 控制器
│ ├── middleware/ # 中间件
│ ├── models/ # 数据模型
│ ├── routes/ # 路由定义
│ ├── utils/ # 工具函数
│ ├── app.js # 应用入口
│ └── package.json # 依赖配置
├── frontend/ # 前端代码
│ ├── src/
│ │ ├── components/ # 组件
│ │ ├── views/ # 页面
│ │ ├── router/ # 路由
│ │ ├── store/ # 状态管理
│ │ ├── api/ # API接口
│ │ └── utils/ # 工具函数
│ ├── public/ # 静态资源
│ └── package.json # 依赖配置
└── README.md # 项目说明
```

## 功能特性

### 学生信息管理
- **基本信息**: 姓名、性别、年龄、身份证号、联系方式
- **学籍信息**: 学号、班级、专业、入学年份、学制
- **家庭信息**: 家长姓名、联系方式、家庭住址
- **照片管理**: 学生照片上传和管理

### 系统功能
- **用户认证**: 管理员登录、权限控制
- **数据操作**: 增删改查学生信息
- **数据导入导出**: Excel格式导入导出
- **搜索筛选**: 多条件搜索和筛选
- **分页显示**: 大数据量分页处理

## 开发计划

### 第一阶段：后端开发
1. 搭建Node.js + Express基础框架
2. 配置MongoDB数据库连接
3. 设计学生信息数据模型
4. 实现RESTful API接口
5. 添加用户认证和权限控制

### 第二阶段：前端开发
1. 搭建Vue3 + Vite项目结构
2. 配置Element Plus UI组件库
3. 实现登录页面和主界面
4. 开发学生信息管理模块
5. 对接后端API接口

## 安装和运行

### 后端启动
```bash
cd backend
npm install
npm run dev
```

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

## API接口文档

### 学生信息接口
- `GET /api/students` - 获取学生列表
- `GET /api/students/:id` - 获取单个学生信息
- `POST /api/students` - 创建学生信息
- `PUT /api/students/:id` - 更新学生信息
- `DELETE /api/students/:id` - 删除学生信息

### 用户认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/profile` - 获取用户信息

## 开发注意事项
1. 所有接口都有完整的错误处理和日志记录
2. 数据库操作使用事务确保数据一致性
3. 前端使用响应式设计，支持多种设备
4. 代码遵循ESLint规范，保持良好的代码风格

## 版本历史
- v1.0.0 - 初始版本，基本的学生信息管理功能
│ │ ├── views/ # 页面
│ │ ├── router/ # 路由
│ │ ├── store/ # 状态管理
│ │ ├── api/ # API接口
│ │ └── utils/ # 工具函数
│ ├── public/ # 静态资源
│ └── package.json # 依赖配置
└── README.md # 项目说明