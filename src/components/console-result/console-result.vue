<template>
	<el-scrollbar>
		<div style="padding: 20px">
			<div style="margin-bottom: 10px">
				<el-tooltip
							effect="dark"
							content="清空结果页面"
							placement="top-start"
				      >
				      <el-button v-show = "!!taskType && !ifOnlyShow" :icon="Delete" @click="clear"/>
				</el-tooltip>
			</div>
			<!-- sql -->
			<div v-show="taskType == '1'">
				<el-collapse>
					<el-collapse-item v-for="(item, index) in sqlResults" :title="(index + 1) + '. ' + item.sql">
						<template #title>
							<div class="collapse-item-title">{{(index + 1) + '. ' +item.sql}}</div>
						</template>
						<p><b>> sql:&nbsp;</b>
							<div v-html="item.sql" style="padding: 15px;">

							</div>
						</p>
						<div v-if="!item.ifQuery && item.success">
							<p><b>> Affected rows:&nbsp;</b><span><b>{{item.count}}</b></span></p>
							<p><b>> time:&nbsp;</b><span><b>{{item.time}}ms</b></span></p>
						</div>
						<div v-if="item.ifQuery && item.success">
							<p><b>> rows:&nbsp;</b><b>{{item.rowData.length}}</b></p>
							<!-- 表格数据 -->
							<el-table :data="item.rowData">
								 <el-table-column
									 :show-overflow-tooltip="true"
									 :prop="column"
									 :label="column"
									 v-for="(column, index) in item.columns"
									 :key="index"
								 >
								 </el-table-column>
							</el-table>
							<p><b>> time:&nbsp;</b><span><b>{{item.time}}ms</b></span></p>
						</div>
						<div v-if="!item.success">
							<p><b>> errorMsg: </b></p>
							<ReadonlyStudio id="sqlItemErrorMsgId" :value="item.errorMsg" style="height: 500px"></ReadonlyStudio>
							<!-- <p>{{item.errorMsg}}</p> -->
							<p><b>> time:&nbsp;</b><span><b>{{item.time}}ms</b></span></p>
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
	</el-scrollbar>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import { Search,Delete } from '@element-plus/icons-vue'
	import ReadonlyStudio from './readonly-studio.vue'

	const ifOnlyShow = ref(false)
	const taskType = ref('')
	//sql查询的结果
	const sqlResults = ref([])
	const flinkResult = ref({rowData:[],columns:[]})

	const reset = () => {
		sqlResults.value = []
		flinkResult.value = {rowData:[],columns:[]}
	}

	const flinkJobErrorMgRef = ref()
	const init = (result, type, onlyShow) => {
		if(onlyShow) {
			ifOnlyShow.value = true
		}
		taskType.value = type
		if( type == '1' ) {
			sqlResults.value = result.results
		}
	}

	const setErrorMsg = (error: any) => {
		if (flinkJobErrorMgRef.value) {
			flinkJobErrorMgRef.value.setEditorValue(error)
			return
		}
		setTimeout(() => {setErrorMsg(error)},500)
	}


	const clear = () => {
		taskType.value = ''
		sqlResults.value = []
		flinkResult.value = {rowData:[],columns:[]}
	}


	defineExpose({
		clear,
		reset,
		init
	})

</script>

<style scoped>
	.collapse-item-title{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
