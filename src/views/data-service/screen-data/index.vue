<template>
  <el-card>
    <!-- 查询表单 -->
    <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item prop="viewName">
        <el-input v-model="state.queryForm.viewName" placeholder="大屏名称"></el-input>
      </el-form-item>
      <el-form-item prop="majorCategory">
        <el-input v-model="state.queryForm.majorCategory" placeholder="一级分类"></el-input>
      </el-form-item>
      <el-form-item prop="midCategory">
        <el-input v-model="state.queryForm.midCategory" placeholder="二级分类"></el-input>
      </el-form-item>
      <el-form-item prop="subCategory">
        <el-input v-model="state.queryForm.subCategory" placeholder="三级分类"></el-input>
      </el-form-item>
      <el-form-item prop="fourCategory">
        <el-input v-model="state.queryForm.fourCategory" placeholder="四级分类"></el-input>
      </el-form-item>
      <el-form-item prop="metricName">
        <el-input v-model="state.queryForm.metricName" placeholder="指标名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-space>
      <el-button type="primary" icon="Plus" @click="addOrUpdateHandle()">新增</el-button>
      <el-button type="danger" icon="Delete" plain @click="deleteBatchHandle()">批量删除</el-button>
    </el-space>

    <!-- 数据表格 -->
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%; margin-top: 16px"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="viewName" label="大屏名称" header-align="center" align="center"
                       width="200"></el-table-column>
      <el-table-column prop="majorCategory" label="一级分类" header-align="center" align="center" width="200"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="midCategory" label="二级分类" header-align="center" align="center"></el-table-column>
      <el-table-column prop="subCategory" label="三级分类" header-align="center" align="center"></el-table-column>
      <el-table-column prop="fourCategory" label="四级分类" header-align="center" align="center"></el-table-column>
      <el-table-column prop="metricName" label="指标名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="metricValue" label="指标值" header-align="center" align="center"></el-table-column>
      <el-table-column prop="unit" label="指标单位" header-align="center" align="center"></el-table-column>
      <el-table-column prop="description" label="数据描述" header-align="center" align="center"
                       width="300"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
        <template #default="scope">
          <el-button type="primary" link @click="addOrUpdateHandle(scope.row.id, '查看')">查看</el-button>
          <el-button type="primary" link @click="addOrUpdateHandle(scope.row.id, '修改')">修改</el-button>
          <el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

    <add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
  </el-card>
</template>

<script setup lang="ts" name="Data-serviceLogIndex">
import {useCrud} from '@/hooks'
import {reactive, ref} from 'vue'
import AddOrUpdate from './add-or-update.vue'
import {IHooksOptions} from '@/hooks/interface'

const state: IHooksOptions = reactive({
  dataListUrl: '/data-service/screen-data/page',
  deleteUrl: '/data-service/screen-data',
  queryForm: {
    viewName: '',
    majorCategory: '',
    midCategory: '',
    subCategory: '',
    fourCategory: '',
    metricName: ''
  }
})

const queryRef = ref()
const addOrUpdateRef = ref()

const addOrUpdateHandle = (id?: number, type?: string) => {
  addOrUpdateRef.value.init(id, type)
}

const {
  getDataList,
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  deleteBatchHandle,
  reset
} = useCrud(state)
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
