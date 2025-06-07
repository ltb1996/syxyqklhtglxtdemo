<template>
  <div class="dashboard">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1>欢迎回来，{{ userInfo?.name }}</h1>
          <p>{{ currentDate }}，大学生信息管理系统运行正常</p>
        </div>
        <div class="welcome-avatar">
          <div class="avatar-container">
            <el-avatar :size="80" :src="userInfo?.avatar" class="user-avatar">
              {{ userInfo?.name?.charAt(0) }}
            </el-avatar>
            <div class="avatar-badge">
              <el-icon><Check /></el-icon>
            </div>
          </div>
        </div>
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
          <span class="stat-trend">+{{ getNewStudents() }} 本月新增</span>
        </div>
      </div>
      
      <div class="stat-card colleges-stats">
        <div class="stat-icon">
          <el-icon size="40"><School /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statistics.byCollege?.length || 0 }}</h3>
          <p>学院数量</p>
          <span class="stat-trend">{{ statistics.byDegree?.length || 0 }} 个学历层次</span>
        </div>
      </div>
      
      <div class="stat-card gpa-stats">
        <div class="stat-icon">
          <el-icon size="40"><Trophy /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ statistics.avgGpa || '0.0' }}</h3>
          <p>平均GPA</p>
          <span class="stat-trend">{{ statistics.excellentCount || 0 }} 人优秀(≥3.7)</span>
        </div>
      </div>
      
      <div class="stat-card active-students">
        <div class="stat-icon">
          <el-icon size="40"><Check /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ getActiveStudents() }}</h3>
          <p>在读学生</p>
          <span class="stat-trend">{{ getGraduateStudents() }} 人即将毕业</span>
        </div>
      </div>
    </div>

    <!-- 图表和表格区域 -->
    <div class="content-grid">
      <!-- 学院分布图表 -->
      <div class="chart-card">
        <div class="card-header">
          <h3>学院分布统计</h3>
          <el-icon><PieChart /></el-icon>
        </div>
        <div class="chart-content">
          <div class="college-chart">
            <div v-for="college in statistics.byCollege" :key="college._id" class="college-item">
              <div class="college-bar">
                <div 
                  class="college-fill" 
                  :style="{ 
                    width: (college.count / statistics.total * 100) + '%',
                    background: getCollegeColor(college._id)
                  }"
                ></div>
              </div>
              <div class="college-info">
                <span class="college-name">{{ college._id }}</span>
                <span class="college-count">{{ college.count }}人</span>
                <span class="college-percent">{{ ((college.count / statistics.total) * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 年级分布 -->
      <div class="chart-card">
        <div class="card-header">
          <h3>年级分布统计</h3>
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <div class="chart-content">
          <div class="grade-chart">
            <div v-for="grade in statistics.byGrade" :key="grade._id" class="grade-item">
              <div class="grade-bar">
                <div 
                  class="grade-fill" 
                  :style="{ 
                    height: (grade.count / getMaxGradeCount() * 100) + '%',
                    background: getGradeColor(grade._id)
                  }"
                ></div>
              </div>
              <div class="grade-info">
                <span class="grade-name">{{ grade._id }}</span>
                <span class="grade-count">{{ grade.count }}</span>
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
              <el-avatar :size="45">{{ student.name.charAt(0) }}</el-avatar>
              <div class="student-info">
                <h4>{{ student.name }}</h4>
                <p>{{ student.college }}</p>
                <p>{{ student.major }} · {{ student.grade }}</p>
              </div>
              <div class="student-meta">
                <el-tag :type="getStatusType(student.status)" size="small">
                  {{ student.status }}
                </el-tag>
                <div class="gpa-info">
                  <span class="gpa-label">GPA:</span>
                  <span class="gpa-value" :class="getGpaClass(student.academicInfo?.gpa)">
                    {{ student.academicInfo?.gpa || 'N/A' }}
                  </span>
                </div>
                <span class="add-time">{{ formatDate(student.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 奖学金统计 -->
      <div class="scholarship-card">
        <div class="card-header">
          <h3>奖学金统计</h3>
          <el-icon><Medal /></el-icon>
        </div>
        <div class="scholarship-content">
          <div class="scholarship-stats">
            <div class="scholarship-item">
              <div class="scholarship-icon national">
                <el-icon><GoldMedal /></el-icon>
              </div>
              <div class="scholarship-info">
                <h4>{{ statistics.scholarships?.national || 0 }}</h4>
                <p>国家级奖学金</p>
              </div>
            </div>
            <div class="scholarship-item">
              <div class="scholarship-icon provincial">
                <el-icon><Star /></el-icon>
              </div>
              <div class="scholarship-info">
                <h4>{{ statistics.scholarships?.provincial || 0 }}</h4>
                <p>省级奖学金</p>
              </div>
            </div>
            <div class="scholarship-item">
              <div class="scholarship-icon school">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="scholarship-info">
                <h4>{{ statistics.scholarships?.school || 0 }}</h4>
                <p>校级奖学金</p>
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
        <el-button type="warning" size="large" @click="$router.push('/settings')">
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
        day: 'numeric',
        weekday: 'long'
      })
    })
    
    // 获取统计数据
    const fetchStatistics = async () => {
      try {
        const response = await getStatistics()
        Object.assign(statistics, response.data)
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
    
    const getMaxGradeCount = () => {
      return Math.max(...statistics.byGrade.map(g => g.count), 1)
    }
    
    const getCollegeColor = (college) => {
      const colors = [
        '#409eff', '#67c23a', '#e6a23c', '#f56c6c', 
        '#909399', '#c71585', '#ff6347', '#32cd32'
      ]
      const index = college.length % colors.length
      return colors[index]
    }
    
    const getGradeColor = (grade) => {
      const gradeColors = {
        '大一': '#67c23a',
        '大二': '#409eff', 
        '大三': '#e6a23c',
        '大四': '#f56c6c',
        '研一': '#909399',
        '研二': '#c71585',
        '研三': '#ff6347'
      }
      return gradeColors[grade] || '#409eff'
    }
    
    const getStatusType = (status) => {
      const statusTypes = {
        '在读': 'success',
        '休学': 'warning',
        '退学': 'danger',
        '毕业': 'info',
        '延期毕业': 'warning'
      }
      return statusTypes[status] || 'info'
    }
    
    const getGpaClass = (gpa) => {
      if (!gpa) return 'gpa-na'
      if (gpa >= 3.7) return 'gpa-excellent'
      if (gpa >= 3.0) return 'gpa-good'
      return 'gpa-normal'
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('zh-CN')
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
      getMaxGradeCount,
      getCollegeColor,
      getGradeColor,
      getStatusType,
      getGpaClass,
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
  min-height: 100vh;
}

/* 欢迎区域 */
.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  text-align: left;
}

.welcome-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.avatar-container {
  position: relative;
}

.user-avatar {
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: #67c23a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #409eff, #67c23a);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #303133;
}

.stat-content p {
  margin: 0 0 4px 0;
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.stat-trend {
  font-size: 12px;
  color: #909399;
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card,
.recent-card,
.scholarship-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 20px 25px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

/* 学院分布图表 */
.college-chart {
  padding: 20px 25px;
}

.college-item {
  margin-bottom: 100px;
}

.college-item:last-child {
  margin-bottom: 0px;
}

.college-bar {
  height: 15px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
}

.college-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.college-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.college-name {
  color: #303133;
  font-weight: 500;
}

.college-count {
  color: #606266;
}

.college-percent {
  color: #909399;
  font-size: 12px;
}

/* 年级分布图表 */
.grade-chart {
  /* padding: 20px 25px; */
  display: flex;
  justify-content: space-around;
  align-items: end;
  height: 350px;
}

.grade-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.grade-bar {
  width: 30px;
  height: 280px;
  background: #f5f7fa;
  border-radius: 15px;
  display: flex;
  align-items: end;
  overflow: hidden;
}

.grade-fill {
  width: 100%;
  border-radius: 15px;
  transition: height 0.8s ease;
  min-height: 4px;
}

.grade-info {
  text-align: center;
}

.grade-name {
  display: block;
  font-size: 12px;
  color: #606266;
  margin-bottom: 2px;
}

.grade-count {
  display: block;
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

/* 最近学生列表 */
.recent-content {
  padding: 20px 25px;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.student-item:hover {
  background: #e3f2fd;
  transform: translateX(4px);
}

.student-info {
  flex: 1;
}

.student-info h4 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.student-info p {
  margin: 0 0 2px 0;
  color: #606266;
  font-size: 13px;
}

.student-meta {
  text-align: right;
}

.gpa-info {
  margin: 4px 0;
}

.gpa-label {
  font-size: 12px;
  color: #909399;
}

.gpa-value {
  font-size: 14px;
  font-weight: 600;
  margin-left: 4px;
}

.gpa-excellent { color: #67c23a; }
.gpa-good { color: #e6a23c; }
.gpa-normal { color: #f56c6c; }
.gpa-na { color: #909399; }

.add-time {
  font-size: 12px;
  color: #c0c4cc;
}

/* 奖学金统计 */
.scholarship-content {
  padding: 20px 25px;
}

.scholarship-stats {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.scholarship-item {
  text-align: center;
  flex: 1;
}

.scholarship-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  color: white;
  font-size: 24px;
}

.scholarship-icon.national {
  background: linear-gradient(135deg, #ffd700, #ffb347);
}

.scholarship-icon.provincial {
  background: linear-gradient(135deg, #c0c0c0, #a8a8a8);
}

.scholarship-icon.school {
  background: linear-gradient(135deg, #cd7f32, #b8860b);
}

.scholarship-info h4 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.scholarship-info p {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

/* 快速操作 */
.quick-actions {
  background: white;
  padding: 25px;
  border-radius: 16px;
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

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #c0c4cc;
}

.empty-state p {
  margin: 10px 0 0 0;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }
  
  .welcome-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
