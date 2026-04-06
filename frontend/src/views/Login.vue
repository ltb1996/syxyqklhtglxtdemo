<template>
  <div class="login-page">
    <div class="login-split-container">
      <!-- 左侧：品牌展示或插图 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <el-icon><School /></el-icon>
            </div>
            <span class="logo-text">Student Admin</span>
          </div>
          <h1 class="brand-title">Welcome to Student Management System</h1>
          <p class="brand-desc">A modern, efficient, and comprehensive solution for managing student information, academic records, and career development.</p>
        </div>
        <!-- 背景插图或纹理 -->
        <div class="brand-illustration">
          <img src="../assets/bg.png" alt="System Illustration" class="hero-image" />
        </div>
      </div>
      
      <!-- 右侧：登录表单 -->
      <div class="form-section">
        <div class="form-container">
          <div class="form-header">
            <h2>Sign in to your account</h2>
            <p>Please enter your credentials to access the system.</p>
          </div>

          <el-form 
            :model="loginForm" 
            :rules="rules" 
            ref="loginFormRef" 
            class="modern-login-form"
            label-position="top"
          >
            <el-form-item prop="username" label="Username">
              <el-input
                v-model="loginForm.username"
                placeholder="admin / user"
                class="modern-input"
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item prop="password" label="Password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="••••••"
                class="modern-input"
                @keyup.enter="handleLogin"
                show-password
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            
            <div class="form-options">
              <el-checkbox v-model="rememberMe" class="modern-checkbox">Remember me</el-checkbox>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>
            
            <el-button
              type="primary"
              class="primary-btn login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              Sign In
              <el-icon class="btn-icon-right"><Right /></el-icon>
            </el-button>
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
import { User, Lock, Right, School } from '@element-plus/icons-vue'

export default {
  name: 'Login',
  components: {
    User, Lock, Right, School
  },
  setup() {
    const router = useRouter()
    const loginFormRef = ref()
    const loading = ref(false)
    const rememberMe = ref(false)
    
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
      rememberMe,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

.login-split-container {
  display: flex;
  height: 100%;
  width: 100%;
}

/* 左侧品牌区 - 深色极其现代感的设计 */
.brand-section {
  flex: 1;
  background-color: #111827;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 48px;
}

.brand-content {
  position: relative;
  z-index: 10;
  max-width: 540px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 64px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background-color: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.brand-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0 0 24px 0;
  color: #f9fafb;
}

.brand-desc {
  font-size: 18px;
  line-height: 1.6;
  color: #9ca3af;
  margin: 0;
  max-width: 480px;
}

.brand-illustration {
  position: absolute;
  right: -10%;
  bottom: -10%;
  width: 80%;
  height: auto;
  opacity: 0.6;
  z-index: 1;
  pointer-events: none;
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* 右侧表单区 */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 24px;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h2 {
  margin: 0 0 8px 0;
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
}

.form-header p {
  margin: 0;
  font-size: 15px;
  color: #6b7280;
}

.modern-login-form :deep(.el-form-item__label) {
  padding-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.modern-login-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.modern-input :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 8px 16px;
  transition: all 0.2s;
}
.modern-input :deep(.el-input__wrapper:hover),
.modern-input :deep(.el-input__wrapper.is-focus) {
  border-color: #111827;
  box-shadow: 0 0 0 1px #111827;
}

.modern-input :deep(.el-input__inner) {
  height: 28px; /* makes total height larger due to padding */
  font-size: 15px;
}
.modern-input :deep(.el-input__prefix) {
  color: #9ca3af;
  margin-right: 8px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  margin-top: -8px;
}

.modern-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #111827;
  border-color: #111827;
}
.modern-checkbox :deep(.el-checkbox__label) {
  color: #4b5563;
  font-size: 14px;
}

.forgot-link {
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-link:hover {
  color: #2563eb;
}

/* 按钮 */
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-btn {
  background-color: #111827;
  border-color: #111827;
  color: white;
  border-radius: 8px;
  font-weight: 500;
}
.primary-btn:hover, .primary-btn:focus {
  background-color: #374151;
  border-color: #374151;
  color: white;
}

.btn-icon-right {
  margin-left: 4px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .brand-title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .login-split-container {
    flex-direction: column;
  }
  
  .brand-section {
    flex: none;
    height: 240px;
    padding: 32px 24px;
    justify-content: center;
  }
  
  .logo-wrapper {
    margin-bottom: 16px;
  }
  
  .brand-title {
    font-size: 28px;
    margin-bottom: 8px;
  }
  
  .brand-desc {
    display: none; /* 在移动端隐藏过长的描述 */
  }
  
  .brand-illustration {
    display: none; /* 移动端隐藏背景图，保持简洁 */
  }
  
  .form-section {
    flex: 1;
    align-items: flex-start;
    padding-top: 48px;
  }
  
  .form-container {
    max-width: 100%;
    padding: 0 16px;
  }
}
</style>
