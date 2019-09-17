<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
      <img src="../assets/assets.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密  码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="login">登陆</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: ['blur', 'change'] },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    async login () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.post('login', this.form)
        const { meta, data } = res
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$router.push('/home')
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000
          })
        } else {
          this.$message({
            type: 'error',
            message: meta.msg,
            duration: 1000
          })
        }
      } catch (e) {
        console.log(e)
        return false
      }
    },
    resetForm () {
      this.$refs.form.resetForm()
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    background-color: #fff6f3;
    overflow: hidden;
    .el-form {
      width: 400px;
      padding: 75px 40px 15px 40px;
      background-color: #fff;
      margin: 200px auto;
      border-radius: 20px;
      position: relative;
      img {
        width: 125px;
        height: 125px;
        position: absolute;
        top: -80px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        border: 10px solid #e87137;
      }
    }
    .el-button:last-child {
      margin-left: 100px;
    }
  }
</style>
