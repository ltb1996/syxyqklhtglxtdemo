<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-illustration">
        <el-icon size="120" color="#409eff"><Warning /></el-icon>
      </div>
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在或已被删除。</p>
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button size="large" @click="goBack">
          <el-icon><Back /></el-icon>
          返回上页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { Warning, House, Back } from '@element-plus/icons-vue'

export default {
  name: 'NotFound',
  components: {
    Warning, House, Back
  },
  setup() {
    const router = useRouter()
    
    const goHome = () => {
      router.push('/dashboard')
    }
    
    const goBack = () => {
      router.go(-1)
    }
    
    return {
      goHome,
      goBack
    }
  }
}
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  padding: 40px;
}

.error-illustration {
  margin-bottom: 30px;
}

h1 {
  font-size: 72px;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

h2 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

p {
  font-size: 18px;
  margin: 0 0 40px 0;
  opacity: 0.9;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

@media (max-width: 768px) {
  .not-found-content {
    padding: 20px;
  }
  
  h1 {
    font-size: 48px;
  }
  
  h2 {
    font-size: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
