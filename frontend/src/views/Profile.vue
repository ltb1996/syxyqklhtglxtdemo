<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Profile Settings</h1>
        <p class="page-subtitle">Manage your account settings and preferences</p>
      </div>
    </div>

    <div class="profile-layout">
      <!-- 左侧：主要信息和表单 -->
      <div class="main-column">
        <!-- 用户信息概览 -->
        <div class="profile-overview-card">
          <div class="overview-header">
            <div class="avatar-wrapper">
              <el-avatar :size="80" :src="userInfo?.avatar" class="user-avatar">
                {{ userInfo?.name?.charAt(0) }}
              </el-avatar>
              <button class="avatar-edit-btn" @click="showAvatarDialog = true">
                <el-icon>
                  <Camera />
                </el-icon>
              </button>
            </div>
            <div class="user-primary-info">
              <h2 class="user-name">{{ userInfo?.name }}</h2>
              <div class="user-meta">
                <span class="user-role">{{ getRoleText(userInfo?.role) }}</span>
                <span class="meta-divider">·</span>
                <span class="user-email">{{ userInfo?.email }}</span>
              </div>
              <div class="status-wrapper">
                <span class="status-badge" :class="userInfo?.status === 'active' ? 'status-success' : 'status-danger'">
                  {{ userInfo?.status === 'active' ? 'Active' : 'Disabled' }}
                </span>
              </div>
            </div>
          </div>

          <div class="overview-stats">
            <div class="stat-box">
              <div class="stat-value">{{ statistics.totalStudents || 0 }}</div>
              <div class="stat-label">Students Managed</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-box">
              <div class="stat-value">{{ getDaysFromLastLogin() }}</div>
              <div class="stat-label">Days Since Login</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-box">
              <div class="stat-value">{{ getAccountAge() }}</div>
              <div class="stat-label">Account Age</div>
            </div>
          </div>
        </div>

        <!-- 个人信息表单 -->
        <div class="settings-panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Personal Information</h3>
              <p class="panel-desc">Update your personal details and public profile.</p>
            </div>
            <el-button class="edit-toggle-btn" :class="{ 'is-active': editMode }" @click="editMode = !editMode">
              {{ editMode ? 'Cancel' : 'Edit' }}
            </el-button>
          </div>

          <div class="panel-body">
            <el-form :model="profileForm" :rules="rules" ref="profileFormRef" label-position="top" class="modern-form">
              <div class="form-grid">
                <el-form-item label="Full Name" prop="name">
                  <el-input v-model="profileForm.name" :disabled="!editMode" placeholder="Enter your full name"
                    class="modern-input" />
                </el-form-item>

                <el-form-item label="Email Address" prop="email">
                  <el-input v-model="profileForm.email" :disabled="!editMode" placeholder="Enter your email"
                    class="modern-input" />
                </el-form-item>

                <el-form-item label="Username">
                  <el-input v-model="profileForm.username" disabled class="modern-input is-readonly" />
                </el-form-item>

                <el-form-item label="Role">
                  <el-input :value="getRoleText(profileForm.role)" disabled class="modern-input is-readonly" />
                </el-form-item>
              </div>

              <div class="form-actions" v-if="editMode">
                <el-button @click="resetForm" class="secondary-btn">Reset Changes</el-button>
                <el-button type="primary" @click="submitProfileUpdate" :loading="loading" class="primary-btn">
                  Save Changes
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>

      <!-- 右侧：安全设置 -->
      <div class="side-column">
        <div class="settings-panel">
          <div class="panel-header">
            <h3 class="panel-title">Security Settings</h3>
            <p class="panel-desc">Manage your password and security preferences.</p>
          </div>

          <div class="panel-body p-0">
            <div class="security-list">
              <div class="security-list-item">
                <div class="security-item-content">
                  <h4 class="security-item-title">Password</h4>
                  <p class="security-item-desc">Regularly update your password to maintain security.</p>
                </div>
                <div class="security-item-action">
                  <el-button class="secondary-btn" @click="showPasswordDialog = true">
                    Update
                  </el-button>
                </div>
              </div>

              <div class="security-list-item">
                <div class="security-item-content">
                  <h4 class="security-item-title">Login History</h4>
                  <p class="security-item-desc">Last login: {{ formatDate(userInfo?.lastLogin) }}</p>
                </div>
                <div class="security-item-action">
                  <el-button class="secondary-btn" @click="showLoginHistory">
                    View
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="Change Password" width="440px" class="modern-dialog">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-position="top"
        class="modern-form">
        <el-form-item label="Current Password" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password
            placeholder="Enter current password" class="modern-input" />
        </el-form-item>
        <el-form-item label="New Password" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="Enter new password"
            class="modern-input" />
        </el-form-item>
        <el-form-item label="Confirm New Password" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password
            placeholder="Confirm new password" class="modern-input" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPasswordDialog = false" class="secondary-btn">Cancel</el-button>
          <el-button type="primary" @click="submitPasswordChange" :loading="passwordLoading" class="primary-btn">
            Update Password
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'
import { getProfile, updateProfile, changePassword, getStatistics } from '../api'

