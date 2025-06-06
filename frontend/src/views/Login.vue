<template>
  <div class="login-container">
    <div class="login-content">
      <!-- 左侧插图区域 -->
      <div class="illustration-section">
        <div class="illustration">
          <!-- 这里可以放置SVG插图或使用背景图 -->
          <img src="../assets/bg.png" alt="登录插图" class="bg-image" />
        </div>
      </div>
      
      <!-- 右侧登录表单区域 -->
      <div class="login-section">
        <div class="login-box">
          <!-- Logo和标题 -->
          <div class="login-header">
            <div class="logo">
              <span class="logo-icon">📚</span>
              <span class="logo-text">学生管理系统</span>
            </div>
            <h2>Geeker-Admin</h2>
          </div>

          <!-- 登录表单 -->
          <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0" class="login-form">
            <el-form-item prop="username">
              <div class="input-wrapper">
                <el-icon class="input-icon"><User /></el-icon>
                <el-input
                  v-model="loginForm.username"
                  placeholder="用户名：admin / user"
                  size="large"
                  class="custom-input"
                />
              </div>
            </el-form-item>
            
            <el-form-item prop="password">
              <div class="input-wrapper">
                <el-icon class="input-icon"><Lock /></el-icon>
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="密码：123456"
                  size="large"
                  class="custom-input"
                  @keyup.enter="handleLogin"
                  show-password
                />
              </div>
            </el-form-item>
            
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="login-btn"
                :loading="loading"
                @click="handleLogin"
              >
                <el-icon><Right /></el-icon>
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '../api'
import { User, Lock, Right } from '@element-plus/icons-vue'

export default {
  name: 'Login',
  components: {
    User, Lock, Right
  },
  setup() {
    const router = useRouter()
    const loginFormRef = ref()
    const loading = ref(false)
    
    const loginForm = reactive({
      username: 'admin',
      password: '123456'
    })
    
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    }
    
    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      await loginFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            const response = await login(loginForm)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            ElMessage.success('登录成功')
            router.push('/dashboard')
          } catch (error) {
            ElMessage.error(error.message || '登录失败')
          } finally {
            loading.value = false
          }
        }
      })
    }
    
    return {
      loginForm,
      rules,
      loginFormRef,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.login-content {
  width: 90%;
  max-width: 1200px;
  height: 80%;
  max-height: 600px;
  min-height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  overflow: hidden;
}

/* 左侧插图区域 */
.illustration-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.illustration {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: brightness(1.1);
}

/* 右侧登录区域 */
.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
}

.login-box {
  width: 100%;
  max-width: 400px;
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 12px;
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.login-header h2 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  letter-spacing: -0.5px;
}

/* 登录表单 */
.login-form {
  width: 100%;
}

.login-form .el-form-item {
  margin-bottom: 24px;
  width: 100%;
}

.login-form .el-form-item :deep(.el-form-item__content) {
  width: 100%;
}

.input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  z-index: 10;
  color: #909399;
  font-size: 16px;
}

.custom-input {
  width: 100% !important;
}

.custom-input :deep(.el-input__wrapper) {
  width: 100% !important;
  padding-left: 45px;
  height: 50px;
  border-radius: 12px;
  border: 2px solid #e4e7ed;
  box-shadow: none;
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.custom-input :deep(.el-input__inner) {
  font-size: 15px;
  color: #303133;
  width: 100% !important;
}

.custom-input :deep(.el-input__inner::placeholder) {
  color: #c0c4cc;
  font-size: 14px;
}

/* 登录按钮 */
.login-btn {
  width: 100% !important;
  height: 50px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn :deep(.el-icon) {
  margin-right: 8px;
}

/* 确保表单项内容完全对齐 */
.login-form .el-form-item:deep(.el-form-item__content) {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-content {
    width: 95%;
    height: 90%;
    flex-direction: column;
    max-width: 400px;
  }
  
  .illustration-section {
    height: 200px;
    flex: none;
  }
  
  .login-section {
    padding: 30px 20px;
    flex: 1;
  }
  
  .login-header h2 {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-content {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  
  .illustration-section {
    height: 150px;
  }
  
  .login-section {
    flex: 1;
    padding: 20px;
  }
}
</style>