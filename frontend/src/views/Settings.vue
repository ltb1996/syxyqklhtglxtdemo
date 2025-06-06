<template>
  <div class="settings-page">
    <div class="settings-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1>系统设置</h1>
        <p>管理系统的基本配置和参数</p>
      </div>

      <!-- 设置选项卡 -->
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <div class="setting-section">
            <h3>系统信息</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label>系统名称</label>
                <el-input v-model="basicSettings.systemName" placeholder="学生信息管理系统" />
              </div>
              <div class="setting-item">
                <label>系统版本</label>
                <el-input v-model="basicSettings.version" disabled />
              </div>
              <div class="setting-item">
                <label>管理员邮箱</label>
                <el-input v-model="basicSettings.adminEmail" placeholder="admin@example.com" />
              </div>
              <div class="setting-item">
                <label>系统状态</label>
                <el-switch 
                  v-model="basicSettings.systemStatus" 
                  active-text="正常运行" 
                  inactive-text="维护中"
                />
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3>数据设置</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label>每页显示数量</label>
                <el-select v-model="basicSettings.pageSize">
                  <el-option label="10条" :value="10" />
                  <el-option label="20条" :value="20" />
                  <el-option label="50条" :value="50" />
                  <el-option label="100条" :value="100" />
                </el-select>
              </div>
              <div class="setting-item">
                <label>自动备份</label>
                <el-switch 
                  v-model="basicSettings.autoBackup" 
                  active-text="开启" 
                  inactive-text="关闭"
                />
              </div>
              <div class="setting-item">
                <label>数据保留天数</label>
                <el-input-number 
                  v-model="basicSettings.dataRetentionDays" 
                  :min="30" 
                  :max="365"
                  controls-position="right"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <div class="setting-section">
            <h3>登录安全</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label>会话超时时间(分钟)</label>
                <el-input-number 
                  v-model="securitySettings.sessionTimeout" 
                  :min="5" 
                  :max="480"
                  controls-position="right"
                />
              </div>
              <div class="setting-item">
                <label>最大登录尝试次数</label>
                <el-input-number 
                  v-model="securitySettings.maxLoginAttempts" 
                  :min="3" 
                  :max="10"
                  controls-position="right"
                />
              </div>
              <div class="setting-item">
                <label>强制使用强密码</label>
                <el-switch 
                  v-model="securitySettings.strongPassword" 
                  active-text="开启" 
                  inactive-text="关闭"
                />
              </div>
              <div class="setting-item">
                <label>双因子认证</label>
                <el-switch 
                  v-model="securitySettings.twoFactorAuth" 
                  active-text="开启" 
                  inactive-text="关闭"
                />
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3>数据安全</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label>数据加密</label>
                <el-switch 
                  v-model="securitySettings.dataEncryption" 
                  active-text="开启" 
                  inactive-text="关闭"
                />
              </div>
              <div class="setting-item">
                <label>API访问限制</label>
                <el-input-number 
                  v-model="securitySettings.apiRateLimit" 
                  :min="10" 
                  :max="1000"
                  controls-position="right"
                />
                <span class="setting-hint">每分钟最大请求数</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 通知设置 -->
        <el-tab-pane label="通知设置" name="notification">
          <div class="setting-section">
            <h3>邮件通知</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label>SMTP服务器</label>
                <el-input v-model="notificationSettings.smtpServer" placeholder="smtp.example.com" />
              </div>
              <div class="setting-item">
                <label>SMTP端口</label>
                <el-input-number 
                  v-model="notificationSettings.smtpPort" 
                  :min="1" 
                  :max="65535"
                  controls-position="right"
                />
              </div>
              <div class="setting-item">
                <label>发送邮箱</label>
                <el-input v-model="notificationSettings.senderEmail" placeholder="noreply@example.com" />
              </div>
              <div class="setting-item">
                <label>邮件通知</label>
                <el-switch 
                  v-model="notificationSettings.emailEnabled" 
                  active-text="开启" 
                  inactive-text="关闭"
                />
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3>系统通知</h3>
            <div class="notification-types">
              <div class="notification-item">
                <div class="notification-info">
                  <h4>新学生注册</h4>
                  <p>当有新学生注册时发送通知</p>
                </div>
                <el-switch v-model="notificationSettings.newStudentNotify" />
              </div>
              <div class="notification-item">
                <div class="notification-info">
                  <h4>系统维护</h4>
                  <p>系统维护前发送提醒通知</p>
                </div>
                <el-switch v-model="notificationSettings.maintenanceNotify" />
              </div>
              <div class="notification-item">
                <div class="notification-info">
                  <h4>数据备份</h4>
                  <p>数据备份完成后发送通知</p>
                </div>
                <el-switch v-model="notificationSettings.backupNotify" />
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 系统监控 -->
        <el-tab-pane label="系统监控" name="monitor">
          <div class="setting-section">
            <h3>系统状态</h3>
            <div class="status-grid">
              <div class="status-card">
                <div class="status-icon success">
                  <el-icon><CircleCheckFilled /></el-icon>
                </div>
                <div class="status-info">
                  <h4>数据库连接</h4>
                  <p>正常</p>
                </div>
              </div>
              <div class="status-card">
                <div class="status-icon success">
                  <el-icon><CircleCheckFilled /></el-icon>
                </div>
                <div class="status-info">
                  <h4>API服务</h4>
                  <p>运行中</p>
                </div>
              </div>
              <div class="status-card">
                <div class="status-icon warning">
                  <el-icon><WarningFilled /></el-icon>
                </div>
                <div class="status-info">
                  <h4>存储空间</h4>
                  <p>85% 已使用</p>
                </div>
              </div>
              <div class="status-card">
                <div class="status-icon success">
                  <el-icon><CircleCheckFilled /></el-icon>
                </div>
                <div class="status-info">
                  <h4>邮件服务</h4>
                  <p>正常</p>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3>系统日志</h3>
            <div class="log-section">
              <div class="log-filters">
                <el-select v-model="logLevel" placeholder="选择日志级别">
                  <el-option label="全部" value="all" />
                  <el-option label="错误" value="error" />
                  <el-option label="警告" value="warning" />
                  <el-option label="信息" value="info" />
                </el-select>
                <el-button type="primary" @click="refreshLogs">刷新日志</el-button>
                <el-button @click="clearLogs">清空日志</el-button>
              </div>
              <div class="log-content">
                <div v-for="log in systemLogs" :key="log.id" class="log-item">
                  <span :class="['log-level', log.level]">{{ log.level.toUpperCase() }}</span>
                  <span class="log-time">{{ log.time }}</span>
                  <span class="log-message">{{ log.message }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 保存按钮 -->
      <div class="save-section">
        <el-button type="primary" size="large" @click="saveSettings" :loading="saving">
          <el-icon><Check /></el-icon>
          保存设置
        </el-button>
        <el-button size="large" @click="resetSettings">
          <el-icon><Refresh /></el-icon>
          重置设置
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheckFilled, WarningFilled, Check, Refresh } from '@element-plus/icons-vue'

