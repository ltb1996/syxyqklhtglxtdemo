<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">System Settings</h1>
        <p class="page-subtitle">Manage system configuration and global parameters</p>
      </div>
      <div class="header-actions">
        <el-button class="secondary-btn" @click="resetSettings">
          <el-icon>
            <Refresh />
          </el-icon>Reset Defaults
        </el-button>
        <el-button type="primary" class="primary-btn" @click="saveSettings" :loading="saving">
          <el-icon>
            <Check />
          </el-icon>Save Settings
        </el-button>
      </div>
    </div>

    <!-- 设置内容区 -->
    <div class="content-panel">
      <el-tabs v-model="activeTab" class="modern-tabs">
        <!-- 基本设置 -->
        <el-tab-pane label="Basic Settings" name="basic">
          <div class="setting-group">
            <h3 class="group-title">System Information</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label class="setting-label">System Name</label>
                <el-input v-model="basicSettings.systemName" placeholder="Enter system name" class="modern-input" />
              </div>
              <div class="setting-item">
                <label class="setting-label">Version</label>
                <el-input v-model="basicSettings.version" disabled class="modern-input is-readonly" />
              </div>
              <div class="setting-item">
                <label class="setting-label">Admin Email</label>
                <el-input v-model="basicSettings.adminEmail" placeholder="admin@example.com" class="modern-input" />
              </div>
              <div class="setting-item">
                <label class="setting-label">System Status</label>
                <div class="setting-control-row">
                  <el-switch v-model="basicSettings.systemStatus" class="modern-switch" />
                  <span class="status-text" :class="basicSettings.systemStatus ? 'text-success' : 'text-warning'">
                    {{ basicSettings.systemStatus ? 'Active' : 'Maintenance Mode' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-group">
            <h3 class="group-title">Data Preferences</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label class="setting-label">Items Per Page</label>
                <el-select v-model="basicSettings.pageSize" class="modern-input" style="width: 100%">
                  <el-option label="10 Items" :value="10" />
                  <el-option label="20 Items" :value="20" />
                  <el-option label="50 Items" :value="50" />
                  <el-option label="100 Items" :value="100" />
                </el-select>
              </div>
              <div class="setting-item">
                <label class="setting-label">Data Retention (Days)</label>
                <el-input-number v-model="basicSettings.dataRetentionDays" :min="30" :max="365"
                  controls-position="right" class="modern-input-number" style="width: 100%" />
              </div>
              <div class="setting-item">
                <label class="setting-label">Automatic Backup</label>
                <div class="setting-control-row">
                  <el-switch v-model="basicSettings.autoBackup" class="modern-switch" />
                  <span class="setting-desc">Run daily database backups automatically</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="Security" name="security">
          <div class="setting-group">
            <h3 class="group-title">Authentication & Access</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label class="setting-label">Session Timeout (Minutes)</label>
                <el-input-number v-model="securitySettings.sessionTimeout" :min="5" :max="480" controls-position="right"
                  class="modern-input-number" style="width: 100%" />
              </div>
              <div class="setting-item">
                <label class="setting-label">Max Login Attempts</label>
                <el-input-number v-model="securitySettings.maxLoginAttempts" :min="3" :max="10"
                  controls-position="right" class="modern-input-number" style="width: 100%" />
              </div>
              <div class="setting-item">
                <label class="setting-label">Require Strong Passwords</label>
                <div class="setting-control-row">
                  <el-switch v-model="securitySettings.strongPassword" class="modern-switch" />
                  <span class="setting-desc">Enforce uppercase, numbers, and symbols</span>
                </div>
              </div>
              <div class="setting-item">
                <label class="setting-label">Two-Factor Authentication (2FA)</label>
                <div class="setting-control-row">
                  <el-switch v-model="securitySettings.twoFactorAuth" class="modern-switch" />
                  <span class="setting-desc">Require OTP code upon login</span>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-group">
            <h3 class="group-title">Data & API Protection</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label class="setting-label">API Rate Limit (Req / Min)</label>
                <el-input-number v-model="securitySettings.apiRateLimit" :min="10" :max="1000" controls-position="right"
                  class="modern-input-number" style="width: 100%" />
              </div>
              <div class="setting-item">
                <label class="setting-label">Database Encryption</label>
                <div class="setting-control-row">
                  <el-switch v-model="securitySettings.dataEncryption" class="modern-switch" />
                  <span class="setting-desc">Encrypt sensitive PII data at rest</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 通知设置 -->
        <el-tab-pane label="Notifications" name="notification">
          <div class="setting-group">
            <h3 class="group-title">SMTP Configuration</h3>
            <div class="setting-grid">
              <div class="setting-item">
                <label class="setting-label">SMTP Server</label>
                <el-input v-model="notificationSettings.smtpServer" placeholder="smtp.example.com"
                  class="modern-input" />
              </div>
              <div class="setting-item">
                <label class="setting-label">SMTP Port</label>
                <el-input-number v-model="notificationSettings.smtpPort" :min="1" :max="65535" controls-position="right"
                  class="modern-input-number" style="width: 100%" />
              </div>
              <div class="setting-item">
                <label class="setting-label">Sender Email Address</label>
                <el-input v-model="notificationSettings.senderEmail" placeholder="noreply@example.com"
                  class="modern-input" />
              </div>
              <div class="setting-item">
                <label class="setting-label">Enable Email Notifications</label>
                <div class="setting-control-row">
                  <el-switch v-model="notificationSettings.emailEnabled" class="modern-switch" />
                </div>
              </div>
            </div>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-group">
            <h3 class="group-title">System Event Triggers</h3>
            <div class="event-list">
              <div class="event-item">
                <div class="event-info">
                  <h4>New Student Registration</h4>
                  <p>Send an alert when a new student profile is created.</p>
                </div>
                <el-switch v-model="notificationSettings.newStudentNotify" class="modern-switch" />
              </div>
              <div class="event-item">
                <div class="event-info">
                  <h4>System Maintenance</h4>
                  <p>Send an alert to all admins before scheduled maintenance.</p>
                </div>
                <el-switch v-model="notificationSettings.maintenanceNotify" class="modern-switch" />
              </div>
              <div class="event-item">
                <div class="event-info">
                  <h4>Database Backup Success</h4>
                  <p>Send an alert when the daily automated backup completes.</p>
                </div>
                <el-switch v-model="notificationSettings.backupNotify" class="modern-switch" />
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 系统监控 -->
        <el-tab-pane label="System Monitor" name="monitor">
          <div class="setting-group">
            <h3 class="group-title">Service Health</h3>
            <div class="health-grid">
              <div class="health-card">
                <div class="health-icon success">
                  <el-icon>
                    <CircleCheckFilled />
                  </el-icon>
                </div>
                <div class="health-info">
                  <h4>Database Connection</h4>
                  <p class="status-success">Connected & Healthy</p>
                </div>
              </div>
              <div class="health-card">
                <div class="health-icon success">
                  <el-icon>
                    <CircleCheckFilled />
                  </el-icon>
                </div>
                <div class="health-info">
                  <h4>API Services</h4>
                  <p class="status-success">Running</p>
                </div>
              </div>
              <div class="health-card">
                <div class="health-icon warning">
                  <el-icon>
                    <WarningFilled />
                  </el-icon>
                </div>
                <div class="health-info">
                  <h4>Storage Capacity</h4>
                  <p class="status-warning">85% Used</p>
                </div>
              </div>
              <div class="health-card">
                <div class="health-icon success">
                  <el-icon>
                    <CircleCheckFilled />
                  </el-icon>
                </div>
                <div class="health-info">
                  <h4>SMTP Mail Service</h4>
                  <p class="status-success">Operational</p>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-divider"></div>

          <div class="setting-group">
            <div class="log-header-wrapper">
              <h3 class="group-title" style="margin: 0;">System Logs</h3>
              <div class="log-actions">
                <el-select v-model="logLevel" placeholder="Level" class="modern-input" style="width: 120px">
                  <el-option label="All Levels" value="all" />
                  <el-option label="Error" value="error" />
                  <el-option label="Warning" value="warning" />
                  <el-option label="Info" value="info" />
                </el-select>
                <el-button class="secondary-btn" @click="refreshLogs">Refresh</el-button>
                <el-button class="secondary-btn text-danger" @click="clearLogs">Clear Logs</el-button>
              </div>
            </div>

            <div class="terminal-window">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <span></span><span></span><span></span>
                </div>
                <div class="terminal-title">system.log</div>
              </div>
              <div class="terminal-body">
                <div v-for="log in systemLogs" :key="log.id" class="log-line">
                  <span class="log-time">[{{ log.time }}]</span>
                  <span :class="['log-level', log.level]">{{ log.level.toUpperCase() }}</span>
                  <span class="log-msg">{{ log.message }}</span>
                </div>
                <div v-if="systemLogs.length === 0" class="log-empty">
                  No logs found for the selected criteria.
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
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
      systemName: 'Student Admin',
      version: '1.2.4',
      adminEmail: 'admin@system.local',
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
      senderEmail: 'noreply@system.local',
      emailEnabled: true,
      newStudentNotify: true,
      maintenanceNotify: true,
      backupNotify: false
    })

    const systemLogs = ref([
      { id: 1, level: 'info', time: '2024-01-15 10:30:25', message: 'System boot sequence completed successfully.' },
      { id: 2, level: 'info', time: '2024-01-15 10:35:12', message: 'User [admin] authenticated successfully via local strategy.' },
      { id: 3, level: 'warning', time: '2024-01-15 11:20:45', message: 'Storage capacity threshold reached: 85% utilization on /var/data.' },
      { id: 4, level: 'info', time: '2024-01-15 12:00:00', message: 'Scheduled cron job [db-backup] completed in 4.2s.' },
      { id: 5, level: 'error', time: '2024-01-15 14:15:30', message: 'SMTP connection timeout on port 587. Delivery failed for 2 messages.' }
    ])

    const saveSettings = async () => {
      saving.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        ElMessage.success('System settings saved successfully.')
      } catch (error) {
        ElMessage.error('Failed to save settings.')
      } finally {
        saving.value = false
      }
    }

    const resetSettings = () => {
      ElMessage.info('Settings reset to default values.')
    }

    const refreshLogs = () => {
      ElMessage.success('Logs refreshed.')
    }

    const clearLogs = () => {
      systemLogs.value = []
      ElMessage.success('System logs cleared.')
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
.page-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 顶部标题区域 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.02em;
  text-align: left;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 按钮通用规范 */
.primary-btn {
  background-color: #111827;
  border-color: #111827;
  color: white;
  border-radius: 8px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.primary-btn:hover {
  background-color: #374151;
  border-color: #374151;
}

.secondary-btn {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 8px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.secondary-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

.text-danger {
  color: #ef4444;
}

.text-danger:hover {
  color: #dc2626;
}

/* 主面板 */
.content-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* 选项卡覆盖 */
.modern-tabs {
  padding: 0 24px;
}

.modern-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e5e7eb;
}

.modern-tabs :deep(.el-tabs__item) {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  height: 56px;
  line-height: 56px;
}

.modern-tabs :deep(.el-tabs__item.is-active) {
  color: #111827;
}

.modern-tabs :deep(.el-tabs__active-bar) {
  background-color: #111827;
}

/* 设置分组 */
.setting-group {
  padding: 32px 0;
}

.group-title {
  margin: 0 0 24px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.setting-divider {
  height: 1px;
  background-color: #f3f4f6;
  margin: 0;
}

/* 网格布局 */
.setting-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 48px;
}

@media (max-width: 768px) {
  .setting-grid {
    grid-template-columns: 1fr;
  }
}

.setting-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.setting-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.setting-control-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px;
}

.setting-desc {
  font-size: 13px;
  color: #6b7280;
}

.status-text {
  font-size: 13px;
  font-weight: 500;
}

.text-success {
  color: #10b981;
}

.text-warning {
  color: #d97706;
}

/* 输入框定制 */
.modern-input :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  padding: 4px 12px;
  transition: all 0.2s;
}

