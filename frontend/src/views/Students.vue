<template>
  <div class="students-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>学生信息管理</h1>
        <p>管理和查看所有学生的详细信息</p>
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
            placeholder="搜索学生姓名、学号、联系方式..."
            size="large"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="filter-controls">
          <el-select
            v-model="searchForm.grade"
            placeholder="选择年级"
            size="large"
            clearable
            @change="handleSearch"
          >
            <el-option label="一年级" value="一年级" />
            <el-option label="二年级" value="二年级" />
            <el-option label="三年级" value="三年级" />
            <el-option label="四年级" value="四年级" />
            <el-option label="五年级" value="五年级" />
            <el-option label="六年级" value="六年级" />
          </el-select>

          <el-select
            v-model="searchForm.status"
            placeholder="学生状态"
            size="large"
            clearable
            @change="handleSearch"
          >
            <el-option label="在读" value="在读" />
            <el-option label="休学" value="休学" />
            <el-option label="退学" value="退学" />
            <el-option label="毕业" value="毕业" />
          </el-select>

          <el-button type="primary" size="large" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>

          <el-button size="large" @click="resetSearch">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 学生卡片网格 -->
    <div class="students-grid" v-loading="loading">
      <div v-if="students.length === 0 && !loading" class="empty-state">
        <el-icon size="80" color="#c0c4cc"><User /></el-icon>
        <h3>暂无学生数据</h3>
        <p>点击上方"添加学生"按钮开始添加学生信息</p>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加第一个学生
        </el-button>
      </div>

      <div v-else class="student-cards">
        <div
          v-for="student in students"
          :key="student._id"
          class="student-card"
          @click="viewStudent(student)"
        >
          <div class="card-header">
            <div class="student-avatar">
              <el-avatar :size="60" :src="student.avatar">
                {{ student.name.charAt(0) }}
              </el-avatar>
              <div class="status-badge">
                <el-tag
                  :type="getStatusType(student.status)"
                  size="small"
                  effect="dark"
                >
                  {{ student.status }}
                </el-tag>
              </div>
            </div>
            <div class="card-actions">
              <el-dropdown @command="handleCommand">
                <el-button type="text" size="small">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{ action: 'view', student }">
                      <el-icon><View /></el-icon>查看详情
                    </el-dropdown-item>
                    <el-dropdown-item :command="{ action: 'edit', student }">
                      <el-icon><Edit /></el-icon>编辑信息
                    </el-dropdown-item>
                    <el-dropdown-item
                      :command="{ action: 'delete', student }"
                      divided
                    >
                      <el-icon><Delete /></el-icon>删除学生
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <div class="card-content">
            <h3 class="student-name">{{ student.name }}</h3>
            <div class="student-info">
              <div class="info-item">
                <el-icon><CreditCard /></el-icon>
                <span>学号：{{ student.studentId }}</span>
              </div>
              <div class="info-item">
                <el-icon><School /></el-icon>
                <span>{{ student.grade }} {{ student.class }}</span>
              </div>
              <div class="info-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ student.age }}岁</span>
              </div>
              <div class="info-item">
                <el-icon><Phone /></el-icon>
                <span>{{ student.phone }}</span>
              </div>
            </div>

            <div
              class="parent-info"
              v-if="
                student.parentInfo?.fatherName || student.parentInfo?.motherName
              "
            >
              <div class="parent-item" v-if="student.parentInfo?.fatherName">
                <span class="parent-label">父亲：</span>
                <span>{{ student.parentInfo.fatherName }}</span>
                <span
                  class="parent-phone"
                  v-if="student.parentInfo?.fatherPhone"
                >
                  {{ student.parentInfo.fatherPhone }}
                </span>
              </div>
              <div class="parent-item" v-if="student.parentInfo?.motherName">
                <span class="parent-label">母亲：</span>
                <span>{{ student.parentInfo.motherName }}</span>
                <span
                  class="parent-phone"
                  v-if="student.parentInfo?.motherPhone"
                >
                  {{ student.parentInfo.motherPhone }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <span class="enrollment-year"
              >{{ student.enrollmentYear }}年入学</span
            >
            <span class="created-date">{{
              formatDate(student.createdAt)
            }}</span>
          </div>
        </div>
      </div>
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
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getStudents, deleteStudent } from "../api";
import {
  Plus,
  Search,
  Refresh,
  User,
  MoreFilled,
  View,
  Edit,
  Delete,
  CreditCard,
  School,
  Calendar,
  Phone,
} from "@element-plus/icons-vue";

