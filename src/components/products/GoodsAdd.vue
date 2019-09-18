<template>
  <div class="add">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>

    <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="tab0">
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input placeholder="请输入商品名称" v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input placeholder="请输入商品价格" v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input placeholder="请输入商品重量" v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input placeholder="请输入商品数量" v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="form.goods_cat"
              :options="options"
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="form.is_promotion" :label="true">是</el-radio>
            <el-radio v-model="form.is_promotion" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="商品图片" name="tab1">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          multiple
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>

      <el-tab-pane label="商品内容" name="tab2">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addProduct">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data  () {
    return {
      active: 0,
      tabPosition: 'left',
      activeName: 'tab0',
      options: [],
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promotion: false,
        pics: []
      },
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    next () {
      this.active++
      this.activeName = 'tab' + this.active
    },
    handleClick (tab) {
      this.active = +tab.index
    },
    async getCategoryList () {
      const { meta, data } = await this.$axios.get(`categories?type=3`)
      if (meta.status === 200) {
        this.options = data
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      this.form.pics = this.form.pics.filter(item => item.pic !== file.response.data.tmp_path)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess ({ meta, data }) {
      console.log(meta, data)
      if (meta.status === 200) {
        this.form.pics.push({ pic: data.tmp_path })
      }
    },
    async addProduct () {
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      if (meta.status === 201) {
        this.$router.push('/goods')
        this.$message.success('添加成功')
      }
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>

<style lang="scss" scoped>
.quill-editor {
  background-color: #fff;
  ::v-deep .ql-container {
    height: 300px;
  }
}
</style>