.modern-input :deep(.el-input__wrapper:hover),
.modern-input :deep(.el-input__wrapper.is-focus) {
  border-color: #111827;
  box-shadow: 0 0 0 1px #111827;
}

.modern-input.is-readonly :deep(.el-input__wrapper) {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

.modern-input.is-readonly :deep(.el-input__inner) {
  color: #6b7280;
}

.modern-input-number :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  transition: all 0.2s;
}

.modern-input-number :deep(.el-input__wrapper:hover),
.modern-input-number :deep(.el-input__wrapper.is-focus) {
  border-color: #111827;
  box-shadow: 0 0 0 1px #111827;
}

.modern-switch :deep(.el-switch__core) {
  border-color: #d1d5db;
  background-color: #e5e7eb;
}

.modern-switch.is-checked :deep(.el-switch__core) {
  border-color: #111827;
  background-color: #111827;
}

/* 通知事件列表 */
.event-list {
  display: flex;
  flex-direction: column;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border: 1px solid #e5e7eb;
  border-bottom: none;
  background-color: #fafafa;
}

.event-item:first-child {
  border-radius: 8px 8px 0 0;
}

.event-item:last-child {
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0 0 8px 8px;
}

.event-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.event-info p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

/* 监控指标卡片 */
.health-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .health-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.health-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.health-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.health-icon.success {
  background-color: #ecfdf5;
  color: #10b981;
}

