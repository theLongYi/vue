<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <h1>电商后台管理系统</h1>
      <div class="logout">
        <span>欢迎你,admin</span>
        <a href="javascript:;" @click="logout">
          <span class="el-icon-switch-button"></span>
          退出
        </a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          :default-active="activeMenu"
          background-color="#5c619b"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">
            <template v-slot:title>
              <i class="el-icon-ice-cream"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
              <i class="el-icon-sugar"></i>
              <span>{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    logout () {
      this.$confirm('您确定要退出系统吗', '温馨提示', { type: 'warning' }).then(() => {
        this.$message.success('退出成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {
        this.$message.info('操作取消')
      })
    }
  },
  async created () {
    const res = await this.$axios.get('menus')
    const { meta, data } = res
    if (meta.status === 200) {
      this.menuList = data
      console.log('✧*｡٩(ˊᗜˋ*)و✧*｡')
    }
  },
  computed: {
    activeMenu () {
      return this.$router.currentRoute.path.slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #f1f1f1;
    display: flex;
    .logo {
      width: 180px;
      background: url('../assets/logo.png') no-repeat center;
      background-size: contain;
    }
    h1 {
      flex: 1;
      line-height: 60px;
      color: #ffd04b;
      font-size: 30px;
      text-align: center;
    }
    .logout {
      width: 180px;
      line-height: 60px;
      a {
        color: orange;
        padding-left: 10px;
        text-decoration: none;
      }
    }
  }
  .el-aside {
    width: 200px;
    background-color: #5c619b;
  }
}
</style>
