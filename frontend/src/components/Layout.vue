<template>
  <div class="layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '260px'" class="sidebar">
        <!-- Logo区域 - 更美观的设计 -->
        <div class="logo-section">
          <div class="logo">
            <div class="logo-icon">
              <el-icon size="28"><School /></el-icon>
            </div>
            <div v-show="!isCollapse" class="logo-content">
              <span class="logo-title">学生管理系统</span>
              <span class="logo-subtitle">Student Management</span>
            </div>
          </div>
        </div>
        
        <!-- 用户信息卡片 -->
        <div v-show="!isCollapse" class="user-card">
          <div class="user-avatar">
            <el-avatar :size="45" :src="userInfo?.avatar">
              {{ userInfo?.name?.charAt(0) }}
            </el-avatar>
            <div class="online-indicator"></div>
          </div>
          <div class="user-details">
            <div class="user-name">{{ userInfo?.name || 'Admin' }}</div>
            <div class="user-role">系统管理员</div>
          </div>
        </div>
        
        <!-- 菜单分组 -->
        <div class="menu-section">
          <div v-show="!isCollapse" class="menu-group-title">主要功能</div>
          <el-menu
            :default-active="activeMenu"
            :collapse="isCollapse"
            :unique-opened="true"
            router
            class="sidebar-menu"
          >
            <el-menu-item index="/dashboard" class="menu-item-custom">
              <el-icon><Odometer /></el-icon>
              <span>首页</span>
              <div class="menu-item-indicator"></div>
            </el-menu-item>
            
            <el-menu-item index="/students" class="menu-item-custom">
              <el-icon><User /></el-icon>
              <span>学生管理</span>
              <div class="menu-item-indicator"></div>
            </el-menu-item>
          </el-menu>
        </div>
        
        <!-- 系统管理分组 -->
        <div class="menu-section">
          <div v-show="!isCollapse" class="menu-group-title">系统管理</div>
          <el-menu
            :default-active="activeMenu"
            :collapse="isCollapse"
            :unique-opened="true"
            router
            class="sidebar-menu"
          >
            <el-menu-item index="/profile" class="menu-item-custom">
              <el-icon><UserFilled /></el-icon>
              <span>个人中心</span>
              <div class="menu-item-indicator"></div>
            </el-menu-item>
            
            <el-menu-item index="/settings" class="menu-item-custom">
              <el-icon><Tools /></el-icon>
              <span>系统设置</span>
              <div class="menu-item-indicator"></div>
            </el-menu-item>
          </el-menu>
        </div>
        
        <!-- 底部信息 -->
        <div v-show="!isCollapse" class="sidebar-footer">
          <div class="version-info">
            <span>Version 1.0.0</span>
          </div>
        </div>
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
        '/dashboard': [{ title: '首页', path: '/dashboard' }],
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
  width: 100vw;
  overflow: hidden;
}

.el-container {
  height: 100%;
  width: 100%;
}

/* 侧边栏 - 现代化设计 */
.sidebar {
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  transition: width 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  position: relative;
}

/* Logo区域 - 更美观 */
.logo-section {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  padding: 0 15px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.logo-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
}

.logo-subtitle {
  font-size: 11px;
  opacity: 0.7;
  font-weight: 400;
}

/* 用户信息卡片 */
.user-card {
  margin: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #67c23a;
  border-radius: 50%;
  border: 2px solid white;
}

.user-details {
  flex: 1;
  color: white;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.user-role {
  font-size: 12px;
  opacity: 0.8;
}

/* 菜单分组 */
.menu-section {
  margin-bottom: 20px;
}

.menu-group-title {
  padding: 8px 20px;
  font-size: 15px;
  color: rgba(255, 255, 205, 0.6);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

/* 菜单样式 */
.sidebar-menu {
  border: none;
  background: transparent;
  width: 100%;
}

.sidebar-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.8) !important;
  border-bottom: none;
  height: 48px;
  line-height: 48px;
  background-color: transparent !important;
  /* margin: 0 10px 5px 10px; */
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.sidebar-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  transform: translateX(5px);
}

.sidebar-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #409eff, #67c23a) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transform: translateX(5px);
}

.sidebar-menu .el-menu-item.is-active .menu-item-indicator {
  opacity: 1;
}

/* 菜单项指示器 */
.menu-item-indicator {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 菜单图标 */
.sidebar-menu .el-menu-item .el-icon {
  color: inherit !important;
  margin-right: 12px;
  font-size: 18px;
}

/* 侧边栏底部 */
.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.version-info {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

/* 折叠状态优化 */
.sidebar.el-aside--collapsed .user-card,
.sidebar.el-aside--collapsed .menu-group-title,
.sidebar.el-aside--collapsed .sidebar-footer {
  display: none;
}

/* 主容器 */
.el-container:last-child {
  flex: 1;
  display: flex;
  width: 100%;
  min-width: 0;
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
  height: 60px;
  flex-shrink: 0;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  font-size: 18px;
  color: #606266;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: #f5f7fa;
  color: #409eff;
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
  padding: 8px 12px;
  border-radius: 8px;
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
  flex: 1;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  background: #f5f7fa;
  padding: 0;
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
  
  .sidebar {
    width: 64px !important;
  }
}

/* 滚动条美化 */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
