<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.viewName" placeholder="大屏名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.majorCategory" placeholder="一级分类"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.midCategory" placeholder="二级分类"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.subCategory" placeholder="三级分类"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.fourCategory" placeholder="四级分类"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.metricName" placeholder="指标名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="resetQuery()">重置</el-button>
			</el-form-item>
		</el-form>
		
		<!-- 新增按钮 -->
		<div class="mb-4">
			<el-button type="primary" @click="handleDialog({}, '新增')">
				<el-icon><Plus /></el-icon>
				新增
			</el-button>
		</div>
		
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="viewName" label="大屏名称" header-align="center" align="center" width="200"></el-table-column>
			<el-table-column prop="majorCategory" label="一级分类" header-align="center" align="center" width="200" show-overflow-tooltip></el-table-column>
			<el-table-column prop="midCategory" label="二级分类" header-align="center" align="center"></el-table-column>
			<el-table-column prop="subCategory" label="三级分类" header-align="center" align="center"></el-table-column>
			<el-table-column prop="fourCategory" label="四级分类" header-align="center" align="center"></el-table-column>
			<el-table-column prop="metricName" label="指标名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="metricValue" label="指标值" header-align="center" align="center"></el-table-column>
			<el-table-column prop="unit" label="指标单位" header-align="center" align="center"></el-table-column>
			<el-table-column prop="description" label="数据描述" header-align="center" align="center" width="300"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-button type="primary" link @click="handleDialog(scope.row, '查看')">查看</el-button>
					<el-button type="primary" link @click="handleDialog(scope.row, '修改')">修改</el-button>
					<el-button type="primary" link @click="deleteDialog(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 统一的详情弹窗 -->
		<el-dialog 
			v-model="dialogVisible" 
			:title="dialogTitle" 
			width="80%" 
			:before-close="handleClose"
		>
			<div v-loading="detailLoading">
				<el-form 
					ref="editFormRef"
					:model="editForm" 
					:rules="editRules"
					label-width="120px"
				>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="大屏名称" prop="viewName">
								<el-input 
									v-model="editForm.viewName" 
									placeholder="请输入大屏名称"
									:disabled="isViewMode"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="一级分类" prop="majorCategory">
								<el-input 
									v-model="editForm.majorCategory" 
									placeholder="请输入一级分类"
									:disabled="isViewMode"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="二级分类" prop="midCategory">
								<el-input 
									v-model="editForm.midCategory" 
									placeholder="请输入二级分类"
									:disabled="isViewMode"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="三级分类" prop="subCategory">
								<el-input 
									v-model="editForm.subCategory" 
									placeholder="请输入三级分类"
									:disabled="isViewMode"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="四级分类" prop="fourCategory">
								<el-input 
									v-model="editForm.fourCategory" 
									placeholder="请输入四级分类"
									:disabled="isViewMode"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="指标名称" prop="metricName">
								<el-input 
									v-model="editForm.metricName" 
									placeholder="请输入指标名称"
									:disabled="isViewMode"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="指标值" prop="metricValue">
								<el-input-number 
									v-model="editForm.metricValue" 
									:precision="2"
									style="width: 100%"
									placeholder="请输入指标值"
									:disabled="isViewMode"
								></el-input-number>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="指标单位" prop="unit">
								<el-input 
									v-model="editForm.unit" 
									placeholder="请输入指标单位"
									:disabled="isViewMode"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="数据描述" prop="description">
								<el-input 
									v-model="editForm.description" 
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
					<el-button @click="handleClose">{{ isViewMode ? '关闭' : '取消' }}</el-button>
					<el-button v-if="!isViewMode" type="primary" @click="handleSave" :loading="saveLoading">保存</el-button>
				</span>
			</template>
		</el-dialog>
	</el-card>
</template>

<script setup lang="ts" name="Data-serviceLogIndex">
import { useCrud } from '@/hooks'
import { reactive, ref, onMounted, nextTick, computed } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { 
	getScreenDataListApi,
	createScreenDataApi,
	updateScreenDataApi,
	deleteScreenDataApi
} from '@/api/data-service/apiConfig'

const state: IHooksOptions = reactive({
	createdIsNeed: false,
	dataListUrl: '/screen-data/page',
	dataList: [],
	dataListLoading: false,
	page: 1,
	limit: 10,
	total: 0,
	pageSizes: [10, 20, 50, 100],
	queryForm: {
		viewName: '',
		majorCategory: '',
		midCategory: '',
		subCategory: '',
		fourCategory: '',
		metricName: ''
	}
})

// 添加重置查询方法
const resetQuery = () => {
	state.queryForm = {
		viewName: '',
		majorCategory: '',
		midCategory: '',
		subCategory: '',
		fourCategory: '',
		metricName: ''
	}
	getDataList()
}