export default {
  name: "Students",
  components: {
    Plus,
    Search,
    Refresh,
    User,
    MoreFilled,
    View,
    Edit,
    Delete,
    CreditCard,
    School,
    Calendar,
    Phone,
  },
  setup() {
    const loading = ref(false);
    const students = ref([]);
    const total = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(20);

    const showAddDialog = ref(false);
    const showDetailDialog = ref(false);
    const editingStudent = ref(null);
    const selectedStudent = ref(null);

    const searchForm = reactive({
      search: "",
      grade: "",
      status: "",
    });

    const getStatusType = (status) => {
      const statusTypes = {
        在读: "success",
        休学: "warning",
        退学: "danger",
        毕业: "info",
      };
      return statusTypes[status] || "info";
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("zh-CN");
    };

    const loadStudents = async () => {
      loading.value = true;
      try {
        const params = {
          page: currentPage.value,
          limit: pageSize.value,
          ...searchForm,
        };

        const response = await getStudents(params);
        students.value = response.data;
        total.value = response.pagination.total;
      } catch (error) {
        ElMessage.error("获取学生列表失败");
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = () => {
      currentPage.value = 1;
      loadStudents();
    };

    const resetSearch = () => {
      Object.keys(searchForm).forEach((key) => {
        searchForm[key] = "";
      });
      currentPage.value = 1;
      loadStudents();
    };

    const handleSizeChange = (newSize) => {
      pageSize.value = newSize;
      currentPage.value = 1;
      loadStudents();
    };

    const handleCurrentChange = (newPage) => {
      currentPage.value = newPage;
      loadStudents();
    };

    const viewStudent = (student) => {
      selectedStudent.value = student;
      showDetailDialog.value = true;
    };

    const handleCommand = ({ action, student }) => {
      switch (action) {
        case "view":
          viewStudent(student);
          break;
        case "edit":
          editingStudent.value = student;
          showAddDialog.value = true;
          break;
        case "delete":
          handleDelete(student);
          break;
      }
    };

    const handleDelete = async (student) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除学生 "${student.name}" 的信息吗？此操作不可撤销。`,
          "确认删除",
          {
            type: "warning",
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
          }
        );

        await deleteStudent(student._id);
        ElMessage.success("删除成功");
        loadStudents();
      } catch (error) {
        if (error !== "cancel") {
          ElMessage.error("删除失败");
        }
      }
    };

    const handleCloseDialog = () => {
      showAddDialog.value = false;
      editingStudent.value = null;
    };

    const handleFormSuccess = () => {
      handleCloseDialog();
      loadStudents();
    };

    const handleEditFromDetail = (student) => {
      showDetailDialog.value = false;
      editingStudent.value = student;
      showAddDialog.value = true;
    };

    onMounted(() => {
      loadStudents();
    });

    return {
      loading,
      students,
      total,
      currentPage,
      pageSize,
      showAddDialog,
      showDetailDialog,
      editingStudent,
      selectedStudent,
      searchForm,
      getStatusType,
      formatDate,
      loadStudents,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      viewStudent,
      handleCommand,
      handleDelete,
      handleCloseDialog,
      handleFormSuccess,
      handleEditFromDetail,
    };
  },
};
</script>
  
  <style scoped>
.students-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 页面头部 */
.page-header {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-content h1 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #909399;
  font-size: 16px;
}

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.filter-row {
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.filter-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-controls .el-select {
  width: 150px;
}

/* 学生卡片网格 */
.students-grid {
  margin-bottom: 30px;
}

.empty-state {
  background: white;
  padding: 60px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-state h3 {
  margin: 20px 0 10px 0;
  color: #303133;
  font-size: 20px;
}

.empty-state p {
  margin: 0 0 30px 0;
  color: #909399;
}

.student-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.student-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.student-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: #409eff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.student-avatar {
  position: relative;
}

.status-badge {
  position: absolute;
  top: -5px;
  right: -5px;
}

.card-actions {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.student-card:hover .card-actions {
  opacity: 1;
}

.card-content {
  margin-bottom: 15px;
}

.student-name {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.student-info {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.info-item .el-icon {
  margin-right: 8px;
  color: #909399;
}

.parent-info {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
}

.parent-item {
  margin-bottom: 6px;
  color: #606266;
}

.parent-item:last-child {
  margin-bottom: 0;
}

.parent-label {
  font-weight: 500;
  color: #303133;
}

.parent-phone {
  float: right;
  color: #909399;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
  font-size: 12px;
  color: #c0c4cc;
}

.enrollment-year {
  font-weight: 500;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .students-page {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .filter-row {
    flex-direction: column;
    gap: 10px;
  }

  .filter-controls {
    width: 100%;
    flex-wrap: wrap;
  }

  .search-box {
    max-width: none;
    width: 100%;
  }

  .student-cards {
    grid-template-columns: 1fr;
  }
}
</style>