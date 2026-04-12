<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">数据分析</h1>
        <p class="page-subtitle">学生数据分析与洞察</p>
      </div>
    </div>

    <!-- 概览指标 -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">平均绩点</span>
          <el-icon class="metric-icon"><Trophy /></el-icon>
        </div>
        <div class="metric-value">{{ statistics.avgGpa || '0.00' }}</div>
        <div class="metric-trend positive">
          <span class="trend-value">{{ statistics.excellentCount || 0 }} 人</span>
          <span class="trend-label">绩点 >= 3.7</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">奖学金获得率</span>
          <el-icon class="metric-icon"><Medal /></el-icon>
        </div>
        <div class="metric-value">{{ scholarshipRate }}%</div>
        <div class="metric-trend neutral">
          <span class="trend-value">{{ totalScholarships }} 项</span>
          <span class="trend-label">奖学金总数</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">男女比例</span>
          <el-icon class="metric-icon"><User /></el-icon>
        </div>
        <div class="metric-value">{{ genderRatioText }}</div>
        <div class="metric-trend neutral">
          <span class="trend-value">共 {{ statistics.total || 0 }} 人</span>
          <span class="trend-label">学生总数</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">学业预警</span>
          <el-icon class="metric-icon"><Warning /></el-icon>
        </div>
        <div class="metric-value">{{ lowGpaStudents.length }}</div>
        <div class="metric-trend" :class="lowGpaStudents.length > 0 ? 'negative' : 'positive'">
          <span class="trend-value">绩点 &lt; 2.0</span>
          <span class="trend-label">需要关注</span>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="content-layout">
      <div class="main-column">
        <!-- GPA 分布 -->
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">绩点分布</h3>
          </div>
          <div class="panel-body">
            <div class="simple-bar-chart">
              <div v-for="item in gpaDistribution" :key="item.label" class="bar-row">
                <div class="bar-label">
                  <span class="label-name">{{ item.label }}</span>
                  <span class="label-value">{{ item.count }} ({{ item.percent }}%)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ width: item.percent + '%', backgroundColor: item.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 各学院成绩对比 -->
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">各学院绩点对比</h3>
          </div>
          <div class="panel-body">
            <div v-if="collegeGpaData.length === 0" class="empty-state">
              <span class="empty-text">暂无数据</span>
            </div>
            <div v-else class="simple-bar-chart">
              <div v-for="item in collegeGpaData" :key="item.college" class="bar-row">
                <div class="bar-label">
                  <span class="label-name">{{ item.college }}</span>
                  <span class="label-value">均值 {{ item.avgGpa }} · {{ item.count }} 人</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ width: (item.avgGpa / 4.0 * 100) + '%', backgroundColor: '#3b82f6' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 各年级对比 -->
        <div class="charts-row">
          <div class="panel">
            <div class="panel-header">
              <h3 class="panel-title">年级分布</h3>
            </div>
            <div class="panel-body">
              <div class="grade-stats-grid">
                <div v-for="grade in statistics.byGrade" :key="grade._id" class="grade-stat-box">
                  <div class="grade-count">{{ grade.count }}</div>
                  <div class="grade-name">{{ grade._id }}</div>
                </div>
                <div v-if="!statistics.byGrade || statistics.byGrade.length === 0" class="empty-state-inline">
                  <span class="empty-text">暂无数据</span>
                </div>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3 class="panel-title">学历分布</h3>
            </div>
            <div class="panel-body">
              <div class="grade-stats-grid">
                <div v-for="degree in statistics.byDegree" :key="degree._id" class="grade-stat-box">
                  <div class="grade-count">{{ degree.count }}</div>
                  <div class="grade-name">{{ degree._id }}</div>
                </div>
                <div v-if="!statistics.byDegree || statistics.byDegree.length === 0" class="empty-state-inline">
                  <span class="empty-text">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="side-column">
        <!-- 性别分布 -->
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">性别分布</h3>
          </div>
          <div class="panel-body">
            <div class="donut-chart">
              <svg viewBox="0 0 120 120" class="donut-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" stroke-width="16" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" stroke-width="16"
                  :stroke-dasharray="maleDash" stroke-dashoffset="0"
                  stroke-linecap="round" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f472b6" stroke-width="16"
                  :stroke-dasharray="femaleDash" :stroke-dashoffset="'-' + maleLength"
                  stroke-linecap="round" transform="rotate(-90 60 60)" />
              </svg>
              <div class="donut-center">
                <div class="donut-total">{{ statistics.total || 0 }}</div>
                <div class="donut-label">总计</div>
              </div>
            </div>
            <div class="legend-list">
              <div class="legend-item">
                <span class="legend-dot" style="background-color: #3b82f6;"></span>
                <span class="legend-name">男</span>
                <span class="legend-value">{{ genderData.male }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background-color: #f472b6;"></span>
                <span class="legend-name">女</span>
                <span class="legend-value">{{ genderData.female }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 政治面貌分布 -->
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">政治面貌</h3>
          </div>
          <div class="panel-body p-0">
            <div class="stat-list">
              <div v-for="item in politicalData" :key="item.name" class="stat-item">
                <div class="stat-info">
                  <span class="stat-name">{{ item.name }}</span>
                  <span class="stat-count">{{ item.count }}</span>
                </div>
                <div class="stat-bar-track">
                  <div class="stat-bar-fill" :style="{ width: item.percent + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 学业预警 -->
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">学业预警</h3>
            <span class="alert-badge" v-if="lowGpaStudents.length > 0">{{ lowGpaStudents.length }}</span>
          </div>
          <div class="panel-body p-0">
            <div v-if="lowGpaStudents.length === 0" class="empty-state">
              <span class="empty-text">暂无学业预警</span>
            </div>
            <div v-else class="feed-list">
              <div v-for="student in lowGpaStudents" :key="student._id" class="feed-item">
                <el-avatar :size="36" class="feed-avatar">{{ student.name.charAt(0) }}</el-avatar>
                <div class="feed-content">
                  <div class="feed-name">{{ student.name }}</div>
                  <div class="feed-meta">{{ student.college }} · {{ student.grade }}</div>
                </div>
                <div class="feed-gpa warning">{{ student.academicInfo?.gpa?.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { getStatistics, getStudents } from '../api'
import { Trophy, Medal, User, Warning } from '@element-plus/icons-vue'

export default {
  name: 'Analytics',
  components: { Trophy, Medal, User, Warning },
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

    const allStudents = ref([])

    // Gender data
    const genderData = computed(() => {
      const male = allStudents.value.filter(s => s.gender === '男').length
      const female = allStudents.value.filter(s => s.gender === '女').length
      return { male, female }
    })

    const genderRatioText = computed(() => {
      const { male, female } = genderData.value
      if (male === 0 && female === 0) return '0 : 0'
      return `${male} : ${female}`
    })

    // SVG donut
    const circumference = 2 * Math.PI * 50
    const maleLength = computed(() => {
      const total = statistics.total || 1
      return (genderData.value.male / total) * circumference
    })
    const maleDash = computed(() => `${maleLength.value} ${circumference - maleLength.value}`)
    const femaleDash = computed(() => {
      const total = statistics.total || 1
      const len = (genderData.value.female / total) * circumference
      return `${len} ${circumference - len}`
    })

    // Political status
    const politicalData = computed(() => {
      const map = {}
      allStudents.value.forEach(s => {
        const key = s.politicalStatus || '未知'
        map[key] = (map[key] || 0) + 1
      })
      const total = allStudents.value.length || 1
      return Object.entries(map)
        .map(([name, count]) => ({ name, count, percent: Math.round(count / total * 100) }))
        .sort((a, b) => b.count - a.count)
    })

    // GPA distribution
    const gpaDistribution = computed(() => {
      const bins = [
        { label: '3.7 - 4.0（优秀）', min: 3.7, max: 4.01, color: '#10b981', count: 0 },
        { label: '3.0 - 3.69（良好）', min: 3.0, max: 3.7, color: '#3b82f6', count: 0 },
        { label: '2.0 - 2.99（一般）', min: 2.0, max: 3.0, color: '#f59e0b', count: 0 },
        { label: '0 - 1.99（预警）', min: 0, max: 2.0, color: '#ef4444', count: 0 }
      ]
      allStudents.value.forEach(s => {
        const gpa = s.academicInfo?.gpa ?? -1
        if (gpa < 0) return
        for (const bin of bins) {
          if (gpa >= bin.min && gpa < bin.max) { bin.count++; break }
        }
      })
      const total = allStudents.value.length || 1
      return bins.map(b => ({ ...b, percent: Math.round(b.count / total * 100) }))
    })

    // College GPA comparison
    const collegeGpaData = computed(() => {
      const map = {}
      allStudents.value.forEach(s => {
        const college = s.college
        if (!college) return
        if (!map[college]) map[college] = { total: 0, sum: 0, count: 0 }
        map[college].count++
        if (s.academicInfo?.gpa) {
          map[college].sum += s.academicInfo.gpa
          map[college].total++
        }
      })
      return Object.entries(map)
        .map(([college, data]) => ({
          college,
          avgGpa: data.total > 0 ? (data.sum / data.total).toFixed(2) : '0.00',
          count: data.count
        }))
        .sort((a, b) => parseFloat(b.avgGpa) - parseFloat(a.avgGpa))
    })

    // Low GPA students
    const lowGpaStudents = computed(() => {
      return allStudents.value
        .filter(s => s.academicInfo?.gpa != null && s.academicInfo.gpa < 2.0)
        .sort((a, b) => a.academicInfo.gpa - b.academicInfo.gpa)
    })

    // Scholarship stats
    const totalScholarships = computed(() => {
      const s = statistics.scholarships || {}
      return Object.values(s).reduce((sum, v) => sum + v, 0)
    })
    const scholarshipRate = computed(() => {
      if (!statistics.total) return 0
      const studentsWithScholarship = allStudents.value.filter(
        s => s.academicInfo?.scholarships?.length > 0
      ).length
      return Math.round(studentsWithScholarship / statistics.total * 100)
    })

    const fetchData = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          getStatistics(),
          getStudents({ page: 1, limit: 100 })
        ])
        Object.assign(statistics, statsRes.data)
        allStudents.value = studentsRes.data.students || []
      } catch (error) {
        console.error('Failed to fetch analytics data:', error)
      }
    }

    onMounted(fetchData)

    return {
      statistics,
      allStudents,
      genderData,
      genderRatioText,
      maleLength,
      maleDash,
      femaleDash,
      politicalData,
      gpaDistribution,
      collegeGpaData,
      lowGpaStudents,
      totalScholarships,
      scholarshipRate
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

/* 页面头部 */
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

/* 指标卡片 */
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

.metric-trend.positive .trend-value { color: #10b981; font-weight: 500; }
.metric-trend.negative .trend-value { color: #ef4444; font-weight: 500; }
.metric-trend.neutral .trend-value { color: #6b7280; font-weight: 500; }
.trend-label { color: #9ca3af; }

/* 布局 */
.content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .content-layout { grid-template-columns: 1fr; }
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.side-column {
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
  .charts-row { grid-template-columns: 1fr; }
}

/* 面板 */
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

/* 柱状图 */
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

.label-name { color: #4b5563; font-weight: 500; }
.label-value { color: #111827; font-weight: 600; }

.bar-track {
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
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

/* Donut chart */
.donut-chart {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 20px;
}

.donut-svg {
  width: 100%;
  height: 100%;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.donut-total {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.donut-label {
  font-size: 12px;
  color: #6b7280;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-name {
  flex: 1;
  font-size: 14px;
  color: #4b5563;
}

.legend-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

/* 统计列表 */
.stat-list {
  display: flex;
  flex-direction: column;
}

.stat-item {
  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stat-name {
  font-size: 13px;
  color: #4b5563;
  font-weight: 500;
}

.stat-count {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.stat-bar-track {
  height: 4px;
  background-color: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 2px;
  transition: width 0.6s ease;
}

/* Alert badge */
.alert-badge {
  background-color: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

/* Feed list */
.feed-list {
  display: flex;
  flex-direction: column;
}

.feed-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
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

.feed-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.feed-meta {
  font-size: 12px;
  color: #6b7280;
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

.feed-gpa.warning {
  background-color: #fef2f2;
  color: #ef4444;
}

/* Empty state */
.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.empty-state-inline {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
}

.empty-text {
  color: #9ca3af;
  font-size: 14px;
}
</style>
