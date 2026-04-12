<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">学生管理</h1>
        <p class="page-subtitle">管理和查看所有学生信息</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" class="primary-btn" @click="showAddDialog = true">
          <el-icon>
            <Plus />
          </el-icon>添加学生
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">学生总数</span>
          <el-icon class="metric-icon">
            <User />
          </el-icon>
        </div>
        <div class="metric-value">{{ total }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">学院数</span>
          <el-icon class="metric-icon">
            <School />
          </el-icon>
        </div>
        <div class="metric-value">{{ statistics.byCollege?.length || 0 }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">奖学金</span>
          <el-icon class="metric-icon">
            <Trophy />
          </el-icon>
        </div>
        <div class="metric-value">{{ statistics.scholarshipStudentsCount || 0 }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">平均绩点</span>
          <el-icon class="metric-icon">
            <Star />
          </el-icon>
        </div>
        <div class="metric-value">{{ statistics.avgGpa || '0.0' }}</div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="content-panel">
      <!-- 搜索和筛选区域 -->
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <el-input v-model="searchForm.search" placeholder="按姓名、学号、学院搜索..." class="modern-input"
            clearable @keyup.enter="handleSearch">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>

        <div class="filter-selects">
          <el-select v-model="searchForm.college" placeholder="学院" clearable class="modern-select"
            @change="handleSearch">
            <el-option label="全部学院" value="" />
            <el-option label="计算机科学与技术学院" value="计算机科学与技术学院" />
            <el-option label="经济管理学院" value="经济管理学院" />
            <el-option label="机械工程学院" value="机械工程学院" />
            <el-option label="外国语学院" value="外国语学院" />
            <el-option label="数学与统计学院" value="数学与统计学院" />
          </el-select>

          <el-select v-model="searchForm.grade" placeholder="年级" clearable class="modern-select"
            @change="handleSearch">
            <el-option label="全部年级" value="" />
            <el-option label="大一" value="大一" />
            <el-option label="大二" value="大二" />
            <el-option label="大三" value="大三" />
            <el-option label="大四" value="大四" />
            <el-option label="研一" value="研一" />
            <el-option label="研二" value="研二" />
            <el-option label="研三" value="研三" />
          </el-select>

          <el-select v-model="searchForm.degree" placeholder="学历" clearable class="modern-select"
            @change="handleSearch">
            <el-option label="全部学历" value="" />
            <el-option label="本科" value="本科" />
            <el-option label="硕士" value="硕士" />
            <el-option label="博士" value="博士" />
          </el-select>

          <el-select v-model="searchForm.status" placeholder="状态" clearable class="modern-select"
            @change="handleSearch">
            <el-option label="全部状态" value="" />
            <el-option label="在读" value="在读" />
            <el-option label="休学" value="休学" />
            <el-option label="毕业" value="毕业" />
          </el-select>

          <el-button class="secondary-btn" @click="resetSearch">重置</el-button>
        </div>
      </div>

      <!-- 学生列表 -->
      <div class="table-wrapper">
        <el-table :data="students" v-loading="loading" style="width: 100%"
          :header-cell-style="{ background: '#f9fafb', color: '#6b7280', fontWeight: '500', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="学生" min-width="220">
            <template #default="{ row }">
              <div class="student-cell">
                <el-avatar :size="36" :src="row.avatar" class="cell-avatar">
                  {{ row.name?.charAt(0) }}
                </el-avatar>
                <div class="cell-info">
                  <div class="cell-name">{{ row.name }}</div>
                  <div class="cell-id">{{ row.studentId }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="学院与专业" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="cell-primary">{{ row.college }}</div>
              <div class="cell-secondary">{{ row.major }}</div>
            </template>
          </el-table-column>
          <el-table-column label="年级与班级" min-width="140">
            <template #default="{ row }">
              <div class="cell-primary">{{ row.grade }} ({{ row.degree }})</div>
              <div class="cell-secondary">{{ row.class }}</div>
            </template>
          </el-table-column>
          <el-table-column label="绩点" width="100">
            <template #default="{ row }">
              <div class="gpa-badge" :class="`gpa-${getGpaType(row.academicInfo?.gpa)}`">
                {{ row.academicInfo?.gpa || 'N/A' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span class="status-badge" :class="`status-${getStatusType(row.status)}`">
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="" width="160" align="right" fixed="right">
            <template #default="{ row }">
              <div class="action-cell">
                <el-button type="primary" link @click="viewStudent(row)">查看</el-button>
                <el-button type="primary" link @click="editStudent(row)">编辑</el-button>
                <el-button type="danger" link @click="deleteStudent(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="total > 0">
        <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total"
          layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 批量操作悬浮条 -->
    <div class="batch-actions-floating" v-if="selectedStudents.length > 0">
      <div class="batch-info">
        <span>已选择 {{ selectedStudents.length }} 项</span>
      </div>
      <div class="batch-buttons">
        <el-button class="batch-btn" @click="batchEdit">编辑</el-button>
        <el-button class="batch-btn danger" @click="batchDelete">删除</el-button>
        <el-button class="batch-btn" @click="exportData">导出</el-button>
      </div>
    </div>

    <!-- 添加/编辑学生对话框 -->
    <el-dialog v-model="showAddDialog" :title="editingStudent ? '编辑学生信息' : '添加学生'" width="60%"
      :before-close="handleCloseDialog">
      <StudentForm :student="editingStudent" @success="handleFormSuccess" @cancel="handleCloseDialog" />
    </el-dialog>

    <!-- 学生详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="学生详细信息" width="50%">
      <StudentDetail :student="selectedStudent" @edit="handleEditFromDetail" @close="showDetailDialog = false" />
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
.page-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 顶部标题区域 */
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

/* 关键指标卡片 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
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
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  letter-spacing: -0.02em;
}

/* 主体内容（包裹过滤器和表格） */
.content-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 过滤器 */
.filter-bar {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.search-input-wrapper {
  width: 280px;
  flex-shrink: 0;
}

.filter-selects {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.modern-input :deep(.el-input__wrapper),
.modern-select :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  transition: all 0.2s;
}

.modern-input :deep(.el-input__wrapper:hover),
.modern-input :deep(.el-input__wrapper.is-focus),
.modern-select :deep(.el-input__wrapper:hover),
.modern-select :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

.modern-select {
  width: 140px;
}

.secondary-btn {
  border-radius: 6px;
  font-weight: 500;
}

/* 表格定制 */
.table-wrapper {
  width: 100%;
}

.table-wrapper :deep(.el-table) {
  --el-table-border-color: #f3f4f6;
  --el-table-row-hover-bg-color: #f9fafb;
}

.table-wrapper :deep(.el-table__inner-wrapper::before) {
  display: none;
  /* 去除底部默认边框 */
}

.student-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cell-avatar {
  background-color: #e5e7eb;
  color: #4b5563;
  font-weight: 600;
  flex-shrink: 0;
}

.cell-info,
.cell-primary,
.cell-secondary {
  display: flex;
  flex-direction: column;
}

.cell-name,
.cell-primary {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.cell-id,
.cell-secondary {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.action-cell {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-cell .el-button {
  font-weight: 500;
  font-size: 13px;
  margin-left: 0;
}

/* 徽章 */
.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.status-success {
  background-color: #d1fae5;
  color: #065f46;
}

.status-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-info {
  background-color: #f3f4f6;
  color: #4b5563;
}

.gpa-badge {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
  text-align: center;
  min-width: 36px;
}

.gpa-success {
  color: #10b981;
  background-color: #ecfdf5;
}

.gpa-warning {
  color: #d97706;
  background-color: #fffbeb;
}

.gpa-danger {
  color: #ef4444;
  background-color: #fef2f2;
}

.gpa-info {
  color: #6b7280;
  background-color: #f3f4f6;
}

/* 分页 */
.pagination-container {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 悬浮批量操作 */
.batch-actions-floating {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 24px;
  z-index: 100;
  border: 1px solid #374151;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.batch-info {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.batch-buttons {
  display: flex;
  gap: 8px;
}

.batch-btn {
  background: transparent;
  border: 1px solid #4b5563;
  color: white;
  height: 32px;
  border-radius: 6px;
}

.batch-btn:hover {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

.batch-btn.danger {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.4);
}

.batch-btn.danger:hover {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
}

@media (max-width: 1024px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-wrapper {
    width: 100%;
  }
}
</style>