.health-icon.warning {
  background-color: #fffbeb;
  color: #d97706;
}

.health-info h4 {
  margin: 0 0 2px 0;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.health-info p {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.status-success {
  color: #111827;
}

.status-warning {
  color: #d97706;
}

/* 终端日志窗口 */
.log-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.log-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.terminal-window {
  background-color: #0f172a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.terminal-header {
  background-color: #1e293b;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #334155;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.terminal-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal-dots span:nth-child(1) {
  background-color: #ef4444;
}

.terminal-dots span:nth-child(2) {
  background-color: #eab308;
}

.terminal-dots span:nth-child(3) {
  background-color: #22c55e;
}

.terminal-title {
  flex: 1;
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  margin-right: 48px;
  /* 抵消左侧 dots 的宽度以居中 */
}

.terminal-body {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 13px;
  line-height: 1.6;
}

.terminal-body::-webkit-scrollbar {
  display: none;
}

.log-line {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
}

.log-time {
  color: #64748b;
  white-space: nowrap;
}

.log-level {
  font-weight: 600;
  width: 48px;
}

.log-level.info {
  color: #38bdf8;
}

.log-level.warning {
  color: #fbbf24;
}

.log-level.error {
  color: #f87171;
}

.log-msg {
  color: #e2e8f0;
  word-break: break-word;
}

.log-empty {
  color: #64748b;
  text-align: center;
  padding: 32px 0;
  font-style: italic;
}
</style>