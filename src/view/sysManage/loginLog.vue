<template>
  <card style="height: 100%" >
    <!-- 主页面数据 -->
    <!-- 查询框 -->
    <Form ref="findForm" :model="searchData" :label-width="80" inline>
      <FormItem label="编号：" prop="id">
        <Input v-model="searchData.id"  placeholder="请输入编号..." clearable style="width: 250px" />
      </FormItem>
      <FormItem label="姓名：" prop="name">
        <Input  v-model="searchData.sysUser.name" placeholder="请输入姓名..." clearable style="width: 250px" />
      </FormItem>
      <FormItem label="账户：" prop="account">
        <Input  v-model="searchData.sysUser.account" placeholder="请输入账户..." clearable style="width: 250px" />
      </FormItem>
      <FormItem label="IP地址：" prop="cip">
        <Input  v-model="searchData.cip" placeholder="请输入IP地址..." clearable style="width: 250px" />
      </FormItem>
      <FormItem label="城市位置：" prop="cname">
        <Input  v-model="searchData.cname" placeholder="请输入城市位置..." clearable style="width: 250px" />
      </FormItem>
      <FormItem>
        <Button style="margin-left: 8px" type="primary" ghost @click="handleSubmit('findForm')">查询</Button>
        <Button style="margin-left: 8px" type="warning" ghost @click="handleReset('findForm')">重置</Button>
      </FormItem>
    </Form>
    <!-- 数据表格 -->
    <Table :columns="tableColumns" :data="data">
      <div style="margin: 10px;overflow: hidden" slot="footer">
        <div style="float: right;">
          <Page :total="total" :page-size="pageSize" show-total :current="pageIndex" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
        </div>
      </div>
    </Table>
  </card>
</template>
<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
export default {
  components: {
  },
  data () {
    return {
      submitRules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      },
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      }
    }
  },
  computed: {
    ...mapState('loginLog', [
      'total',
      'pageIndex',
      'pageSize',
      'searchData',
      'data',
      'tableColumns'
    ])
  },
  created () {
    this.findDataAction({})
  },
  methods: {
    ...mapGetters('loginLog', []),
    ...mapMutations('loginLog', []),
    ...mapActions('loginLog', ['findDataAction']),
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this[name]({})
        } else {
          this.$Message.error('表单数据验证失败')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    changePageSize (pageSize) {
      this.findDataAction({ pageSize })
    },
    changePage (pageNum) {
      this.findDataAction({ pageNum })
    },
    findForm () {
      this.findDataAction({})
    }
  }
}
</script>
<style>
  .demo-drawer-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }
</style>