// 弹窗相关状态
const dialogVisible = ref(false)
const dialogType = ref('') // 弹窗类型：查看、修改、新增
const currentRow = ref<any>({})
const detailLoading = ref(false)
const saveLoading = ref(false)
const editFormRef = ref<FormInstance>()

// 计算属性
const dialogTitle = computed(() => {
	switch (dialogType.value) {
		case '查看':
			return '查看详情'
		case '修改':
			return '编辑信息'
		case '新增':
			return '新增数据'
		default:
			return ''
	}
})

const isViewMode = computed(() => dialogType.value === '查看')

// 编辑表单数据
const editForm = ref({
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

// 表单验证规则
const editRules = {
	viewName: [{ required: true, message: '请输入大屏名称', trigger: 'blur' }],
	majorCategory: [{ required: true, message: '请输入一级分类', trigger: 'blur' }],
	metricName: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
	metricValue: [{ required: true, message: '请输入指标值', trigger: 'blur' }]
}

// 公共方法：重置表单
const resetForm = () => {
	editForm.value = {
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
	}
}

// 公共方法：填充表单数据
const fillFormData = (row: any) => {
	editForm.value = {
		id: row.id || '',
		viewName: row.viewName || '',
		majorCategory: row.majorCategory || '',
		midCategory: row.midCategory || '',
		subCategory: row.subCategory || '',
		fourCategory: row.fourCategory || '',
		metricName: row.metricName || '',
		metricValue: row.metricValue || 0,
		unit: row.unit || '',
		description: row.description || ''
	}
}

// 统一处理弹窗显示
const handleDialog = (row: any, type: string) => {
	console.log(`点击${type}:`, row)
	
	dialogType.value = type
	currentRow.value = { ...row }
	
	// 根据类型决定是否填充数据
	if (type === '新增') {
		resetForm() // 新增时重置表单
	} else {
		fillFormData(row) // 查看/修改时填充数据
	}
	
	dialogVisible.value = true
	
	// 清除表单验证状态
	nextTick(() => {
		editFormRef.value?.clearValidate()
	})
}

// 删除确认
const deleteDialog = async (row: any) => {
	try {
		await ElMessageBox.confirm(
			`确定要删除大屏名称为"${row.viewName}"的数据吗？`,
			'删除确认',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
		await handleDelete(row)
	} catch (error) {
		if (error !== 'cancel') {
			console.error('删除操作失败:', error)
		}
	}
}

// 执行删除操作
const handleDelete = async (row: any) => {
	try {
		console.log('删除数据:', row)
		
		await deleteScreenDataApi([row.id])
		
		ElMessage.success('删除成功')
		await getDataList()
	} catch (error) {
		console.error('删除失败:', error)
		ElMessage.error('删除失败，请重试')
	}
}

// 保存编辑
const handleSave = async () => {
	if (!editFormRef.value) return
	
	try {
		await editFormRef.value.validate()
		saveLoading.value = true
		
		const formData = { ...editForm.value }
		
		if (dialogType.value === '新增') {
			console.log('新增数据:', formData)
			await createScreenDataApi(formData)
		} else {
			console.log('更新数据:', formData)
			await updateScreenDataApi(formData)
		}
		
		ElMessage.success(`${dialogType.value}成功`)
		dialogVisible.value = false
		await getDataList()
	} catch (error) {
		console.error('保存失败:', error)
		ElMessage.error(`${dialogType.value}失败，请重试`)
	} finally {
		saveLoading.value = false
	}
}

// 关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
	dialogType.value = ''
	currentRow.value = {}
	resetForm()
	detailLoading.value = false
	saveLoading.value = false
	
	nextTick(() => {
		editFormRef.value?.clearValidate()
	})
}

// 获取数据列表
const getDataList = async () => {
	try {
		state.dataListLoading = true
		
		const params = {
			page: state.page,
			limit: state.limit,
			order: '',
			asc: false,
			// 查询条件
			viewName: state.queryForm.viewName || '',
			majorCategory: state.queryForm.majorCategory || '',
			midCategory: state.queryForm.midCategory || '',
			subCategory: state.queryForm.subCategory || '',
			fourCategory: state.queryForm.fourCategory || '',
			metricName: state.queryForm.metricName || ''
		}
		
		const response = await getScreenDataListApi(params)
		
		state.dataList = response.data.data.list || []
		state.total = response.data.data.total || 0
	} catch (error) {
		console.error('获取数据列表失败:', error)
		ElMessage.error('获取数据失败')
		state.dataList = []
		state.total = 0
	} finally {
		state.dataListLoading = false
	}
}

const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)

onMounted(() => {
	getDataList()
})
</script>

<style scoped>
.mb-4 {
	margin-bottom: 16px;
}
</style>
