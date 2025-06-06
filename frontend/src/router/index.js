import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

// 导入组件
import Layout from '../components/Layout.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Students from '../views/Students.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '仪表盘',
          icon: 'Odometer'
        }
      },
      {
        path: 'students',
        name: 'Students',
        component: Students,
        meta: {
          title: '学生管理',
          icon: 'User'
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: {
          title: '个人中心',
          icon: 'UserFilled'
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: {
          title: '系统设置',
          icon: 'Tools'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 学生信息管理系统` : '学生信息管理系统'
  
  // 检查是否需要认证
  if (to.meta.requiresAuth !== false) {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.warning('请先登录')
      next('/login')
      return
    }
  }
  
  // 如果已登录用户访问登录页，重定向到仪表盘
  if (to.path === '/login' && localStorage.getItem('token')) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