export default {
  name: 'Profile',
  components: {
    Camera
  },
  setup() {
    const editMode = ref(false)
    const loading = ref(false)
    const passwordLoading = ref(false)
    const showPasswordDialog = ref(false)
    const showAvatarDialog = ref(false)

    const profileFormRef = ref()
    const passwordFormRef = ref()

    const userInfo = computed(() => {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    })

    const statistics = reactive({
      totalStudents: 0
    })

    const profileForm = reactive({
      name: '',
      email: '',
      username: '',
      role: ''
    })

    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const rules = {
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
      ]
    }

    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入原密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    const getRoleText = (role) => {
      const roleMap = {
        admin: '系统管理员',
        teacher: '教师',
        operator: '操作员'
      }
      return roleMap[role] || '未知角色'
    }

    const getDaysFromLastLogin = () => {
      if (!userInfo.value?.lastLogin) return 0
      const lastLogin = new Date(userInfo.value.lastLogin)
      const now = new Date()
      const diffTime = Math.abs(now - lastLogin)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const getAccountAge = () => {
      if (!userInfo.value?.createdAt) return '未知'
      const created = new Date(userInfo.value.createdAt)
      const now = new Date()
      const months = (now.getFullYear() - created.getFullYear()) * 12 +
        (now.getMonth() - created.getMonth())
      return months > 0 ? `${months}个月` : '新用户'
    }

    const formatDate = (date) => {
      if (!date) return '从未登录'
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    }

    const initForm = () => {
      if (userInfo.value) {
        Object.assign(profileForm, {
          name: userInfo.value.name || '',
          email: userInfo.value.email || '',
          username: userInfo.value.username || '',
          role: userInfo.value.role || ''
        })
      }
    }

    const resetForm = () => {
      initForm()
      editMode.value = false
    }

    const submitProfileUpdate = async () => {
      if (!profileFormRef.value) return

      await profileFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            const response = await updateProfile({
              name: profileForm.name,
              email: profileForm.email
            })
            // 更新本地存储的用户信息
            const updatedUser = { ...userInfo.value, ...response.data }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            ElMessage.success('信息更新成功')
            editMode.value = false
          } catch (error) {
            ElMessage.error('更新失败')
          } finally {
            loading.value = false
          }
        }
      })
    }

    const submitPasswordChange = async () => {
      if (!passwordFormRef.value) return

      await passwordFormRef.value.validate(async (valid) => {
        if (valid) {
          passwordLoading.value = true
          try {
            await changePassword({
              oldPassword: passwordForm.oldPassword,
              newPassword: passwordForm.newPassword
            })
            ElMessage.success('密码修改成功')
            showPasswordDialog.value = false
            // 清空表单
            Object.keys(passwordForm).forEach(key => {
              passwordForm[key] = ''
            })
          } catch (error) {
            ElMessage.error('密码修改失败')
          } finally {
            passwordLoading.value = false
          }
        }
      })
    }

    const showLoginHistory = () => {
      ElMessage.info('登录记录功能开发中...')
    }

    const loadStatistics = async () => {
      try {
        const response = await getStatistics()
        statistics.totalStudents = response.data.total
      } catch (error) {
        console.error('获取统计数据失败')
      }
    }

    onMounted(() => {
      initForm()
      loadStatistics()
    })

    return {
      editMode,
      loading,
      passwordLoading,
      showPasswordDialog,
      showAvatarDialog,
      profileFormRef,
      passwordFormRef,
      userInfo,
      statistics,
      profileForm,
      passwordForm,
      rules,
      passwordRules,
      getRoleText,
      getDaysFromLastLogin,
      getAccountAge,
      formatDate,
      resetForm,
      submitProfileUpdate,
      submitPasswordChange,
      showLoginHistory
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

/* 整体布局 */
.profile-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
}

.main-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 概览卡片 */
.profile-overview-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-wrapper {
  position: relative;
}

.user-avatar {
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 28px;
  font-weight: 600;
  border: 4px solid white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.avatar-edit-btn:hover {
  background-color: #f9fafb;
  color: #111827;
}

.user-primary-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-name {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.01em;
  text-align: left;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.user-role {
  font-weight: 500;
  color: #4b5563;
}

.status-wrapper {
  margin-top: 4px;
  text-align: left;
}

.status-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
  display: inline-block;
}

.status-success {
  background-color: #ecfdf5;
  color: #10b981;
}

.status-danger {
  background-color: #fef2f2;
  color: #ef4444;
}

.overview-stats {
  display: flex;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.stat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background-color: #e5e7eb;
}

/* 面板通用样式 */
.settings-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.panel-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  text-align: left;
}

.panel-desc {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.panel-body {
  padding: 24px;
}

.panel-body.p-0 {
  padding: 0;
}

.edit-toggle-btn {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
  font-weight: 500;
  border-radius: 6px;
}

.edit-toggle-btn:hover {
  background-color: #f9fafb;
}

.edit-toggle-btn.is-active {
  background-color: #f3f4f6;
  color: #111827;
}

/* 表单定制 */
.modern-form :deep(.el-form-item__label) {
  padding-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

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
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

.modern-input.is-readonly :deep(.el-input__wrapper) {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

.modern-input.is-readonly :deep(.el-input__inner) {
  color: #6b7280;
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 安全列表 */
.security-list {
  display: flex;
  flex-direction: column;
}

.security-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.security-list-item:last-child {
  border-bottom: none;
}

.security-item-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  text-align: left;
}

.security-item-desc {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

/* 按钮规范 */
.primary-btn {
  background-color: #111827;
  border-color: #111827;
  color: white;
  border-radius: 6px;
  font-weight: 500;
}

.primary-btn:hover,
.primary-btn:focus {
  background-color: #374151;
  border-color: #374151;
  color: white;
}

.secondary-btn {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 6px;
  font-weight: 500;
}

.secondary-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

/* 对话框定制 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>