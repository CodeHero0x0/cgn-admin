<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.ip" placeholder="ip"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.apiName" placeholder="api名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'data-service:log:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="ip" label="IP地址" header-align="center" align="center" width="200"></el-table-column>
			<el-table-column prop="url" label="url地址" header-align="center" align="center" width="200" show-overflow-tooltip></el-table-column>
			<fast-table-org-column prop="orgId" label="所属机构" header-align="center" align="center"></fast-table-org-column>
			<el-table-column prop="status" label="状态码" header-align="center" align="center">
				<template #default="scope">
					<el-tag type="success" v-if="scope.row.status == 200">{{scope.row.status}}</el-tag>
					<el-tag v-else type="danger">{{scope.row.status}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="duration" label="时长(ms)" header-align="center" align="center"></el-table-column>
			<el-table-column prop="apiName" label="api名称" header-align="center" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip prop="error" label="错误信息" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'data-service:log:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					<el-button type="primary" link @click="handleView(scope.row)">查看</el-button>
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

		<!-- 查看详情弹窗 -->
		<el-dialog v-model="dialogVisible" title="接口详情" width="80%" :before-close="handleClose">
			<div v-loading="detailLoading">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="ID">
						{{ currentRow.id }}
					</el-descriptions-item>
					<el-descriptions-item label="IP地址">
						{{ currentRow.ip }}
					</el-descriptions-item>
					<el-descriptions-item label="URL地址" :span="2">
						{{ currentRow.url }}
					</el-descriptions-item>
					<el-descriptions-item label="所属机构">
						{{ currentRow.orgId }}
					</el-descriptions-item>
					<el-descriptions-item label="状态码">
						<el-tag type="success" v-if="currentRow.status == 200">{{ currentRow.status }}</el-tag>
						<el-tag v-else type="danger">{{ currentRow.status }}</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="耗时">
						{{ currentRow.duration }} ms
					</el-descriptions-item>
					<el-descriptions-item label="API名称">
						{{ currentRow.apiName }}
					</el-descriptions-item>
					<el-descriptions-item label="创建时间" :span="2">
						{{ currentRow.createTime }}
					</el-descriptions-item>
					<el-descriptions-item label="错误信息" :span="2" v-if="currentRow.error">
						<el-text type="danger">{{ currentRow.error }}</el-text>
					</el-descriptions-item>
					
					<!-- 显示接口返回的详细数据 -->
					<el-descriptions-item label="详细信息" :span="2" v-if="detailData">
						<el-scrollbar max-height="300px">
							<pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">{{ JSON.stringify(detailData, null, 2) }}</pre>
						</el-scrollbar>
					</el-descriptions-item>
				</el-descriptions>
			</div>
			
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">关闭</el-button>
				</span>
			</template>
		</el-dialog>
	</el-card>
</template>

<script setup lang="ts" name="Data-serviceLogIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { getIpPortApi } from '@/api/data-service/apiConfig' // 导入获取IP端口的API

const state: IHooksOptions = reactive({
	dataListUrl: '/data-service/log/page',
	deleteUrl: '/data-service/log',
	queryForm: {
		ip: '',
		apiName: ''
	}
})

// 弹窗相关状态
const dialogVisible = ref(false)
const currentRow = ref<any>({})
const detailLoading = ref(false)
const detailData = ref<any>(null)

// 请求详细数据
// 请求详细数据
const fetchDetailData = async (urlPath: string) => {
	try {
		detailLoading.value = true
		console.log('原始URL路径:', urlPath)
		
		// 1. 先获取IP和端口
		const ipPortResponse = await getIpPortApi()
		const ipPort = ipPortResponse.data
		
		// 2. 处理URL路径，删除多余的 /api/
		let cleanUrlPath = urlPath
		if (cleanUrlPath.startsWith('/api/')) {
			cleanUrlPath = cleanUrlPath.substring(4) // 删除 '/api/'
		}
		console.log('处理后的URL路径:', cleanUrlPath)
		
		// 3. 构建完整的请求URL
		const fullUrl = `http://${ipPort}${cleanUrlPath}`
		console.log('构建的完整URL:', fullUrl)
		
		// 4. 创建独立的axios实例，不使用项目的拦截器
		const externalRequest = request.create({
			timeout: 60000,
			headers: { 
				'Content-Type': 'application/json;charset=UTF-8'
			}
		})
		
		// 5. 发起请求
		const response = await externalRequest.get(fullUrl)
		
		detailData.value = response.data
		console.log('获取到的详细数据:', detailData.value)
		
	} catch (error) {
		console.error('获取详细数据失败:', error)
		ElMessage.error('获取详细数据失败')
		detailData.value = null
	} finally {
		detailLoading.value = false
	}
}


// 处理查看详情
const handleView = async (row: any) => {
	console.log('点击查看，URL路径:', row.url)
	
	currentRow.value = { ...row }
	dialogVisible.value = true
	
	// 请求详细数据
	if (row.url) {
		await fetchDetailData(row.url)
	} else {
		ElMessage.warning('URL地址为空，无法获取详细信息')
		detailData.value = null
	}
}

// 关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
	currentRow.value = {}
	detailData.value = null
	detailLoading.value = false
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
