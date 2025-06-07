<template>
  <div class="student-form">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      size="default"
    >
      <!-- 基本信息 -->
      <div class="form-section">
        <h3 class="section-title">
          <el-icon><User /></el-icon>
          基本信息
        </h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入学生姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="选择出生日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="国籍" prop="nationality">
              <el-input v-model="form.nationality" placeholder="请输入国籍" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌" prop="politicalStatus">
              <el-select
                v-model="form.politicalStatus"
                placeholder="请选择政治面貌"
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
          </el-col>
        </el-row>
      </div>

      <!-- 学籍信息 -->
      <div class="form-section">
        <h3 class="section-title">
          <el-icon><School /></el-icon>
          学籍信息
        </h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入学号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院" prop="college">
              <el-select
                v-model="form.college"
                placeholder="请选择学院"
                style="width: 100%"
              >
                <el-option
                  label="计算机科学与技术学院"
                  value="计算机科学与技术学院"
                />
                <el-option label="经济管理学院" value="经济管理学院" />
                <el-option label="机械工程学院" value="机械工程学院" />
                <el-option label="外国语学院" value="外国语学院" />
                <el-option label="数学与统计学院" value="数学与统计学院" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input v-model="form.major" placeholder="请输入专业名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级" prop="class">
              <el-input v-model="form.class" placeholder="请输入班级" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="年级" prop="grade">
              <el-select
                v-model="form.grade"
                placeholder="请选择年级"
                style="width: 100%"
              >
                <el-option label="大一" value="大一" />
                <el-option label="大二" value="大二" />
                <el-option label="大三" value="大三" />
                <el-option label="大四" value="大四" />
                <el-option label="研一" value="研一" />
                <el-option label="研二" value="研二" />
                <el-option label="研三" value="研三" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学历层次" prop="degree">
              <el-select
                v-model="form.degree"
                placeholder="请选择学历"
                style="width: 100%"
              >
                <el-option label="本科" value="本科" />
                <el-option label="硕士" value="硕士" />
                <el-option label="博士" value="博士" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option label="在读" value="在读" />
                <el-option label="休学" value="休学" />
                <el-option label="退学" value="退学" />
                <el-option label="毕业" value="毕业" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入学年份" prop="enrollmentYear">
              <el-date-picker
                v-model="enrollmentYearDate"
                type="year"
                placeholder="选择入学年份"
                style="width: 100%"
                @change="handleEnrollmentYearChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计毕业年份" prop="expectedGraduationYear">
              <el-date-picker
                v-model="graduationYearDate"
                type="year"
                placeholder="选择毕业年份"
                style="width: 100%"
                @change="handleGraduationYearChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 学术信息 -->
      <div class="form-section">
        <h3 class="section-title">
          <el-icon><Trophy /></el-icon>
          学术信息
        </h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="GPA" prop="academicInfo.gpa">
              <el-input-number
                v-model="form.academicInfo.gpa"
                :min="0"
                :max="4"
                :precision="2"
                placeholder="0.00"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总学分" prop="academicInfo.totalCredits">
              <el-input-number
                v-model="form.academicInfo.totalCredits"
                :min="0"
                placeholder="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已修学分" prop="academicInfo.completedCredits">
              <el-input-number
                v-model="form.academicInfo.completedCredits"
                :min="0"
                placeholder="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? "更新" : "添加" }}
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
      gender: [{ required: true, message: "请选择性别", trigger: "change" }],
      birthday: [
        { required: true, message: "请选择出生日期", trigger: "change" },
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
      college: [{ required: true, message: "请选择学院", trigger: "change" }],
      major: [{ required: true, message: "请输入专业名称", trigger: "blur" }],
      class: [{ required: true, message: "请输入班级", trigger: "blur" }],
      grade: [{ required: true, message: "请选择年级", trigger: "change" }],
      degree: [
        { required: true, message: "请选择学历层次", trigger: "change" },
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
.student-form {
  max-height: 70vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.section-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  text-align: right;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
}

.form-actions .el-button {
  margin-left: 10px;
}
</style>