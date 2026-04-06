<template>
  <div class="modern-form-wrapper">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="modern-form"
    >
      <!-- 基本信息 -->
      <div class="form-section">
        <div class="section-header">
          <div class="header-icon"><el-icon><User /></el-icon></div>
          <h3 class="section-title">基本信息</h3>
        </div>
        <div class="form-grid">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入学生姓名" class="modern-input" />
          </el-form-item>
          
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender" class="modern-radio-group">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="选择出生日期"
              class="modern-input"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard" placeholder="请输入身份证号" class="modern-input" />
          </el-form-item>
          
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入联系电话" class="modern-input" />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱地址" class="modern-input" />
          </el-form-item>
          
          <el-form-item label="国籍" prop="nationality">
            <el-input v-model="form.nationality" placeholder="请输入国籍" class="modern-input" />
          </el-form-item>
          
          <el-form-item label="政治面貌" prop="politicalStatus">
            <el-select
              v-model="form.politicalStatus"
              placeholder="请选择政治面貌"
              class="modern-input"
              style="width: 100%"
            >
              <el-option label="群众" value="群众" />
              <el-option label="共青团员" value="共青团员" />
              <el-option label="中共党员" value="中共党员" />
              <el-option label="中共预备党员" value="中共预备党员" />
              <el-option label="民主党派" value="民主党派" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        </div>
      </div>

      <!-- 学籍信息 -->
      <div class="form-section">
        <div class="section-header">
          <div class="header-icon"><el-icon><School /></el-icon></div>
          <h3 class="section-title">学籍信息</h3>
        </div>
        <div class="form-grid">
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="form.studentId" placeholder="请输入学号" class="modern-input" />
          </el-form-item>
          
          <el-form-item label="学院" prop="college">
            <el-select
              v-model="form.college"
              placeholder="请选择学院"
              class="modern-input"
              style="width: 100%"
            >
              <el-option label="计算机科学与技术学院" value="计算机科学与技术学院" />
              <el-option label="经济管理学院" value="经济管理学院" />
              <el-option label="机械工程学院" value="机械工程学院" />
              <el-option label="外国语学院" value="外国语学院" />
              <el-option label="数学与统计学院" value="数学与统计学院" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="专业" prop="major">
            <el-input v-model="form.major" placeholder="请输入专业名称" class="modern-input" />
          </el-form-item>
          
          <el-form-item label="班级" prop="class">
            <el-input v-model="form.class" placeholder="请输入班级" class="modern-input" />
          </el-form-item>
        </div>

        <div class="form-grid-3">
          <el-form-item label="年级" prop="grade">
            <el-select v-model="form.grade" placeholder="请选择年级" class="modern-input" style="width: 100%">
              <el-option label="大一" value="大一" />
              <el-option label="大二" value="大二" />
              <el-option label="大三" value="大三" />
              <el-option label="大四" value="大四" />
              <el-option label="研一" value="研一" />
              <el-option label="研二" value="研二" />
              <el-option label="研三" value="研三" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="学历层次" prop="degree">
            <el-select v-model="form.degree" placeholder="请选择学历" class="modern-input" style="width: 100%">
              <el-option label="本科" value="本科" />
              <el-option label="硕士" value="硕士" />
              <el-option label="博士" value="博士" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" class="modern-input" style="width: 100%">
              <el-option label="在读" value="在读" />
              <el-option label="休学" value="休学" />
              <el-option label="退学" value="退学" />
              <el-option label="毕业" value="毕业" />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-grid">
          <el-form-item label="入学年份" prop="enrollmentYear">
            <el-date-picker
              v-model="enrollmentYearDate"
              type="year"
              placeholder="选择入学年份"
              class="modern-input"
              style="width: 100%"
              @change="handleEnrollmentYearChange"
            />
          </el-form-item>
          
          <el-form-item label="预计毕业年份" prop="expectedGraduationYear">
            <el-date-picker
              v-model="graduationYearDate"
              type="year"
              placeholder="选择毕业年份"
              class="modern-input"
              style="width: 100%"
              @change="handleGraduationYearChange"
            />
          </el-form-item>
        </div>
      </div>

      <!-- 学术信息 -->
      <div class="form-section">
        <div class="section-header">
          <div class="header-icon"><el-icon><Trophy /></el-icon></div>
          <h3 class="section-title">学术信息</h3>
        </div>
        <div class="form-grid-3">
          <el-form-item label="GPA" prop="academicInfo.gpa">
            <el-input-number
              v-model="form.academicInfo.gpa"
              :min="0" :max="4" :precision="2"
              placeholder="0.00"
              class="modern-input-number"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="总学分" prop="academicInfo.totalCredits">
            <el-input-number
              v-model="form.academicInfo.totalCredits"
              :min="0"
              placeholder="0"
              class="modern-input-number"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="已修学分" prop="academicInfo.completedCredits">
            <el-input-number
              v-model="form.academicInfo.completedCredits"
              :min="0"
              placeholder="0"
              class="modern-input-number"
              style="width: 100%"
            />
          </el-form-item>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button class="secondary-btn" @click="handleCancel">Cancel</el-button>
        <el-button type="primary" class="primary-btn" @click="handleSubmit" :loading="loading">
          {{ isEdit ? "Save Changes" : "Add Student" }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>
  
<script>
import { ref, reactive, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { createStudent, updateStudent } from "../api";
import { User, School, Trophy } from "@element-plus/icons-vue";

export default {
  name: "StudentForm",
  components: {
    User,
    School,
    Trophy,
  },
  props: {
    student: {
      type: Object,
      default: null,
    },
  },
  emits: ["success", "cancel"],
  setup(props, { emit }) {
    const formRef = ref();
    const loading = ref(false);
    const enrollmentYearDate = ref(null);
    const graduationYearDate = ref(null);

    const isEdit = computed(() => !!props.student);

    const form = reactive({
      name: "",
      gender: "男",
      birthday: null,
      idCard: "",
      phone: "",
      email: "",
      nationality: "中国",
      politicalStatus: "群众",
      studentId: "",
      college: "",
      major: "",
      class: "",
      grade: "",
      degree: "本科",
      enrollmentYear: new Date().getFullYear(),
      expectedGraduationYear: new Date().getFullYear() + 4,
      status: "在读",
      academicInfo: {
        gpa: null,
        totalCredits: null,
        completedCredits: null,
      },
    });

    const rules = {
      name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
      gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
      birthday: [
        { required: true, message: "请选择出生日期", trigger: "blur" },
      ],
      idCard: [
        { required: true, message: "请输入身份证号", trigger: "blur" },
        {
          pattern: /^\d{17}[\dXx]$/,
          message: "身份证号格式不正确",
          trigger: "blur",
        },
      ],
      phone: [
        { required: true, message: "请输入联系电话", trigger: "blur" },
        {
          pattern: /^1[3-9]\d{9}$/,
          message: "手机号格式不正确",
          trigger: "blur",
        },
      ],
      email: [
        { required: true, message: "请输入邮箱地址", trigger: "blur" },
        { type: "email", message: "邮箱格式不正确", trigger: "blur" },
      ],
      studentId: [
        { required: true, message: "请输入学号", trigger: "blur" },
        { pattern: /^\d{10}$/, message: "学号必须是10位数字", trigger: "blur" },
      ],
      college: [{ required: true, message: "请选择学院", trigger: "blur" }],
      major: [{ required: true, message: "请输入专业名称", trigger: "blur" }],
      class: [{ required: true, message: "请输入班级", trigger: "blur" }],
      grade: [{ required: true, message: "请选择年级", trigger: "blur" }],
      degree: [
        { required: true, message: "请选择学历层次", trigger: "blur" },
      ],
    };

    // 监听学生数据变化，用于编辑模式
    watch(
      () => props.student,
      (newStudent) => {
        if (newStudent) {
          Object.keys(form).forEach((key) => {
            if (newStudent[key] !== undefined) {
              if (key === "academicInfo") {
                Object.assign(form.academicInfo, newStudent.academicInfo || {});
              } else {
                form[key] = newStudent[key];
              }
            }
          });

          // 设置年份选择器
          if (newStudent.enrollmentYear) {
            enrollmentYearDate.value = new Date(
              newStudent.enrollmentYear,
              0,
              1
            );
          }
          if (newStudent.expectedGraduationYear) {
            graduationYearDate.value = new Date(
              newStudent.expectedGraduationYear,
              0,
              1
            );
          }
        } else {
          // 添加模式：重置表单为默认值
          Object.assign(form, {
            name: "",
            gender: "男",
            birthday: null,
            idCard: "",
            phone: "",
            email: "",
            nationality: "中国",
            politicalStatus: "群众",
            studentId: "",
            college: "",
            major: "",
            class: "",
            grade: "",
            degree: "本科",
            enrollmentYear: new Date().getFullYear(),
            expectedGraduationYear: new Date().getFullYear() + 4,
            status: "在读",
            academicInfo: {
              gpa: null,
              totalCredits: null,
              completedCredits: null,
            },
          });

          // 重置年份选择器
          enrollmentYearDate.value = null;
          graduationYearDate.value = null;

          // 清除表单验证
          if (formRef.value) {
            formRef.value.clearValidate();
          }
        }
      },
      { immediate: true }
    );

    const handleEnrollmentYearChange = (date) => {
      if (date) {
        form.enrollmentYear = date.getFullYear();
      }
    };

    const handleGraduationYearChange = (date) => {
      if (date) {
        form.expectedGraduationYear = date.getFullYear();
      }
    };

    const handleSubmit = async () => {
      if (!formRef.value) return;

      await formRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true;
          try {
            const submitData = { ...form };

            if (isEdit.value) {
              await updateStudent(props.student._id, submitData);
              ElMessage.success("学生信息更新成功");
            } else {
              await createStudent(submitData);
              ElMessage.success("学生信息添加成功");
            }

            emit("success");
          } catch (error) {
            ElMessage.error(isEdit.value ? "更新失败" : "添加失败");
          } finally {
            loading.value = false;
          }
        }
      });
    };

    const handleCancel = () => {
      emit("cancel");
    };

    return {
      formRef,
      loading,
      form,
      rules,
      isEdit,
      enrollmentYearDate,
      graduationYearDate,
      handleEnrollmentYearChange,
      handleGraduationYearChange,
      handleSubmit,
      handleCancel,
    };
  },
};
</script>
  
