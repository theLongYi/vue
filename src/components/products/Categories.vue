<template>
  <div class="categories">
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <el-table
      :data="categoriesList"
      row-key="cat_id"
      v-loading="loading"
      element-loading-text="拼命加载中......"
    >
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot="{row}">
          {{row.cat_deleted ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column label="级别" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" circle plain icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" circle plain icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="35%">
      <el-form :rules="rules" :model="form" label-width="80px" ref="form" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入分类名称" v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            :options="parentList"
            :props="props"
            v-model="form.cat_pid"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoriesList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      loading: false,
      dialogVisible: false,
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      parentList: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    async getCategoryList () {
      this.loading = true
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.categoriesList = data.result
        this.total = data.total
      }
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    async showAddDialog () {
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get(`categories?type=2`)
      if (meta.status === 200) {
        this.parentList = data
      }
    },
    async addCategory () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length,
          cat_pid: this.form.cat_pid.slice(-1).toString() || 0
        })
        if (meta.status === 201) {
          this.$refs.form.resetFields()
          this.dialogVisible = false
          this.getCategoryList()
        }
      } catch {
        return false
      }
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>

<style>

</style>
