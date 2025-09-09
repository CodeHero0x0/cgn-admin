<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="80%" :close-on-click-modal="false" draggable>
    <div v-loading="loading">
      <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="大屏名称" prop="viewName">
              <el-input v-model="dataForm.viewName" placeholder="请输入大屏名称" :disabled="isViewMode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级分类" prop="majorCategory">
              <el-input v-model="dataForm.majorCategory" placeholder="请输入一级分类" :disabled="isViewMode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="二级分类" prop="midCategory">
              <el-input v-model="dataForm.midCategory" placeholder="请输入二级分类" :disabled="isViewMode"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="三级分类" prop="subCategory">
              <el-input v-model="dataForm.subCategory" placeholder="请输入三级分类" :disabled="isViewMode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="四级分类" prop="fourCategory">
              <el-input v-model="dataForm.fourCategory" placeholder="请输入四级分类" :disabled="isViewMode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指标名称" prop="metricName">
              <el-input v-model="dataForm.metricName" placeholder="请输入指标名称" :disabled="isViewMode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="指标值" prop="metricValue">
              <el-input-number
                  v-model="dataForm.metricValue"
                  :precision="2"
                  style="width: 100%"
                  placeholder="请输入指标值"
                  :disabled="isViewMode"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指标单位" prop="unit">
              <el-input v-model="dataForm.unit" placeholder="请输入指标单位" :disabled="isViewMode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="数据描述" prop="description">
              <el-input
                  v-model="dataForm.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入数据描述"
                  :disabled="isViewMode"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ isViewMode ? '关闭' : '取消' }}</el-button>
				<el-button v-if="!isViewMode" type="primary" @click="submitHandle()">确定</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref, computed} from 'vue'
import {ElMessage} from 'element-plus/es'
import {useScreenDataApi, createScreenDataApi, updateScreenDataApi} from '@/api/data-service/screenData'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const loading = ref(false)
const dataFormRef = ref()
const dialogType = ref('新增') // '新增', '修改', '查看'

const dialogTitle = computed(() => {
  return dialogType.value === '查看' ? '查看详情' : dialogType.value === '修改' ? '修改信息' : '新增数据'
})
const isViewMode = computed(() => dialogType.value === '查看')

const dataForm = reactive({
  id: '',
  viewName: '',
  majorCategory: '',
  midCategory: '',
  subCategory: '',
  fourCategory: '',
  metricName: '',
  metricValue: 0,
  unit: '',
  description: ''
})

const dataRules = ref({
  viewName: [{required: true, message: '请输入大屏名称', trigger: 'blur'}],
  majorCategory: [{required: true, message: '请输入一级分类', trigger: 'blur'}],
  metricName: [{required: true, message: '请输入指标名称', trigger: 'blur'}],
  metricValue: [{required: true, message: '请输入指标值', trigger: 'blur'}]
})

const init = (id?: number, type: string = '新增') => {
  visible.value = true
  dialogType.value = type
  dataForm.id = ''

  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }
  Object.assign(dataForm, {
    id: '',
    viewName: '',
    majorCategory: '',
    midCategory: '',
    subCategory: '',
    fourCategory: '',
    metricName: '',
    metricValue: 0,
    unit: '',
    description: ''
  })

  if (id) {
    getScreenData(id)
  }
}

const getScreenData = (id: number) => {
  loading.value = true
  useScreenDataApi(id).then(res => {
    Object.assign(dataForm, res.data)
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

const submitHandle = () => {
  if (isViewMode.value) {
    visible.value = false
    return
  }
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    const api = dataForm.id ? updateScreenDataApi : createScreenDataApi
    api(dataForm).then(() => {
      ElMessage.success({
        message: '操作成功',
        duration: 500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
        }
      })
    })
  })
}

defineExpose({
  init
})
</script>
