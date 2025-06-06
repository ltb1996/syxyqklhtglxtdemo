<template>
  <div class="layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '250px'" class="sidebar">
        <div class="logo-section">
          <div class="logo">
            <el-icon size="32" color="#409eff"><School /></el-icon>
            <span v-show="!isCollapse" class="logo-text">学生管理</span>
          </div>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :unique-opened="true"
          router
          class="sidebar-menu"
        >
          <el-menu-item index="/dashboard">
            <el-icon><Odometer /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          
          <el-menu-item index="/students">
            <el-icon><User /></el-icon>
            <span>学生管理</span>
          </el-menu-item>
          
          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/profile">
              <el-icon><UserFilled /></el-icon>
              <span>个人中心</span>
            </el-menu-item>
            <el-menu-item index="/settings">
              <el-icon><Tools /></el-icon>
              <span>系统设置</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 头部 -->
        <el-header class="header">
          <div class="header-left">
            <el-button
              type="text"
              @click="toggleSidebar"
              class="collapse-btn"
            >
              <el-icon size="20">
                <component :is="isCollapse ? 'Expand' : 'Fold'" />
              </el-icon>
            </el-button>
            
            <el-breadcrumb separator="/" class="breadcrumb">
              <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                {{ item.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="header-right">
            <!-- 搜索框 -->
            <div class="search-box">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索学生..."
                size="small"
                clearable
                @keyup.enter="handleGlobalSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
            
            <!-- 通知 -->
            <el-badge :value="notifications" class="notification-badge">
              <el-button type="text" @click="showNotifications">
                <el-icon size="18"><Bell /></el-icon>
              </el-button>
            </el-badge>
            
            <!-- 用户信息 -->
            <el-dropdown @command="handleUserCommand" class="user-dropdown">
              <div class="user-info">
                <el-avatar :size="35" :src="userInfo?.avatar">
                  {{ userInfo?.name?.charAt(0) }}
                </el-avatar>
                <span class="username">{{ userInfo?.name }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>系统设置
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主要内容 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  School, Odometer, User, Setting, UserFilled, Tools,
  Expand, Fold, Search, Bell, ArrowDown, SwitchButton
} from '@element-plus/icons-vue'

export default {
  name: 'Layout',
  components: {
    School, Odometer, User, Setting, UserFilled, Tools,
    Expand, Fold, Search, Bell, ArrowDown, SwitchButton
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const isCollapse = ref(false)
    const searchKeyword = ref('')
    const notifications = ref(3)
    
    const userInfo = computed(() => {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    })
    
    const activeMenu = computed(() => {
      return route.path
    })
    
    const breadcrumbs = computed(() => {
      const breadcrumbMap = {
        '/dashboard': [{ title: '仪表盘', path: '/dashboard' }],
        '/students': [{ title: '学生管理', path: '/students' }],
        '/profile': [{ title: '个人中心', path: '/profile' }],
        '/settings': [{ title: '系统设置', path: '/settings' }]
      }
      return breadcrumbMap[route.path] || []
    })
    
    const toggleSidebar = () => {
      isCollapse.value = !isCollapse.value
    }
    
    const handleGlobalSearch = () => {
      if (searchKeyword.value.trim()) {
        router.push({
          path: '/students',
          query: { search: searchKeyword.value }
        })
        searchKeyword.value = ''
      }
    }
    
    const showNotifications = () => {
      ElMessage.info('暂无新通知')
      notifications.value = 0
    }
    
    const handleUserCommand = async (command) => {
      switch (command) {
        case 'profile':
          router.push('/profile')
          break
        case 'settings':
          router.push('/settings')
          break
        case 'logout':
          await handleLogout()
          break
      }
    }
    
    const handleLogout = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '确认退出',
          {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        )
        
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch (error) {
        // 取消退出
      }
    }
    
    return {
      isCollapse,
      searchKeyword,
      notifications,
      userInfo,
      activeMenu,
      breadcrumbs,
      toggleSidebar,
      handleGlobalSearch,
      showNotifications,
      handleUserCommand
    }
  }
}
</script>

<style scoped>
.layout {
  height: 100vh;
}

.el-container {
  height: 100%;
}

/* 侧边栏 */
.sidebar {
  background: #304156;
  transition: width 0.3s ease;
  overflow: hidden;
}

.logo-section {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #434c5e;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.logo-text {
  white-space: nowrap;
}

.sidebar-menu {
  border: none;
  background: #304156;
}

.sidebar-menu .el-menu-item {
  color: #bfcbd9;
  border-bottom: 1px solid #434c5e;
}

.sidebar-menu .el-menu-item:hover {
  background: #434c5e;
  color: #409eff;
}

.sidebar-menu .el-menu-item.is-active {
  background: #409eff;
  color: white;
}

.sidebar-menu .el-sub-menu__title {
  color: #bfcbd9;
  border-bottom: 1px solid #434c5e;
}

.sidebar-menu .el-sub-menu__title:hover {
  background: #434c5e;
  color: #409eff;
}

/* 头部 */
.header {
  background: white;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  font-size: 18px;
  color: #606266;
}

.breadcrumb {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  width: 250px;
}

.notification-badge {
  cursor: pointer;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

/* 主内容区 */
.main-content {
  background: #f5f7fa;
  padding: 0;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-left .breadcrumb {
    display: none;
  }
  
  .search-box {
    width: 200px;
  }
  
  .username {
    display: none;
  }
}
</style>
