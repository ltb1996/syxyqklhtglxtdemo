<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 用户信息卡片 -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-section">
            <el-avatar :size="100" :src="userInfo?.avatar">
              {{ userInfo?.name?.charAt(0) }}
            </el-avatar>
            <el-button type="primary" size="small" @click="showAvatarDialog = true">
              更换头像
            </el-button>
          </div>
          <div class="user-details">
            <h2>{{ userInfo?.name }}</h2>
            <p class="user-role">{{ getRoleText(userInfo?.role) }}</p>
            <p class="user-email">{{ userInfo?.email }}</p>
            <el-tag :type="userInfo?.status === 'active' ? 'success' : 'danger'">
              {{ userInfo?.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </div>
        </div>
        
        <div class="profile-stats">
          <div class="stat-item">
            <h3>{{ statistics.totalStudents || 0 }}</h3>
            <p>管理学生</p>
          </div>
          <div class="stat-item">
            <h3>{{ getDaysFromLastLogin() }}</h3>
            <p>天前登录</p>
          </div>
          <div class="stat-item">
            <h3>{{ getAccountAge() }}</h3>
            <p>账户年龄</p>
          </div>
        </div>
      </div>

      <!-- 信息编辑表单 -->
      <div class="info-card">
        <div class="card-header">
          <h3>基本信息</h3>
          <el-button type="primary" @click="editMode = !editMode">
            {{ editMode ? '取消编辑' : '编辑信息' }}
          </el-button>
        </div>
        
        <el-form :model="profileForm" :rules="rules" ref="profileFormRef" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input 
                  v-model="profileForm.name" 
                  :disabled="!editMode"
                  placeholder="请输入姓名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input 
                  v-model="profileForm.email" 
                  :disabled="!editMode"
                  placeholder="请输入邮箱"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色">
                <el-input :value="getRoleText(profileForm.role)" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item v-if="editMode">
            <el-button type="primary" @click="updateProfile" :loading="loading">
              保存修改
            </el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 安全设置 -->
      <div class="security-card">
        <div class="card-header">
          <h3>安全设置</h3>
        </div>
        
        <div class="security-items">
          <div class="security-item">
            <div class="security-info">
              <h4>登录密码</h4>
              <p>定期更换密码可以保护账户安全</p>
            </div>
            <el-button type="primary" @click="showPasswordDialog = true">
              修改密码
            </el-button>
          </div>
          
          <div class="security-item">
            <div class="security-info">
              <h4>登录记录</h4>
              <p>最后登录：{{ formatDate(userInfo?.lastLogin) }}</p>
            </div>
            <el-button @click="showLoginHistory">查看记录</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword" 
            type="password" 
            show-password
            placeholder="请输入原密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            show-password
            placeholder="请确认新密码"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changePassword" :loading="passwordLoading">
          确认修改
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getProfile, updateProfile, changePassword, getStatistics } from '../api'

export default {
  name: 'Profile',
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
      return new Date(date).toLocaleString('zh-CN')
    }
    
    const initForm = () => {
      if (userInfo.value) {
        Object.assign(profileForm, {
          name: userInfo.value.name,
          email: userInfo.value.email,
          username: userInfo.value.username,
          role: userInfo.value.role
        })
      }
    }
    
    const resetForm = () => {
      initForm()
      editMode.value = false
    }
    
    const updateProfile = async () => {
      if (!profileFormRef.value) return
      
      await profileFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            const response = await updateProfile(profileForm)
            localStorage.setItem('user', JSON.stringify(response.data))
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
    
    const changePassword = async () => {
      if (!passwordFormRef.value) return
      
      await passwordFormRef.value.validate(async (valid) => {
        if (valid) {
          passwordLoading.value = true
          try {
            await changePassword(passwordForm)
            ElMessage.success('密码修改成功')
            showPasswordDialog.value = false
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
      updateProfile,
      changePassword,
      showLoginHistory
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card, .info-card, .security-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.profile-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.avatar-section {
  text-align: center;
}

.avatar-section .el-button {
  margin-top: 15px;
}

.user-details h2 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
}

.user-role {
  color: #409eff;
  font-size: 16px;
  margin: 0 0 5px 0;
  font-weight: 500;
}

.user-email {
  color: #909399;
  margin: 0 0 15px 0;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding-top: 30px;
  border-top: 1px solid #ebeef5;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  margin: 0 0 8px 0;
  color: #409eff;
  font-size: 28px;
  font-weight: 700;
}

.stat-item p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.security-items {
  space-y: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.security-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.security-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 10px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .profile-stats {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .security-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>
