<template>
  <div class="layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '260px'" class="sidebar">
        <!-- Logo区域 -->
        <div class="logo-section">
          <div class="logo">
            <div class="logo-icon">
              <img :src="faviconIcon" alt="学生管理系统" class="logo-image" />
            </div>
            <div v-show="!isCollapse" class="logo-content">
              <span class="logo-title">学生管理系统</span>
            </div>
          </div>
        </div>

        <!-- 用户信息卡片 -->
        <div v-show="!isCollapse" class="user-card">
          <div class="user-avatar">
            <el-avatar :size="40" :src="userInfo?.avatar">
              {{ userInfo?.name?.charAt(0) }}
            </el-avatar>
            <div class="online-indicator"></div>
          </div>
          <div class="user-details">
            <div class="user-name">{{ userInfo?.name || '管理员' }}</div>
            <div class="user-role">系统管理员</div>
          </div>
        </div>

        <!-- 菜单分组 -->
        <div class="menu-section">
          <div v-show="!isCollapse" class="menu-group-title">概览</div>
          <el-menu :default-active="activeMenu" :collapse="isCollapse" :unique-opened="true" router
            class="sidebar-menu">
            <el-menu-item index="/dashboard" class="menu-item-custom">
              <el-icon>
                <Odometer />
              </el-icon>
              <span>首页仪表盘</span>
            </el-menu-item>

            <el-menu-item index="/students" class="menu-item-custom">
              <el-icon>
                <User />
              </el-icon>
              <span>学生管理</span>
            </el-menu-item>

            <el-menu-item index="/analytics" class="menu-item-custom">
              <el-icon>
                <DataAnalysis />
              </el-icon>
              <span>数据分析</span>
            </el-menu-item>

            <el-menu-item index="/ai-chat" class="menu-item-custom">
              <el-icon>
                <ChatDotRound />
              </el-icon>
              <span>AI 问答</span>
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 系统管理分组 -->
        <div class="menu-section">
          <div v-show="!isCollapse" class="menu-group-title">设置</div>
          <el-menu :default-active="activeMenu" :collapse="isCollapse" :unique-opened="true" router
            class="sidebar-menu">
            <el-menu-item index="/profile" class="menu-item-custom">
              <el-icon>
                <UserFilled />
              </el-icon>
              <span>个人中心</span>
            </el-menu-item>

            <el-menu-item index="/settings" class="menu-item-custom">
              <el-icon>
                <Tools />
              </el-icon>
              <span>系统设置</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 头部 -->
        <el-header class="header">
          <div class="header-left">
            <el-button type="text" @click="toggleSidebar" class="collapse-btn">
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
              <el-input v-model="searchKeyword" placeholder="搜索学生..." class="modern-input" clearable
                @keyup.enter="handleGlobalSearch">
                <template #prefix>
                  <el-icon>
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </div>

            <!-- 通知 -->
            <el-badge :value="notifications" class="notification-badge" type="danger">
              <div class="action-icon" @click="showNotifications">
                <el-icon size="20">
                  <Bell />
                </el-icon>
              </div>
            </el-badge>

            <!-- 用户信息 -->
            <el-dropdown @command="handleUserCommand" class="user-dropdown" trigger="click">
              <div class="user-info">
                <el-avatar :size="32" :src="userInfo?.avatar">
                  {{ userInfo?.name?.charAt(0) }}
                </el-avatar>
                <el-icon size="14" class="dropdown-icon">
                  <ArrowDown />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="modern-dropdown">
                  <div class="dropdown-header">
                    <span class="dropdown-name">{{ userInfo?.name || '管理员' }}</span>
                    <span class="dropdown-email">{{ userInfo?.email || 'admin@system.local' }}</span>
                  </div>
                  <el-dropdown-item command="profile">
                    <el-icon>
                      <User />
                    </el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon>
                      <Setting />
                    </el-icon>系统设置
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided class="text-danger">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主要内容 -->
        <el-main class="main-content">
          <div class="page-container">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import faviconIcon from '../assets/logologo.png'
import {
  Odometer, User, Setting, UserFilled, Tools,
  Expand, Fold, Search, Bell, ArrowDown, SwitchButton, DataAnalysis, ChatDotRound
} from '@element-plus/icons-vue'

export default {
  name: 'Layout',
  components: {
    Odometer, User, Setting, UserFilled, Tools,
    Expand, Fold, Search, Bell, ArrowDown, SwitchButton, DataAnalysis, ChatDotRound
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
        '/analytics': [{ title: '数据分析', path: '/analytics' }],
        '/ai-chat': [{ title: 'AI 问答', path: '/ai-chat' }],
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
      faviconIcon,
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
  background-color: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
}

.el-container {
  height: 100%;
  width: 100%;
}

/* 侧边栏 - 极简深色设计 */
.sidebar {
  background-color: #111827;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1f2937;
  z-index: 10;
}

/* Logo区域 */
.logo-section {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f9fafb;
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.logo-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* 用户信息卡片 */
.user-card {
  margin: 16px;
  padding: 12px;
  background-color: #1f2937;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #374151;
}

.user-avatar {
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #10b981;
  border-radius: 50%;
  border: 2px solid #1f2937;
}

.user-details {
  flex: 1;
  overflow: hidden;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #f9fafb;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

/* 菜单分组 */
.menu-section {
  margin-top: 16px;
  padding: 0 12px;
}

.menu-group-title {
  padding: 0 12px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

/* 菜单样式 */
.sidebar-menu {
  border: none;
  background: transparent;
}

.sidebar-menu .el-menu-item {
  color: #d1d5db !important;
  height: 40px;
  line-height: 40px;
  background-color: transparent !important;
  border-radius: 8px;
  margin-bottom: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #1f2937 !important;
  color: #f9fafb !important;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #3b82f6 !important;
  color: white !important;
  font-weight: 500;
}

.sidebar-menu .el-menu-item .el-icon {
  font-size: 18px;
  margin-right: 12px;
  color: inherit !important;
}

/* 折叠状态优化 */
.sidebar.el-aside--collapsed .user-card,
.sidebar.el-aside--collapsed .menu-group-title {
  display: none;
}

.sidebar.el-aside--collapsed .logo-section {
  padding: 0;
  justify-content: center;
}

/* 头部 */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  color: #4b5563;
  padding: 6px;
  border-radius: 6px;
}

.collapse-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: #6b7280;
  font-weight: 400;
}

.breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #111827;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  width: 240px;
}

.modern-input :deep(.el-input__wrapper) {
  background-color: #f3f4f6;
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.modern-input :deep(.el-input__wrapper:hover),
.modern-input :deep(.el-input__wrapper.is-focus) {
  background-color: #ffffff;
  border-color: #d1d5db;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.action-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-icon:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f3f4f6;
}

.dropdown-icon {
  color: #6b7280;
}

.modern-dropdown {
  padding: 8px 0;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dropdown-header {
  padding: 8px 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 4px;
  display: flex;
  flex-direction: column;
}

.dropdown-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.dropdown-email {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.text-danger {
  color: #ef4444 !important;
}

/* 主内容区 */
.main-content {
  background-color: #fafafa;
  padding: 24px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.main-content::-webkit-scrollbar {
  display: none;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 响应式 */
@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .breadcrumb {
    display: none;
  }

  .search-box {
    display: none;
  }

  .main-content {
    padding: 16px;
  }
}
</style>
