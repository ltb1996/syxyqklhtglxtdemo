<template>
    <div class="student-detail">
      <div class="detail-header">
        <div class="student-avatar">
          <el-avatar :size="80" :src="student?.avatar">
            {{ student?.name?.charAt(0) }}
          </el-avatar>
        </div>
        <div class="student-basic">
          <h2>{{ student?.name }}</h2>
          <p>{{ student?.college }} · {{ student?.major }}</p>
          <el-tag :type="getStatusType(student?.status)">{{ student?.status }}</el-tag>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button @click="handleClose">关闭</el-button>
        </div>
      </div>
  
      <el-tabs v-model="activeTab" class="detail-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="info-section">
            <h3>个人信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="姓名">{{ student?.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ student?.gender }}</el-descriptions-item>
              <el-descriptions-item label="出生日期">{{ formatDate(student?.birthday) }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ calculateAge(student?.birthday) }}岁</el-descriptions-item>
              <el-descriptions-item label="身份证号">{{ student?.idCard }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ student?.phone }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ student?.email }}</el-descriptions-item>
              <el-descriptions-item label="国籍">{{ student?.nationality }}</el-descriptions-item>
              <el-descriptions-item label="政治面貌">{{ student?.politicalStatus }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
  
        <!-- 学籍信息 -->
        <el-tab-pane label="学籍信息" name="academic">
          <div class="info-section">
            <h3>学籍信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="学号">{{ student?.studentId }}</el-descriptions-item>
              <el-descriptions-item label="学院">{{ student?.college }}</el-descriptions-item>
              <el-descriptions-item label="专业">{{ student?.major }}</el-descriptions-item>
              <el-descriptions-item label="班级">{{ student?.class }}</el-descriptions-item>
              <el-descriptions-item label="年级">{{ student?.grade }}</el-descriptions-item>
              <el-descriptions-item label="学历层次">{{ student?.degree }}</el-descriptions-item>
              <el-descriptions-item label="入学年份">{{ student?.enrollmentYear }}</el-descriptions-item>
              <el-descriptions-item label="预计毕业年份">{{ student?.expectedGraduationYear }}</el-descriptions-item>
              <el-descriptions-item label="学习状态">
                <el-tag :type="getStatusType(student?.status)">{{ student?.status }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
  
          <div class="info-section" v-if="student?.dormitory">
            <h3>宿舍信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="宿舍楼">{{ student?.dormitory?.building || '未分配' }}</el-descriptions-item>
              <el-descriptions-item label="房间号">{{ student?.dormitory?.room || '未分配' }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
  
        <!-- 学术成绩 -->
        <el-tab-pane label="学术成绩" name="grades">
          <div class="info-section">
            <h3>学术表现</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="GPA">
                <span :class="getGpaClass(student?.academicInfo?.gpa)">
                  {{ student?.academicInfo?.gpa || 'N/A' }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="总学分">{{ student?.academicInfo?.totalCredits || 0 }}</el-descriptions-item>
              <el-descriptions-item label="已修学分">{{ student?.academicInfo?.completedCredits || 0 }}</el-descriptions-item>
              <el-descriptions-item label="学习进度">
                <el-progress 
                  :percentage="getStudyProgress()" 
                  :stroke-width="8"
                />
              </el-descriptions-item>
              <el-descriptions-item label="班级排名">{{ student?.academicInfo?.rank || 'N/A' }}</el-descriptions-item>
              <el-descriptions-item label="班级总人数">{{ student?.academicInfo?.totalStudents || 'N/A' }}</el-descriptions-item>
            </el-descriptions>
          </div>
  
          <!-- 奖学金 -->
          <div class="info-section" v-if="student?.academicInfo?.scholarships?.length">
            <h3>奖学金记录</h3>
            <el-table :data="student.academicInfo.scholarships" border>
              <el-table-column prop="name" label="奖学金名称" />
              <el-table-column prop="year" label="获奖年份" />
              <el-table-column prop="amount" label="金额" />
              <el-table-column prop="level" label="级别">
                <template #default="{ row }">
                  <el-tag :type="getScholarshipType(row.level)">{{ row.level }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
  
          <!-- 获奖记录 -->
          <div class="info-section" v-if="student?.academicInfo?.awards?.length">
            <h3>获奖记录</h3>
            <el-table :data="student.academicInfo.awards" border>
              <el-table-column prop="name" label="奖项名称" />
              <el-table-column prop="year" label="获奖年份" />
              <el-table-column prop="level" label="级别">
                <template #default="{ row }">
                  <el-tag :type="getAwardType(row.level)">{{ row.level }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip />
            </el-table>
          </div>
        </el-tab-pane>
  
        <!-- 家庭信息 -->
        <el-tab-pane label="家庭信息" name="family">
          <div class="info-section" v-if="student?.familyInfo">
            <h3>家庭成员</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="父亲姓名">{{ student?.familyInfo?.fatherName || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="父亲职业">{{ student?.familyInfo?.fatherOccupation || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="父亲电话">{{ student?.familyInfo?.fatherPhone || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="母亲姓名">{{ student?.familyInfo?.motherName || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="母亲职业">{{ student?.familyInfo?.motherOccupation || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="母亲电话">{{ student?.familyInfo?.motherPhone || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="家庭收入">{{ student?.familyInfo?.familyIncome || '未填写' }}</el-descriptions-item>
            </el-descriptions>
          </div>
  
          <div class="info-section" v-if="student?.familyInfo?.homeAddress">
            <h3>家庭地址</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="详细地址">
                {{ getFullAddress() }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
  
          <div class="info-section" v-if="student?.familyInfo?.emergencyContact">
            <h3>紧急联系人</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="姓名">{{ student?.familyInfo?.emergencyContact?.name || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="关系">{{ student?.familyInfo?.emergencyContact?.relationship || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="电话">{{ student?.familyInfo?.emergencyContact?.phone || '未填写' }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
  
        <!-- 就业信息 -->
        <el-tab-pane label="就业信息" name="career">
          <!-- 实习经历 -->
          <div class="info-section" v-if="student?.careerInfo?.internships?.length">
            <h3>实习经历</h3>
            <el-table :data="student.careerInfo.internships" border>
              <el-table-column prop="company" label="公司名称" />
              <el-table-column prop="position" label="职位" />
              <el-table-column label="实习时间">
                <template #default="{ row }">
                  {{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}
                </template>
              </el-table-column>
              <el-table-column prop="description" label="工作描述" show-overflow-tooltip />
            </el-table>
          </div>
  
          <!-- 求职意向 -->
          <div class="info-section" v-if="student?.careerInfo?.jobIntention">
            <h3>求职意向</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="意向行业">{{ student?.careerInfo?.jobIntention?.industry || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="意向职位">{{ student?.careerInfo?.jobIntention?.position || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="意向地点">{{ student?.careerInfo?.jobIntention?.location || '未填写' }}</el-descriptions-item>
              <el-descriptions-item label="期望薪资">{{ student?.careerInfo?.jobIntention?.expectedSalary || '未填写' }}</el-descriptions-item>
            </el-descriptions>
          </div>
  
          <!-- 技能 -->
          <div class="info-section" v-if="student?.careerInfo?.skills?.length">
            <h3>专业技能</h3>
            <div class="skills-container">
              <el-tag v-for="skill in student.careerInfo.skills" :key="skill" class="skill-tag">
                {{ skill }}
              </el-tag>
            </div>
          </div>
  
          <!-- 证书 -->
          <div class="info-section" v-if="student?.careerInfo?.certifications?.length">
            <h3>证书资格</h3>
            <el-table :data="student.careerInfo.certifications" border>
              <el-table-column prop="name" label="证书名称" />
              <el-table-column prop="issuer" label="颁发机构" />
              <el-table-column prop="issueDate" label="颁发日期">
                <template #default="{ row }">
                  {{ formatDate(row.issueDate) }}
                </template>
              </el-table-column>
              <el-table-column prop="expiryDate" label="有效期至">
                <template #default="{ row }">
                  {{ row.expiryDate ? formatDate(row.expiryDate) : '长期有效' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
  
          <!-- 语言能力 -->
          <div class="info-section" v-if="student?.careerInfo?.languages?.length">
            <h3>语言能力</h3>
            <el-table :data="student.careerInfo.languages" border>
              <el-table-column prop="language" label="语言" />
              <el-table-column prop="level" label="水平">
                <template #default="{ row }">
                  <el-tag :type="getLanguageType(row.level)">{{ row.level }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="certificate" label="证书" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
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
  .student-detail {
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .detail-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .student-basic {
    flex: 1;
  }
  
  .student-basic h2 {
    margin: 0 0 8px 0;
    color: #303133;
    font-size: 24px;
    font-weight: 600;
  }
  
  .student-basic p {
    margin: 0 0 8px 0;
    color: #606266;
    font-size: 14px;
  }
  
  .detail-actions {
    display: flex;
    gap: 10px;
  }
  
  .info-section {
    margin-bottom: 30px;
  }
  
  .info-section h3 {
    margin: 0 0 15px 0;
    color: #303133;
    font-size: 16px;
    font-weight: 600;
    border-left: 4px solid #409eff;
    padding-left: 10px;
  }
  
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .skill-tag {
    margin: 0;
  }
  
  .gpa-excellent { color: #67c23a; font-weight: 600; }
  .gpa-good { color: #e6a23c; font-weight: 600; }
  .gpa-normal { color: #f56c6c; font-weight: 600; }
  .gpa-na { color: #909399; }
  
  .detail-tabs {
    margin-top: 20px;
  }
  </style>