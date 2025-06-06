<template>
  <div class="dashboard">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>欢迎回来，{{ userInfo?.name }}</h1>
        <p>今天是 {{ currentDate }}，系统运行正常</p>
      </div>
      <div class="welcome-avatar">
        <el-avatar :size="60" :src="userInfo?.avatar">
          {{ userInfo?.name?.charAt(0) }}
        </el-avatar>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card total-students">
        <div class="stat-icon">
          <el-icon size="40"><User /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statistics.total || 0 }}</h3>
          <p>总学生数</p>
        </div>
      </div>
      
      <div class="stat-card grade-stats">
        <div class="stat-icon">
          <el-icon size="40"><School /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statistics.byGrade?.length || 0 }}</h3>
          <p>年级数量</p>
        </div>
      </div>
      
      <div class="stat-card active-students">
        <div class="stat-icon">
          <el-icon size="40"><Check /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ getActiveStudents() }}</h3>
          <p>在读学生</p>
        </div>
      </div>
      
      <div class="stat-card new-students">
        <div class="stat-icon">
          <el-icon size="40"><Plus /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ getNewStudents() }}</h3>
          <p>本月新增</p>
        </div>
      </div>
    </div>

    <!-- 图表和表格区域 -->
    <div class="content-grid">
      <!-- 年级分布图表 -->
      <div class="chart-card">
        <div class="card-header">
          <h3>年级分布统计</h3>
          <el-icon><PieChart /></el-icon>
        </div>
        <div class="chart-content">
          <div class="grade-chart">
            <div v-for="grade in statistics.byGrade" :key="grade._id" class="grade-item">
              <div class="grade-bar">
                <div 
                  class="grade-fill" 
                  :style="{ width: (grade.count / statistics.total * 100) + '%' }"
                ></div>
              </div>
              <div class="grade-info">
                <span class="grade-name">{{ grade._id }}</span>
                <span class="grade-count">{{ grade.count }}人</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近添加的学生 -->
      <div class="recent-card">
        <div class="card-header">
          <h3>最近添加学生</h3>
          <el-button type="primary" size="small" @click="$router.push('/students')">
            查看全部
          </el-button>
        </div>
        <div class="recent-content">
          <div v-if="recentStudents.length === 0" class="empty-state">
            <el-icon size="60" color="#c0c4cc"><Document /></el-icon>
            <p>暂无学生数据</p>
          </div>
          <div v-else class="student-list">
            <div v-for="student in recentStudents" :key="student._id" class="student-item">
              <el-avatar :size="40">{{ student.name.charAt(0) }}</el-avatar>
              <div class="student-info">
                <h4>{{ student.name }}</h4>
                <p>{{ student.grade }} {{ student.class }}</p>
              </div>
              <div class="student-meta">
                <el-tag :type="getStatusType(student.status)" size="small">
                  {{ student.status }}
                </el-tag>
                <span class="add-time">{{ formatDate(student.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作区域 -->
    <div class="quick-actions">
      <h3>快速操作</h3>
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="$router.push('/students')">
          <el-icon><User /></el-icon>
          学生管理
        </el-button>
        <el-button type="success" size="large" @click="showAddStudent = true">
          <el-icon><Plus /></el-icon>
          添加学生
        </el-button>
        <el-button type="info" size="large" @click="exportData">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button type="warning" size="large" @click="$router.push('/profile')">
          <el-icon><Setting /></el-icon>
          系统设置
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getStatistics, getStudents } from '../api'
import { 
  User, School, Check, Plus, PieChart, Document, 
  Download, Setting 
} from '@element-plus/icons-vue'

export default {
  name: 'Dashboard',
  components: {
    User, School, Check, Plus, PieChart, Document,
    Download, Setting
  },
  setup() {
    const statistics = reactive({
      total: 0,
      byGrade: [],
      byStatus: []
    })
    
    const recentStudents = ref([])
    const showAddStudent = ref(false)
    
    const userInfo = computed(() => {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    })
    
    const currentDate = computed(() => {
      return new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    })
    
    const getActiveStudents = () => {
      const activeStatus = statistics.byStatus.find(s => s._id === '在读')
      return activeStatus ? activeStatus.count : 0
    }
    
    const getNewStudents = () => {
      // 计算本月新增学生数量
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return recentStudents.value.filter(student => {
        const createdDate = new Date(student.createdAt)
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear
      }).length
    }
    
    const getStatusType = (status) => {
      const statusTypes = {
        '在读': 'success',
        '休学': 'warning',
        '退学': 'danger',
        '毕业': 'info'
      }
      return statusTypes[status] || 'info'
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('zh-CN')
    }
    
    const exportData = () => {
      ElMessage.info('导出功能开发中...')
    }
    
    const loadStatistics = async () => {
      try {
        const response = await getStatistics()
        Object.assign(statistics, response.data)
      } catch (error) {
        ElMessage.error('获取统计数据失败')
      }
    }
    
    const loadRecentStudents = async () => {
      try {
        const response = await getStudents({ page: 1, limit: 5 })
        recentStudents.value = response.data
      } catch (error) {
        ElMessage.error('获取最近学生数据失败')
      }
    }
    
    onMounted(() => {
      loadStatistics()
      loadRecentStudents()
    })
    
    return {
      statistics,
      recentStudents,
      showAddStudent,
      userInfo,
      currentDate,
      getActiveStudents,
      getNewStudents,
      getStatusType,
      formatDate,
      exportData
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 欢迎区域 */
.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.welcome-content h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
}

.welcome-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.total-students {
  border-left-color: #409eff;
}

.grade-stats {
  border-left-color: #67c23a;
}

.active-students {
  border-left-color: #e6a23c;
}

.new-students {
  border-left-color: #f56c6c;
}

.stat-icon {
  margin-right: 20px;
  padding: 15px;
  border-radius: 50%;
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.grade-stats .stat-icon {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.active-students .stat-icon {
  background: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.new-students .stat-icon {
  background: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.stat-content h3 {
  margin: 0 0 5px 0;
  font-size: 32px;
  font-weight: 700;
  color: #303133;
}

.stat-content p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card, .recent-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 20px 25px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

/* 年级图表 */
.chart-content {
  padding: 25px;
}

.grade-chart {
  space-y: 15px;
}

.grade-item {
  margin-bottom: 20px;
}

.grade-bar {
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.grade-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.grade-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.grade-name {
  color: #303133;
  font-weight: 500;
}

.grade-count {
  color: #909399;
}

/* 最近学生列表 */
.recent-content {
  padding: 25px;
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.student-list {
  space-y: 15px;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.student-item:hover {
  background: #f0f9ff;
  transform: translateX(5px);
}

.student-info {
  flex: 1;
  margin-left: 15px;
}

.student-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
}

.student-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.student-meta {
  text-align: right;
}

.add-time {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #c0c4cc;
}

/* 快速操作 */
.quick-actions {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.quick-actions h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-buttons .el-button {
  height: 60px;
  font-size: 16px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
