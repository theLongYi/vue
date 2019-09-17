<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input placeholder="请输入内容" v-model="query" class="search">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <!-- 添加 -->
    <el-button type="primary" plain @click="addShowDialog">添加用户</el-button>
    <!-- 表格 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain circle @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain circle @click="delUser(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" size="small" plain round @click="showAssignDialog(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="sizes, prev, pager, next, total, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="35%">
      <el-form :model="form" label-width="80px" ref="form" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUesr">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="35%">
      <el-form :model="editForm" label-width="80px" ref="editForm" :rules="rules">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配用户" :visible.sync="assignDialogVisible" width="35%">
      <el-form :model="assignForm" label-width="80px" ref="assignForm" :rules="rules">
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [],
      pagenum: 1,
      pagesize: 2,
      total: 0,
      query: '',
      dialogFormVisible: false,
      editDialogVisible: false,
      assignDialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignForm: {
        id: '',
        rid: '',
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度为3-12位', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 6, max: 18, message: '用户名长度为6-18位', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      roleList: []
    }
  },
  methods: {
    async getUserList () {
      const res = await this.$axios.get('users', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.query
        }
      })
      const { meta, data } = res
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    changeState (row) {
      console.log(row)
      this.$axios.put(`users/${row.id}/state/${row.mg_state}`).then(res => {
        const { meta } = res
        if (meta.status === 200) {
          this.$message.success('状态修改成功')
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    search () {
      this.pagenum = 1
      this.getUserList()
    },
    addShowDialog () {
      this.dialogFormVisible = true
    },
    async addUesr () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success('用户添加成功')
          this.$refs.form.resetFields()
          this.dialogFormVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },
    async delUser (id) {
      try {
        await this.$confirm('你确定删除该用户吗', '温馨提示', { type: 'warning' })
        const res = await this.$axios.delete(`users/${id}`)
        const { meta } = res
        if (meta.status === 200) {
          this.$message.success('删除成功')
          if (this.userList === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        }
      } catch {
        this.$message.info('取消删除')
      }
    },
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = { ...row }
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        const { meta } = await this.$axios.put(`users/${this.editForm.id}`, this.editForm)
        if (meta.status === 200) {
          this.$refs.editForm.resetFields()
          this.editDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },
    async showAssignDialog (row) {
      this.assignDialogVisible = true
      this.assignForm.id = row.id
      this.assignForm.username = row.username
      const { meta, data } = await this.$axios.get(`users/${row.id}`)
      if (meta.status === 200) {
        if (data.rid !== -1) {
          this.assignForm.rid = data.rid
        } else {
          this.assignForm.rid = ''
        }
      }
      const res = await this.$axios.get(`roles`)
      if (res.meta.status === 200) {
        this.roleList = res.data
      }
    },
    async assignUser () {
      if (!this.assignForm.rid) {
        this.$message.error('请分配一个角色')
      }
      const { meta } = await this.$axios.put(`users/${this.assignForm.id}/role`, this.assignForm)
      if (meta.status === 200) {
        this.assignDialogVisible = false
        this.$message.success('分配角色成功')
      }
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang="scss" scoped>
.search {
  width: 300px;
  margin: 20px 10px 10px 0;
}
</style>
