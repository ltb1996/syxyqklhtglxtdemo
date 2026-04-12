<template>
  <div class="student-detail-wrapper">
    <div class="detail-header-card">
      <div class="student-avatar-container">
        <el-avatar :size="72" :src="student?.avatar" class="modern-avatar">
          {{ student?.name?.charAt(0) }}
        </el-avatar>
      </div>
      <div class="student-core-info">
        <div class="name-row">
          <h2 class="student-name">{{ student?.name }}</h2>
          <span class="status-badge" :class="`status-${getStatusType(student?.status)}`">
            {{ student?.status }}
          </span>
        </div>
        <div class="meta-row">
          <span class="meta-item">{{ student?.studentId }}</span>
          <span class="meta-divider">·</span>
          <span class="meta-item">{{ student?.college }}</span>
          <span class="meta-divider">·</span>
          <span class="meta-item">{{ student?.major }}</span>
        </div>
      </div>
      <div class="header-actions">
        <el-button class="secondary-btn" @click="handleClose">关闭</el-button>
        <el-button type="primary" class="primary-btn" @click="handleEdit">
          <el-icon><Edit /></el-icon>编辑信息
        </el-button>
      </div>
    </div>

    <div class="detail-content">
      <el-tabs v-model="activeTab" class="modern-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="info-group">
            <h3 class="group-title">个人信息</h3>
            <div class="description-grid">
              <div class="desc-item">
                <span class="desc-label">姓名</span>
                <span class="desc-value">{{ student?.name }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">性别</span>
                <span class="desc-value">{{ student?.gender }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">出生日期</span>
                <span class="desc-value">{{ formatDate(student?.birthday) }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">年龄</span>
                <span class="desc-value">{{ calculateAge(student?.birthday) }}岁</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">身份证号</span>
                <span class="desc-value">{{ student?.idCard }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">联系电话</span>
                <span class="desc-value">{{ student?.phone }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">邮箱</span>
                <span class="desc-value">{{ student?.email }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">国籍</span>
                <span class="desc-value">{{ student?.nationality }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">政治面貌</span>
                <span class="desc-value">{{ student?.politicalStatus }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 学籍信息 -->
        <el-tab-pane label="学籍信息" name="academic">
          <div class="info-group">
            <h3 class="group-title">学籍情况</h3>
            <div class="description-grid">
              <div class="desc-item">
                <span class="desc-label">学号</span>
                <span class="desc-value">{{ student?.studentId }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">学院</span>
                <span class="desc-value">{{ student?.college }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">专业</span>
                <span class="desc-value">{{ student?.major }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">班级</span>
                <span class="desc-value">{{ student?.class }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">年级</span>
                <span class="desc-value">{{ student?.grade }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">学历层次</span>
                <span class="desc-value">{{ student?.degree }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">入学年份</span>
                <span class="desc-value">{{ student?.enrollmentYear }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">预计毕业年份</span>
                <span class="desc-value">{{ student?.expectedGraduationYear }}</span>
              </div>
            </div>
          </div>

          <div class="info-group" v-if="student?.dormitory">
            <h3 class="group-title">宿舍分配</h3>
            <div class="description-grid">
              <div class="desc-item">
                <span class="desc-label">宿舍楼</span>
                <span class="desc-value">{{ student?.dormitory?.building || '未分配' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">房间号</span>
                <span class="desc-value">{{ student?.dormitory?.room || '未分配' }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 学术成绩 -->
        <el-tab-pane label="学术表现" name="grades">
          <div class="info-group">
            <h3 class="group-title">学业概览</h3>
            <div class="academic-stats-grid">
              <div class="academic-stat-box">
                <div class="stat-value" :class="getGpaClass(student?.academicInfo?.gpa)">
                  {{ student?.academicInfo?.gpa || 'N/A' }}
                </div>
                <div class="stat-label">累计 GPA</div>
              </div>
              <div class="academic-stat-box">
                <div class="stat-value">{{ student?.academicInfo?.completedCredits || 0 }} <span class="stat-unit">/ {{ student?.academicInfo?.totalCredits || 0 }}</span></div>
                <div class="stat-label">已修 / 总学分</div>
              </div>
              <div class="academic-stat-box">
                <div class="stat-value">{{ getStudyProgress() }}<span class="stat-unit">%</span></div>
                <div class="stat-label">学习进度</div>
              </div>
              <div class="academic-stat-box">
                <div class="stat-value">{{ student?.academicInfo?.rank || 'N/A' }} <span class="stat-unit">/ {{ student?.academicInfo?.totalStudents || 'N/A' }}</span></div>
                <div class="stat-label">班级排名</div>
              </div>
            </div>
          </div>

          <!-- 奖学金 -->
          <div class="info-group" v-if="student?.academicInfo?.scholarships?.length">
            <h3 class="group-title">奖学金记录</h3>
            <div class="modern-table-wrapper">
              <el-table :data="student.academicInfo.scholarships" style="width: 100%" class="modern-inner-table">
                <el-table-column prop="name" label="奖学金名称" />
                <el-table-column prop="year" label="获奖年份" width="120" />
                <el-table-column prop="amount" label="金额" width="120" />
                <el-table-column label="级别" width="120">
                  <template #default="{ row }">
                    <span class="level-badge" :class="`level-${getScholarshipType(row.level)}`">{{ row.level }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 获奖记录 -->
          <div class="info-group" v-if="student?.academicInfo?.awards?.length">
            <h3 class="group-title">获奖记录</h3>
            <div class="modern-table-wrapper">
              <el-table :data="student.academicInfo.awards" style="width: 100%" class="modern-inner-table">
                <el-table-column prop="name" label="奖项名称" />
                <el-table-column prop="year" label="获奖年份" width="120" />
                <el-table-column label="级别" width="120">
                  <template #default="{ row }">
                    <span class="level-badge" :class="`level-${getAwardType(row.level)}`">{{ row.level }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" show-overflow-tooltip />
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <!-- 家庭信息 -->
        <el-tab-pane label="家庭关系" name="family">
          <div class="info-group" v-if="student?.familyInfo">
            <h3 class="group-title">家庭成员</h3>
            <div class="description-grid">
              <div class="desc-item">
                <span class="desc-label">父亲姓名</span>
                <span class="desc-value">{{ student?.familyInfo?.fatherName || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">父亲电话</span>
                <span class="desc-value">{{ student?.familyInfo?.fatherPhone || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">父亲职业</span>
                <span class="desc-value">{{ student?.familyInfo?.fatherOccupation || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">母亲姓名</span>
                <span class="desc-value">{{ student?.familyInfo?.motherName || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">母亲电话</span>
                <span class="desc-value">{{ student?.familyInfo?.motherPhone || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">母亲职业</span>
                <span class="desc-value">{{ student?.familyInfo?.motherOccupation || '未填写' }}</span>
              </div>
              <div class="desc-item full-width">
                <span class="desc-label">家庭年收入</span>
                <span class="desc-value">{{ student?.familyInfo?.familyIncome || '未填写' }}</span>
              </div>
            </div>
          </div>

          <div class="info-group" v-if="student?.familyInfo?.homeAddress">
            <h3 class="group-title">家庭住址</h3>
            <div class="description-grid">
              <div class="desc-item full-width">
                <span class="desc-label">详细地址</span>
                <span class="desc-value">{{ getFullAddress() }}</span>
              </div>
            </div>
          </div>

          <div class="info-group" v-if="student?.familyInfo?.emergencyContact">
            <h3 class="group-title">紧急联系人</h3>
            <div class="description-grid">
              <div class="desc-item">
                <span class="desc-label">联系人姓名</span>
                <span class="desc-value">{{ student?.familyInfo?.emergencyContact?.name || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">与本人关系</span>
                <span class="desc-value">{{ student?.familyInfo?.emergencyContact?.relationship || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">联系电话</span>
                <span class="desc-value">{{ student?.familyInfo?.emergencyContact?.phone || '未填写' }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 就业信息 -->
        <el-tab-pane label="就业发展" name="career">
          <!-- 实习经历 -->
          <div class="info-group" v-if="student?.careerInfo?.internships?.length">
            <h3 class="group-title">实习经历</h3>
            <div class="experience-list">
              <div class="experience-item" v-for="(internship, index) in student.careerInfo.internships" :key="index">
                <div class="exp-header">
                  <h4 class="exp-company">{{ internship.company }}</h4>
                  <span class="exp-date">{{ formatDate(internship.startDate) }} - {{ formatDate(internship.endDate) }}</span>
                </div>
                <div class="exp-position">{{ internship.position }}</div>
                <p class="exp-desc">{{ internship.description }}</p>
              </div>
            </div>
          </div>

          <!-- 求职意向 -->
          <div class="info-group" v-if="student?.careerInfo?.jobIntention">
            <h3 class="group-title">求职意向</h3>
            <div class="description-grid">
              <div class="desc-item">
                <span class="desc-label">意向行业</span>
                <span class="desc-value">{{ student?.careerInfo?.jobIntention?.industry || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">意向职位</span>
                <span class="desc-value">{{ student?.careerInfo?.jobIntention?.position || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">意向城市</span>
                <span class="desc-value">{{ student?.careerInfo?.jobIntention?.location || '未填写' }}</span>
              </div>
              <div class="desc-item">
                <span class="desc-label">期望薪资</span>
                <span class="desc-value">{{ student?.careerInfo?.jobIntention?.expectedSalary || '未填写' }}</span>
              </div>
            </div>
          </div>

          <!-- 技能和语言 -->
          <div class="info-group" v-if="student?.careerInfo?.skills?.length || student?.careerInfo?.languages?.length">
            <h3 class="group-title">技能与语言</h3>
            
            <div class="skills-row" v-if="student?.careerInfo?.skills?.length">
              <span class="skills-label">专业技能：</span>
              <div class="skills-tags">
                <span v-for="skill in student.careerInfo.skills" :key="skill" class="modern-tag">
                  {{ skill }}
                </span>
              </div>
            </div>
            
            <div class="modern-table-wrapper" style="margin-top: 16px;" v-if="student?.careerInfo?.languages?.length">
              <el-table :data="student.careerInfo.languages" style="width: 100%" class="modern-inner-table">
                <el-table-column prop="language" label="语言种类" />
                <el-table-column label="掌握水平" width="120">
                  <template #default="{ row }">
                    <span class="level-badge" :class="`level-${getLanguageType(row.level)}`">{{ row.level }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="certificate" label="相关证书" />
              </el-table>
            </div>
          </div>

          <!-- 证书 -->
          <div class="info-group" v-if="student?.careerInfo?.certifications?.length">
            <h3 class="group-title">资格证书</h3>
            <div class="modern-table-wrapper">
              <el-table :data="student.careerInfo.certifications" style="width: 100%" class="modern-inner-table">
                <el-table-column prop="name" label="证书名称" />
                <el-table-column prop="issuer" label="颁发机构" />
                <el-table-column label="颁发日期" width="120">
                  <template #default="{ row }">
                    {{ formatDate(row.issueDate) }}
                  </template>
                </el-table-column>
                <el-table-column label="有效期至" width="120">
                  <template #default="{ row }">
                    {{ row.expiryDate ? formatDate(row.expiryDate) : '长期有效' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'

export default {
  name: 'StudentDetail',
  components: {
    Edit
  },
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'close'],
  setup(props, { emit }) {
    const activeTab = ref('basic')

    const getStatusType = (status) => {
      const statusMap = {
        '在读': 'success',
        '休学': 'warning',
        '退学': 'danger',
        '毕业': 'info',
        '延期毕业': 'warning'
      }
      return statusMap[status] || 'info'
    }

    const getGpaClass = (gpa) => {
      if (!gpa) return 'gpa-na'
      if (gpa >= 3.7) return 'gpa-excellent'
      if (gpa >= 3.0) return 'gpa-good'
      return 'gpa-normal'
    }

    const getStudyProgress = () => {
      const academic = props.student?.academicInfo
      if (!academic?.totalCredits || !academic?.completedCredits) return 0
      return Math.round((academic.completedCredits / academic.totalCredits) * 100)
    }

    const getScholarshipType = (level) => {
      const typeMap = {
        '国家级': 'danger',
        '省级': 'warning',
        '校级': 'success',
        '院级': 'info'
      }
      return typeMap[level] || 'info'
    }

    const getAwardType = (level) => {
      const typeMap = {
        '国家级': 'danger',
        '省级': 'warning',
        '校级': 'success',
        '院级': 'info'
      }
      return typeMap[level] || 'info'
    }

    const getLanguageType = (level) => {
      const typeMap = {
        '母语': 'danger',
        '高级': 'success',
        '中级': 'warning',
        '初级': 'info'
      }
      return typeMap[level] || 'info'
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('zh-CN')
    }

    const calculateAge = (birthday) => {
      if (!birthday) return ''
      const today = new Date()
      const birthDate = new Date(birthday)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    }

    const getFullAddress = () => {
      const addr = props.student?.familyInfo?.homeAddress
      if (!addr) return '未填写'
      return `${addr.province || ''}${addr.city || ''}${addr.district || ''}${addr.detail || ''}`
    }

    const handleEdit = () => {
      emit('edit', props.student)
    }

    const handleClose = () => {
      emit('close')
    }

    return {
      activeTab,
      getStatusType,
      getGpaClass,
      getStudyProgress,
      getScholarshipType,
      getAwardType,
      getLanguageType,
      formatDate,
      calculateAge,
      getFullAddress,
      handleEdit,
      handleClose
    }
  }
}
</script>

<style scoped>
.student-detail-wrapper {
  max-height: 75vh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
}

.student-detail-wrapper::-webkit-scrollbar {
  display: none;
}

/* 顶部信息卡片 */
.detail-header-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background-color: #f9fafb;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #f3f4f6;
}

.modern-avatar {
  background-color: #e5e7eb;
  color: #4b5563;
  font-size: 24px;
  font-weight: 600;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.student-core-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.01em;
}

.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.meta-divider {
  color: #d1d5db;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 按钮样式 */
.primary-btn {
  background-color: #111827;
  border-color: #111827;
  color: white;
  border-radius: 6px;
  font-weight: 500;
}
.primary-btn:hover {
  background-color: #374151;
  border-color: #374151;
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

/* 状态徽章 */
.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}
.status-success { background-color: #d1fae5; color: #065f46; }
.status-warning { background-color: #fef3c7; color: #92400e; }
.status-danger { background-color: #fee2e2; color: #991b1b; }
.status-info { background-color: #f3f4f6; color: #4b5563; }

/* 选项卡内容区 */
.modern-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e5e7eb;
}

.modern-tabs :deep(.el-tabs__item) {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.modern-tabs :deep(.el-tabs__item.is-active) {
  color: #111827;
}

.modern-tabs :deep(.el-tabs__active-bar) {
  background-color: #111827;
}

/* 信息分组 */
.info-group {
  margin-top: 24px;
  margin-bottom: 32px;
}

.group-title {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

/* 描述网格 */
.description-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
  padding: 20px;
}

.desc-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.desc-item.full-width {
  grid-column: 1 / -1;
}

.desc-label {
  font-size: 13px;
  color: #6b7280;
}

.desc-value {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

/* 学术表现数据网格 */
.academic-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.academic-stat-box {
  background-color: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.stat-unit {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.gpa-excellent { color: #10b981; }
.gpa-good { color: #d97706; }
.gpa-normal { color: #ef4444; }
.gpa-na { color: #9ca3af; }

/* 内部表格样式化 */
.modern-table-wrapper {
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.modern-inner-table :deep(.el-table__inner-wrapper::before) {
  display: none;
}
.modern-inner-table :deep(th.el-table__cell) {
  background-color: #f9fafb;
  color: #6b7280;
  font-weight: 500;
  border-bottom: 1px solid #f3f4f6;
}
.modern-inner-table :deep(td.el-table__cell) {
  border-bottom: 1px solid #f3f4f6;
}
.modern-inner-table :deep(.el-table__row:last-child td.el-table__cell) {
  border-bottom: none;
}

.level-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}
.level-danger { background-color: #fee2e2; color: #991b1b; }
.level-warning { background-color: #fef3c7; color: #92400e; }
.level-success { background-color: #d1fae5; color: #065f46; }
.level-info { background-color: #f3f4f6; color: #4b5563; }

/* 实习经历列表 */
.experience-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.experience-item {
  padding: 16px;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  background-color: #ffffff;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.exp-company {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.exp-date {
  font-size: 13px;
  color: #6b7280;
}

.exp-position {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 8px;
}

.exp-desc {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* 技能标签 */
.skills-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.skills-label {
  font-size: 14px;
  color: #6b7280;
  padding-top: 4px;
}
.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modern-tag {
  background-color: #f3f4f6;
  color: #374151;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}
</style>