export default {
  name: 'Settings',
  components: {
    CircleCheckFilled, WarningFilled, Check, Refresh
  },
  setup() {
    const activeTab = ref('basic')
    const saving = ref(false)
    const logLevel = ref('all')
    
    const basicSettings = reactive({
      systemName: '学生信息管理系统',
      version: '1.0.0',
      adminEmail: 'admin@example.com',
      systemStatus: true,
      pageSize: 20,
      autoBackup: true,
      dataRetentionDays: 90
    })
    
    const securitySettings = reactive({
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      strongPassword: true,
      twoFactorAuth: false,
      dataEncryption: true,
      apiRateLimit: 100
    })
    
    const notificationSettings = reactive({
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      senderEmail: 'noreply@example.com',
      emailEnabled: true,
      newStudentNotify: true,
      maintenanceNotify: true,
      backupNotify: false
    })
    
    const systemLogs = ref([
      { id: 1, level: 'info', time: '2024-01-15 10:30:25', message: '系统启动成功' },
      { id: 2, level: 'info', time: '2024-01-15 10:35:12', message: '用户 admin 登录系统' },
      { id: 3, level: 'warning', time: '2024-01-15 11:20:45', message: '存储空间使用率达到85%' },
      { id: 4, level: 'info', time: '2024-01-15 12:00:00', message: '自动备份任务执行成功' },
      { id: 5, level: 'error', time: '2024-01-15 14:15:30', message: '邮件发送失败：连接超时' }
    ])
    
    const saveSettings = async () => {
      saving.value = true
      try {
        // 模拟保存设置
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('设置保存成功')
      } catch (error) {
        ElMessage.error('设置保存失败')
      } finally {
        saving.value = false
      }
    }
    
    const resetSettings = () => {
      ElMessage.info('设置已重置为默认值')
    }
    
    const refreshLogs = () => {
      ElMessage.success('日志已刷新')
    }
    
    const clearLogs = () => {
      systemLogs.value = []
      ElMessage.success('日志已清空')
    }
    
    return {
      activeTab,
      saving,
      logLevel,
      basicSettings,
      securitySettings,
      notificationSettings,
      systemLogs,
      saveSettings,
      resetSettings,
      refreshLogs,
      clearLogs
    }
  }
}
</script>

<style scoped>
.settings-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.settings-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-header h1 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #909399;
  font-size: 16px;
}

.settings-tabs {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.setting-section {
  margin-bottom: 40px;
}

.setting-section h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.setting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.setting-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.notification-types {
  space-y: 15px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.notification-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.notification-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.status-icon.success {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.status-icon.warning {
  background: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.status-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.status-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.log-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.log-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.log-content {
  max-height: 400px;
  overflow-y: auto;
  background: #2d3748;
  border-radius: 4px;
  padding: 15px;
}

.log-item {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.log-level {
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
}

.log-level.info {
  background: #409eff;
  color: white;
}

.log-level.warning {
  background: #e6a23c;
  color: white;
}

.log-level.error {
  background: #f56c6c;
  color: white;
}

.log-time {
  color: #a0aec0;
  min-width: 140px;
}

.log-message {
  color: #e2e8f0;
  flex: 1;
}

.save-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.save-section .el-button {
  margin: 0 10px;
}

@media (max-width: 768px) {
  .settings-page {
    padding: 10px;
  }
  
  .setting-grid {
    grid-template-columns: 1fr;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .notification-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .log-filters {
    flex-direction: column;
  }
}
</style>
