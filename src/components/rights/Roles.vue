<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag class="l1-tag" closable @close="delRight(row, l1.id)">{{l1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag type="success" closable @close="delRight(row, l2.id)">{{l2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                  closable
                  class="l3"
                  type="warning"
                  v-for="l3 in l2.children"
                  :key="l3.id"
                  @close="delRight(row, l3.id)"
                  >{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="success" icon="el-icon-check" size="small" plain round @click="showAssignDialog(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="35%">
      <el-tree
        ref="tree"
        node-key="id"
        :data="rightList"
        :props="props"
        show-checkbox
        default-expand-all
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      assignDialogVisible: false,
      rightList: [],
      props: {
        label: 'authName',
        children: 'children'
      },
      roleId: ''
    }
  },
  methods: {
    async getRoleList () {
      const { meta, data } = await this.$axios.get(`roles`)
      if (meta.status === 200) {
        this.roleList = data
      }
    },
    async delRight (row, rightId) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        this.$message.success('删除权限成功')
        row.children = data
      }
    },
    async showAssignDialog (row) {
      this.assignDialogVisible = true
      const { meta, data } = await this.$axios.get(`rights/tree`)
      if (meta.status === 200) {
        this.rightList = data
      }
      this.roleId = row.id
      let rights = []
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => rights.push(l3.id))
        })
      })
      this.$refs.tree.setCheckedKeys(rights)
    },
    async assignRight () {
      const allChecked = this.$refs.tree.getCheckedKeys()
      const halfChecked = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...allChecked, ...halfChecked].join()
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success('分配角色成功')
        this.getRoleList()
        this.assignDialogVisible = false
      }
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>

<style lang="scss" scoped>
.l1 {
  border-bottom: 1px dotted red;
  .l1-tag {
    margin-top: 5px;
  }
}
.l2 {
  margin: 5px 0;
}

.l3 {
  margin-right: 5px;
}
</style>
