<template>
  <div class="students-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>大学生信息管理</h1>
        <p>管理和查看所有大学生的详细信息</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加学生
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="search-box">
          <el-input
            v-model="searchForm.search"
            placeholder="搜索学生姓名、学号、学院、专业..."
            size="large"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <el-button type="primary" size="large" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </div>
      
      <div class="filter-row">
        <el-select v-model="searchForm.college" placeholder="选择学院" clearable size="large">
          <el-option label="全部学院" value="" />
          <el-option label="计算机科学与技术学院" value="计算机科学与技术学院" />
          <el-option label="经济管理学院" value="经济管理学院" />
          <el-option label="机械工程学院" value="机械工程学院" />
          <el-option label="外国语学院" value="外国语学院" />
          <el-option label="数学与统计学院" value="数学与统计学院" />
        </el-select>
        
        <el-select v-model="searchForm.grade" placeholder="选择年级" clearable size="large">
          <el-option label="全部年级" value="" />
          <el-option label="大一" value="大一" />
          <el-option label="大二" value="大二" />
          <el-option label="大三" value="大三" />
          <el-option label="大四" value="大四" />
          <el-option label="研一" value="研一" />
          <el-option label="研二" value="研二" />
          <el-option label="研三" value="研三" />
        </el-select>
        
        <el-select v-model="searchForm.degree" placeholder="选择学历" clearable size="large">
          <el-option label="全部学历" value="" />
          <el-option label="本科" value="本科" />
          <el-option label="硕士" value="硕士" />
          <el-option label="博士" value="博士" />
        </el-select>
        
        <el-select v-model="searchForm.status" placeholder="选择状态" clearable size="large">
          <el-option label="全部状态" value="" />
          <el-option label="在读" value="在读" />
          <el-option label="休学" value="休学" />
          <el-option label="毕业" value="毕业" />
        </el-select>
        
        <el-button @click="resetSearch" size="large">重置</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="24" color="#409eff"><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ total }}</div>
          <div class="stat-label">总学生数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="24" color="#67c23a"><School /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.byCollege?.length || 0 }}</div>
          <div class="stat-label">学院数量</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="24" color="#e6a23c"><Trophy /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.scholarshipStudentsCount || 0 }}</div>
          <div class="stat-label">获奖学金人数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="24" color="#f56c6c"><Star /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ statistics.avgGpa || '0.0' }}</div>
          <div class="stat-label">平均GPA</div>
        </div>
      </div>
    </div>

    <!-- 学生列表 -->
    <div class="table-container">
      <el-table
        :data="students"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              {{ row.name?.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="college" label="学院" width="150" show-overflow-tooltip />
        <el-table-column prop="major" label="专业" width="150" show-overflow-tooltip />
        <el-table-column prop="grade" label="年级" width="80" />
        <el-table-column prop="degree" label="学历" width="80" />
        <el-table-column prop="class" label="班级" width="120" />
        <el-table-column label="GPA" width="80">
          <template #default="{ row }">
            <el-tag :type="getGpaType(row.academicInfo?.gpa)">
              {{ row.academicInfo?.gpa || 'N/A' }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="学习进度" width="100">
          <template #default="{ row }">
            <el-progress 
              :percentage="getStudyProgress(row)" 
              :stroke-width="8"
              :show-text="false"
            />
            <span class="progress-text">{{ getStudyProgress(row) }}%</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewStudent(row)">
              详情
            </el-button>
            <el-button type="warning" size="small" @click="editStudent(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteStudent(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 批量操作 -->
    <div class="batch-actions" v-if="selectedStudents.length > 0">
      <div class="batch-info">
        已选择 {{ selectedStudents.length }} 个学生
      </div>
      <div class="batch-buttons">
        <el-button type="warning" @click="batchEdit">批量编辑</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
        <el-button type="success" @click="exportData">导出数据</el-button>
      </div>
    </div>

    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingStudent ? '编辑学生信息' : '添加学生'"
      width="60%"
      :before-close="handleCloseDialog"
    >
      <StudentForm
        :student="editingStudent"
        @success="handleFormSuccess"
        @cancel="handleCloseDialog"
      />
    </el-dialog>

    <!-- 学生详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="学生详细信息" width="50%">
      <StudentDetail
        :student="selectedStudent"
        @edit="handleEditFromDetail"
        @close="showDetailDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudents, deleteStudent as deleteStudentApi, getStatistics } from '../api'
import {
  Plus, Search, User, School, Trophy, Star
} from '@element-plus/icons-vue'
import StudentForm from './StudentForm.vue'
import StudentDetail from './StudentDetail.vue'

export default {
  name: 'Students',
  components: {
    Plus, Search, User, School, Trophy, Star,
    StudentForm,
    StudentDetail
  },
  setup() {
    const loading = ref(false)
    const students = ref([])
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(20)
    const selectedStudents = ref([])
    const showAddDialog = ref(false)
    const statistics = ref({})
    const showDetailDialog = ref(false)
    const editingStudent = ref(null)
    const selectedStudent = ref(null)

    const searchForm = reactive({
      search: '',
      college: '',
      grade: '',
      degree: '',
      status: ''
    })

    // 获取学生列表
    const fetchStudents = async () => {
      loading.value = true
      try {
        const params = {
          page: currentPage.value,
          limit: pageSize.value,
          ...searchForm
        }
        
        const response = await getStudents(params)
        students.value = response.data.students
        total.value = response.data.total
      } catch (error) {
        ElMessage.error('获取学生列表失败')
      } finally {
        loading.value = false
      }
    }

    // 获取统计数据
    const fetchStatistics = async () => {
      try {
        const response = await getStatistics()
        statistics.value = response.data
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    }

    // GPA类型
    const getGpaType = (gpa) => {
      if (!gpa) return 'info'
      if (gpa >= 3.7) return 'success'
      if (gpa >= 3.0) return 'warning'
      return 'danger'
    }

    // 学习进度
    const getStudyProgress = (student) => {
      const academic = student.academicInfo
      if (!academic?.totalCredits || !academic?.completedCredits) return 0
      return Math.round((academic.completedCredits / academic.totalCredits) * 100)
    }

    // 状态类型
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

    // 搜索
    const handleSearch = () => {
      currentPage.value = 1
      fetchStudents()
    }

    // 重置搜索
    const resetSearch = () => {
      Object.keys(searchForm).forEach(key => {
        searchForm[key] = ''
      })
      currentPage.value = 1
      fetchStudents()
    }

    // 分页
    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      fetchStudents()
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchStudents()
    }

    // 选择
    const handleSelectionChange = (selection) => {
      selectedStudents.value = selection
    }

    // 查看学生详情
    const viewStudent = (student) => {
      selectedStudent.value = student
      showDetailDialog.value = true
    }

    // 编辑学生
    const editStudent = (student) => {
      editingStudent.value = student
      showAddDialog.value = true
    }

    // 删除学生
    const deleteStudent = async (student) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除学生 "${student.name}" 吗？此操作不可恢复。`,
          '确认删除',
          {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        )

        await deleteStudentApi(student._id)
        ElMessage.success('删除成功')
        fetchStudents()
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    }

    // 批量操作
    const batchEdit = () => {
      ElMessage.info('批量编辑功能开发中...')
    }

    const batchDelete = async () => {
      try {
        await ElMessageBox.confirm(
          `确定要删除选中的 ${selectedStudents.value.length} 个学生吗？`,
          '批量删除',
          { type: 'warning' }
        )
        ElMessage.info('批量删除功能开发中...')
      } catch (error) {
        // 取消操作
      }
    }

    const exportData = () => {
      ElMessage.info('导出功能开发中...')
    }

    const handleCloseDialog = () => {
      showAddDialog.value = false
      editingStudent.value = null
    }

    const handleFormSuccess = () => {
      handleCloseDialog()
      fetchStudents()
    }

    const handleEditFromDetail = (student) => {
      showDetailDialog.value = false
      editingStudent.value = student
      showAddDialog.value = true
    }

    onMounted(() => {
      fetchStudents()
      fetchStatistics()
    })

    return {
      loading,
      students,
      total,
      currentPage,
      pageSize,
      selectedStudents,
      showAddDialog,
      statistics,
      searchForm,
      getGpaType,
      getStudyProgress,
      getStatusType,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      viewStudent,
      editStudent,
      deleteStudent,
      batchEdit,
      batchDelete,
      exportData,
      showDetailDialog,
      editingStudent,
      selectedStudent,
      handleCloseDialog,
      handleFormSuccess,
      handleEditFromDetail
    }
  }
}
</script>

<style scoped>
.students-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  text-align: left;
}

.header-content p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: center;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.progress-text {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.batch-actions {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 15px 20px;
  border-radius: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 1000;
}

.batch-info {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.batch-buttons {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .students-page {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>