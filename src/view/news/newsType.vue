<template>
  <card style="height: 100%" >
    <!-- 主页面数据 -->
    <!-- 查询框 -->
    <Form ref="findForm" :model="searchData" :label-width="72" inline>
      <FormItem label="编号：" prop="id">
        <Input v-model="searchData.id"  placeholder="请输入编号..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="类型名：" prop="name">
        <Input  v-model="searchData.name" placeholder="请输入类型名..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="类型简介：" prop="note">
        <Input  v-model="searchData.note" placeholder="请输入类型简介..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="类型状态：" prop="status" >
        <Select v-model="searchData.status" clearable style="width:190px">
          <Option  :value="1">可用</Option>
          <Option  :value="0">禁用(已删除)</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button style="margin-left: -72px" type="primary" ghost @click="handleSubmit('findForm')">查询</Button>
        <Button style="margin-left: 8px" type="warning" ghost @click="handleReset('findForm')">重置</Button>
      </FormItem>
    </Form>
    <!-- 按钮框 -->
    <div style="margin: 5px;">
      <Button style="margin-right: 3px;" type="success" @click="insertMode = true"  icon="md-add">添加</Button>
      <Button style="margin-right: 3px;" type="info" @click="updateAction"  icon="ios-create">修改</Button>
      <Button style="margin-right: 3px;" type="error" @click="deleteAction"  icon="ios-trash"  >删除</Button>
    </div>
    <!-- 数据表格 -->
    <Table  @on-selection-change="selection"  :columns="tableColumns" :data="data">
      <div style="margin: 10px;overflow: hidden" slot="footer">
        <div style="float: right;">
          <Page :total="total" :page-size="pageSize" show-total :current="pageIndex" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
        </div>
      </div>
    </Table>

    <!-- 添加弹框 -->
    <Drawer title="addMode" v-model="insertMode" width="500" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>添加新类型信息</span>
      </div>
      <Form ref="insertForm" :model="insertData"  :rules="submitRules" :label-width="130">
        <FormItem label="类型名称" prop="name">
          <Input v-model="insertData.name" placeholder="请输入类型名称..." style="width:250px" />
        </FormItem>
        <FormItem label="类型简介" prop="note" >
          <Input type="textarea" v-model="insertData.note" :rows="4" placeholder="请输入类型简介..." style="width:250px" />
        </FormItem>
        <FormItem label="类型状态：" prop="status" >
          <Select v-model="insertData.status" clearable style="width:200px">
            <Option  :value="1">可用</Option>
            <Option  :value="0">禁用(已删除)</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="insertMode = false">取消</Button>
        <Button style="margin-right: 8px" type="warning" ghost @click="handleReset('insertForm')">重置</Button>
        <Button type="primary" @click="handleSubmit('insertForm')">提交</Button>
      </div>
    </Drawer>

    <!-- 修改弹框 -->
    <Drawer title="updateMode" v-model="modifyMode" width="500" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>修改类型信息</span>
      </div>
      <Form ref="updateForm" :model="updateData"  :rules="submitRules" :label-width="130">
        <FormItem label="编号" prop="id">
          <Input v-model="updateData.id" readonly="readonly" style="width:250px" />
        </FormItem>
        <FormItem label="类型名称" prop="name">
          <Input v-model="updateData.name" placeholder="请输入类型名称..." style="width:250px" />
        </FormItem>
        <FormItem label="类型简介" prop="note" >
          <Input type="textarea" v-model="updateData.note" :rows="4" placeholder="请输入类型简介..." style="width:250px" />
        </FormItem>
        <FormItem label="类型状态：" prop="status" >
          <Select v-model="updateData.status" clearable style="width:200px">
            <Option  :value="1">可用</Option>
            <Option  :value="0">禁用(已删除)</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="modifyMode = false">取消</Button>
        <Button style="margin-right: 8px" type="warning" ghost @click="handleReset('updateForm')">重置</Button>
        <Button type="primary" @click="handleSubmit('updateForm')">提交</Button>
      </div>
    </Drawer>
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
          { required: true, message: '类型名称不能为空', trigger: 'blur' }
        ]
      },
      insertMode: false,
      modifyMode: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      }
    }
  },
  computed: {
    ...mapState('newsType', [
      'total',
      'pageIndex',
      'pageSize',
      'searchData',
      'updateData',
      'insertData',
      'data',
      'tableColumns'
    ]),
    ...mapState('newsType', {
      'selections': 'selection'
    })
  },
  created () {
    this.findDataAction({})
  },
  methods: {
    ...mapGetters('newsType', []),
    ...mapMutations('newsType', ['selection']),
    ...mapActions('newsType', ['findDataAction', 'insertFormData', 'updateFormData', 'getModifyData', 'deleteFormData']),
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
    updateAction () {
      if (this.selections.length !== 1) {
        this.$Message.info('请选择一条数据')
        return
      }
      this.getModifyData().then(() => {
        this.modifyMode = true
      })
    },
    insertForm () {
      this.insertFormData().then(({ data: { status, msg } }) => {
        if (status) {
          this.$Message.success(msg)
          this.findDataAction({})
          this.handleReset('insertForm')
          this.insertMode = false
        } else {
          this.$Message.error(msg)
        }
      })
    },
    updateForm () {
      this.updateFormData().then(({ data: { status, msg } }) => {
        if (status) {
          this.$Message.success(msg)
          this.findDataAction({})
          this.handleReset('updateForm')
          this.modifyMode = false
        } else {
          this.$Message.error(msg)
        }
      })
    },
    findForm () {
      this.findDataAction({})
    },
    deleteAction () {
      if (this.selections.length < 1) {
        this.$Message.info('请选择要删除的数据')
        return
      }
      if (!confirm('确定删除选中的数据？')) {
        return
      }
      let ids = []
      this.selections.forEach(val => ids.push(val['id']))
      this.deleteFormData({ ids }).then(({ data: { status, msg } }) => {
        if (status) {
          this.findDataAction({})
          this.$Message.success(msg)
        } else {
          this.$Message.error(msg)
        }
      })
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
