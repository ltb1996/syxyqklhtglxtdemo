<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-illustration">
        <el-icon class="warning-icon">
          <Warning />
        </el-icon>
      </div>
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-desc">抱歉，您访问的页面不存在或已被移动。</p>
      <div class="action-buttons">
        <el-button class="secondary-btn" size="large" @click="goBack">
          返回上页
        </el-button>
        <el-button type="primary" class="primary-btn" size="large" @click="goHome">
          返回首页
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
.not-found-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
}

.not-found-content {
  text-align: center;
  max-width: 480px;
  padding: 40px 20px;
}

.error-illustration {
  margin-bottom: 32px;
}

.warning-icon {
  font-size: 48px;
  color: #9ca3af;
  background-color: #f3f4f6;
  padding: 24px;
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

.error-code {
  font-size: 96px;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: #111827;
  line-height: 1;
  letter-spacing: -0.04em;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #374151;
  letter-spacing: -0.01em;
}

.error-desc {
  font-size: 16px;
  margin: 0 0 40px 0;
  color: #6b7280;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 按钮样式复用之前的现代化设计 */
.primary-btn {
  background-color: #111827;
  border-color: #111827;
  color: white;
  border-radius: 8px;
  font-weight: 500;
}

.primary-btn:hover {
  background-color: #374151;
  border-color: #374151;
  color: white;
}

.secondary-btn {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 8px;
  font-weight: 500;
}

.secondary-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

@media (max-width: 640px) {
  .error-code {
    font-size: 72px;
  }

  .error-title {
    font-size: 20px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons .el-button {
    margin-left: 0;
  }
}
</style>