<style scoped>
.modern-form-wrapper {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
}

.modern-form-wrapper::-webkit-scrollbar {
  width: 6px;
}
.modern-form-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
.modern-form-wrapper::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.form-section {
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.header-icon {
  width: 32px;
  height: 32px;
  background-color: #f3f4f6;
  color: #4b5563;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.section-title {
  margin: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.modern-form :deep(.el-form-item__label) {
  padding-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 24px;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 24px;
}

@media (max-width: 768px) {
  .form-grid, .form-grid-3 {
    grid-template-columns: 1fr;
  }
}

.modern-input :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  padding: 4px 12px;
  transition: all 0.2s;
}
.modern-input :deep(.el-input__wrapper:hover),
.modern-input :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

.modern-input-number :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  transition: all 0.2s;
}
.modern-input-number :deep(.el-input__wrapper:hover),
.modern-input-number :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  margin-top: 24px;
  border-top: 1px solid #e5e7eb;
  position: sticky;
  bottom: -1px; /* 修复可能出现的1px缝隙 */
  background: white;
  padding-bottom: 24px;
  z-index: 10; /* 修复与组件（如el-input-number）堆叠时的穿模问题 */
}

.primary-btn {
  background-color: #111827;
  border-color: #111827;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  padding: 8px 24px;
}
.primary-btn:hover, .primary-btn:focus {
  background-color: #374151;
  border-color: #374151;
  color: white;
}

.secondary-btn {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 6px;
  font-weight: 500;
  padding: 8px 24px;
}
.secondary-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}
</style>