<template>
  <div class="dashboard">
    <!-- 顶部欢迎区域 - 极简排版 -->
    <div class="welcome-section">
      <div class="welcome-text">
        <h1 class="page-title">概览</h1>
        <p class="page-subtitle">{{ currentDate }} · 欢迎回来，{{ userInfo?.name }}</p>
      </div>
      <div class="welcome-actions">
        <!-- <el-button type="primary" class="primary-btn" @click="showAddStudent = true">
          <el-icon>
            <Plus />
          </el-icon>添加学生
        </el-button> -->
        <el-button class="secondary-btn" @click="exportData">
          导出报表
        </el-button>
      </div>
    </div>

    <!-- 关键指标卡片 -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">学生总数</span>
          <el-icon class="metric-icon">
            <User />
          </el-icon>
        </div>
        <div class="metric-value">{{ statistics.total || 0 }}</div>
        <div class="metric-trend positive">
          <span class="trend-value">+{{ getNewStudents() }}</span>
          <span class="trend-label">本月新增</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">在读学生</span>
          <el-icon class="metric-icon">
            <Check />
          </el-icon>
        </div>
        <div class="metric-value">{{ getActiveStudents() }}</div>
        <div class="metric-trend neutral">
          <span class="trend-value">{{ getGraduateStudents() }}</span>
          <span class="trend-label">即将毕业</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">平均绩点</span>
          <el-icon class="metric-icon">
            <Trophy />
          </el-icon>
        </div>
        <div class="metric-value">{{ statistics.avgGpa || '0.0' }}</div>
        <div class="metric-trend positive">
          <span class="trend-value">{{ statistics.excellentCount || 0 }}</span>
          <span class="trend-label">优秀 (≥3.7)</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">学院与学历</span>
          <el-icon class="metric-icon">
            <School />
          </el-icon>
        </div>
        <div class="metric-value">{{ statistics.byCollege?.length || 0 }}</div>
        <div class="metric-trend neutral">
          <span class="trend-value">{{ statistics.byDegree?.length || 0 }}</span>
          <span class="trend-label">个学历层次</span>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-layout">
      <!-- 左侧：图表与列表 -->
      <div class="main-column">
        <!-- 图表双列布局 -->
        <div class="charts-row">
          <div class="panel college-panel">
            <div class="panel-header">
              <h3 class="panel-title">学院分布</h3>
            </div>
            <div class="panel-body">
              <div class="simple-bar-chart">
                <div v-for="college in statistics.byCollege" :key="college._id" class="bar-row">
                  <div class="bar-label">
                    <span class="label-name">{{ college._id }}</span>
                    <span class="label-value">{{ college.count }}</span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill" :style="{ width: (college.count / statistics.total * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="panel scholarship-panel">
            <div class="panel-header">
              <h3 class="panel-title">奖学金概览</h3>
            </div>
            <div class="panel-body flex-center">
              <div class="scholarship-summary">
                <div class="award-item">
                  <div class="award-dot nat"></div>
                  <div class="award-info">
                    <div class="award-name">国家级奖学金</div>
                    <div class="award-count">{{ statistics.scholarships?.['国家级'] || 0 }}</div>
                  </div>
                </div>
                <div class="award-item">
                  <div class="award-dot pro"></div>
                  <div class="award-info">
                    <div class="award-name">省级奖学金</div>
                    <div class="award-count">{{ statistics.scholarships?.['省级'] || 0 }}</div>
                  </div>
                </div>
                <div class="award-item">
                  <div class="award-dot sch"></div>
                  <div class="award-info">
                    <div class="award-name">校级奖学金</div>
                    <div class="award-count">{{ statistics.scholarships?.['校级'] || 0 }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 年级分布（简化为水平柱状或纯数字） -->
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">各年级在读人数</h3>
          </div>
          <div class="panel-body">
            <div class="grade-stats-grid">
              <div v-for="grade in statistics.byGrade" :key="grade._id" class="grade-stat-box">
                <div class="grade-count">{{ grade.count }}</div>
                <div class="grade-name">{{ grade._id }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：最近动态 -->
      <div class="side-column">
        <div class="panel recent-panel">
          <div class="panel-header">
            <h3 class="panel-title">最近加入</h3>
            <el-button type="text" class="text-link" @click="$router.push('/students')">全部</el-button>
          </div>
          <div class="panel-body p-0">
            <div v-if="recentStudents.length === 0" class="empty-state">
              <span class="empty-text">暂无学生数据</span>
            </div>
            <div v-else class="feed-list">
              <div v-for="student in recentStudents" :key="student._id" class="feed-item">
                <el-avatar :size="36" class="feed-avatar">{{ student.name.charAt(0) }}</el-avatar>
                <div class="feed-content">
                  <div class="feed-title">
                    <span class="feed-name">{{ student.name }}</span>
                    <span class="feed-status" :class="getStatusClass(student.status)">{{ student.status }}</span>
                  </div>
                  <div class="feed-meta">
                    {{ student.college }} · {{ student.major }}
                  </div>
                </div>
                <div class="feed-gpa" v-if="student.academicInfo?.gpa">
                  {{ student.academicInfo.gpa }}
                </div>
              </div>
            </div>
          </div>
        </div>
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
  Download, Setting, Trophy, Star, GoldMedal, Medal,
  DataAnalysis
} from '@element-plus/icons-vue'

export default {
  name: 'Dashboard',
  components: {
    User, School, Check, Plus, PieChart, Document,
    Download, Setting, Trophy, Star, GoldMedal, Medal,
    DataAnalysis
  },
  setup() {
    const statistics = reactive({
      total: 0,
      byGrade: [],
      byCollege: [],
      byDegree: [],
      byStatus: [],
      avgGpa: 0,
      excellentCount: 0,
      scholarships: {}
    })

    const recentStudents = ref([])
    const showAddStudent = ref(false)

    const userInfo = computed(() => {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : { name: '管理员' }
    })

    const currentDate = computed(() => {
      return new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })

    // 获取统计数据
    const fetchStatistics = async () => {
      try {
        const response = await getStatistics()
        Object.assign(statistics, response.data);
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    }

    // 获取最近学生
    const fetchRecentStudents = async () => {
      try {
        const response = await getStudents({
          page: 1,
          limit: 5,
          sort: 'createdAt',
          order: 'desc'
        })
        recentStudents.value = response.data.students || []
      } catch (error) {
        console.error('获取最近学生失败:', error)
      }
    }

    const getActiveStudents = () => {
      const activeStatus = statistics.byStatus.find(s => s._id === '在读')
      return activeStatus ? activeStatus.count : 0
    }

    const getGraduateStudents = () => {
      const currentYear = new Date().getFullYear()
      return recentStudents.value.filter(student =>
        student.expectedGraduationYear === currentYear
      ).length
    }

    const getNewStudents = () => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return recentStudents.value.filter(student => {
        const createdDate = new Date(student.createdAt)
        return createdDate.getMonth() === currentMonth &&
          createdDate.getFullYear() === currentYear
      }).length
    }

    const getStatusClass = (status) => {
      if (status === '在读') return 'status-active';
      if (status === '休学' || status === '延期毕业') return 'status-warning';
      if (status === '退学') return 'status-error';
      return 'status-neutral';
    }

    const exportData = () => {
      ElMessage.info('导出功能开发中...')
    }

    onMounted(() => {
      fetchStatistics()
      fetchRecentStudents()
    })

    return {
      statistics,
      recentStudents,
      showAddStudent,
      userInfo,
      currentDate,
      getActiveStudents,
      getGraduateStudents,
      getNewStudents,
      getStatusClass,
      exportData
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 顶部标题区域 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
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

.welcome-actions {
  display: flex;
  gap: 12px;
}

.primary-btn {
  background-color: #111827;
  border-color: #111827;
  border-radius: 6px;
  font-weight: 500;
}

.primary-btn:hover {
  background-color: #374151;
  border-color: #374151;
}

.secondary-btn {
  border-radius: 6px;
  font-weight: 500;
}

/* 关键指标卡片 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.metric-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.2s;
}

.metric-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.metric-icon {
  color: #9ca3af;
  font-size: 18px;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  letter-spacing: -0.02em;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.metric-trend.positive .trend-value {
  color: #10b981;
  font-weight: 500;
}

.metric-trend.neutral .trend-value {
  color: #6b7280;
  font-weight: 500;
}

.trend-label {
  color: #9ca3af;
}

/* 内容区域布局 */
.content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

/* 面板通用样式 */
.panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.panel-body {
  padding: 20px;
}

.panel-body.p-0 {
  padding: 0;
}

.panel-body.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.text-link {
  font-size: 13px;
  color: #3b82f6;
  padding: 0;
}

/* 学院分布简易柱状图 */
.simple-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bar-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.label-name {
  color: #4b5563;
  font-weight: 500;
}

.label-value {
  color: #111827;
  font-weight: 600;
}

.bar-track {
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 3px;
}

/* 奖学金概览 */
.scholarship-summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 240px;
}

.award-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.award-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.award-dot.nat {
  background-color: #fbbf24;
}

.award-dot.pro {
  background-color: #9ca3af;
}

.award-dot.sch {
  background-color: #d97706;
}

.award-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.award-name {
  font-size: 14px;
  color: #4b5563;
}

.award-count {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* 年级网格 */
.grade-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.grade-stat-box {
  background-color: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.grade-count {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.grade-name {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

/* 最近动态列表 */
.feed-list {
  display: flex;
  flex-direction: column;
}

.feed-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.feed-item:last-child {
  border-bottom: none;
}

.feed-avatar {
  background-color: #e5e7eb;
  color: #4b5563;
  font-weight: 600;
}

.feed-content {
  flex: 1;
  min-width: 0;
}

.feed-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.feed-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feed-status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-error {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-neutral {
  background-color: #f3f4f6;
  color: #4b5563;
}

.feed-meta {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.feed-gpa {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  background-color: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.empty-text {
  color: #9ca3af;
  font-size: 14px;
}
</style>
