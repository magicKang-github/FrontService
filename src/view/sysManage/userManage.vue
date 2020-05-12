<template>
  <card style="height: 100%" >
    <!-- 主页面数据 -->
    <!-- 查询框 -->
    <Form ref="findForm" :model="searchData" :label-width="60" inline>
      <FormItem label="编号：" prop="id">
        <Input v-model="searchData.id"  placeholder="请输入编号..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="姓名：" prop="name">
        <Input  v-model="searchData.name" placeholder="请输入姓名..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="账户：" prop="account">
        <Input  v-model="searchData.account" placeholder="请输入账户..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="状态："  prop="status" >
        <Select v-model="searchData.status" clearable style="width:200px">
          <Option  :value="1">可用</Option>
          <Option  :value="0">不可用</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button style="margin-left: 8px" type="primary" ghost @click="handleSubmit('findForm')">查询</Button>
        <Button style="margin-left: 8px" type="warning" ghost @click="handleReset('findForm')">重置</Button>
      </FormItem>
    </Form>
    <!-- 按钮框 -->
    <div style="margin: 5px;">
      <Button style="margin-right: 3px;" type="success" @click="insertMode = true"  icon="md-add">添加</Button>
      <Button style="margin-right: 3px;" type="info" @click="updateAction"  icon="ios-create">修改</Button>
      <Button style="margin-right: 3px;" type="error" @click="deleteAction"  icon="ios-trash"  >删除</Button>
      <Button style="margin-right: 3px;" type="warning" @click="setRoleAction"  icon="ios-albums" >分配角色</Button>
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
    <Drawer title="addMode" v-model="insertMode" width="550" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>添加系统用户信息</span>
      </div>
      <Form ref="insertForm" :model="insertData"  :rules="submitRules" :label-width="130">
        <FormItem label="姓名" prop="name">
          <Input v-model="insertData.name" placeholder="请输入姓名..." style="width:310px" />
        </FormItem>
        <FormItem label="账户" prop="account">
          <Input v-model="insertData.account" placeholder="请输入账户..." style="width:310px" />
        </FormItem>
        <FormItem label="密码" prop="password" >
          <Input type="password" v-model="insertData.password" placeholder="请输入密码..." style="width:310px" />
        </FormItem>
        <FormItem label="头像" prop="avator">
          <upload-pic-input :defaultImages="insertData.avator" @on-change="handleUpload" width="200px" ref="upload"></upload-pic-input>
        </FormItem>
        <FormItem label="禁用状态" prop="status">
          <RadioGroup v-model="insertData.status">
            <Radio :label="1">激活</Radio>
            <Radio :label="0">禁用</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="insertMode = false">取消</Button>
        <Button type="primary" @click="handleSubmit('insertForm')">提交</Button>
      </div>
    </Drawer>

    <!-- 修改弹框 -->
    <Drawer title="updateMode" v-model="modifyMode" width="550" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>修改系统用户信息</span>
      </div>
      <Form ref="updateForm" :model="updateData"  :rules="submitRules" :label-width="130">
        <FormItem label="编号" prop="id">
          <Input v-model="updateData.id" readonly="readonly" style="width:310px" />
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="updateData.name" placeholder="请输入姓名" style="width:310px" />
        </FormItem>
        <FormItem label="账户" prop="account">
          <Input v-model="updateData.account" placeholder="请输入账户" style="width:310px" />
        </FormItem>
        <FormItem label="密码" prop="password" >
          <Input type="password" v-model="updateData.password" placeholder="请输入密码..." style="width:310px" />
        </FormItem>
        <FormItem label="确认密码" prop="rePassword" >
          <Input type="password" v-model="updateData.rePassword" placeholder="请输入密码..." style="width:310px" />
        </FormItem>
        <FormItem label="头像" prop="avator">
          <upload-pic-input :defaultImages="updateData.avator" @on-change="handleUpload" width="200px" ref="upload"></upload-pic-input>
        </FormItem>
        <FormItem label="禁用状态" prop="status">
          <RadioGroup v-model="updateData.status">
            <Radio :label="1">激活</Radio>
            <Radio :label="0">禁用</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="modifyMode = false">取消</Button>
        <Button type="primary" @click="handleSubmit('updateForm')">提交</Button>
      </div>
    </Drawer>

    <!-- 添加角色信息 -->
    <Drawer title="roleMode" v-model="roleMode" width="800" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>给<span style="color: red;margin-left: 3px;margin-right: 3px;">{{userName}}</span>分配角色（拖拽就可分配角色）</span>
      </div>
      <div>
        <drag-list :list1.sync="list1" :list2.sync="list2" :dropConClass="dropConClass">
          <h3 slot="left-title" style="text-align: center;font-size: 16px">已分配角色</h3>
          <Card style="margin-top: 10px;margin-left:6px;width: 96%" slot="left" slot-scope="left">{{ left.itemLeft.name }}</Card>
          <h3 slot="right-title" style="text-align: center;font-size: 16px">未分配角色</h3>
          <Card style="margin-top: 10px;margin-left:6px;width: 96%" slot="right" slot-scope="right">{{ right.itemRight.name }}</Card>
        </drag-list>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="roleMode = false">取消</Button>
        <Button type="primary" @click="submitRoles">提交</Button>
      </div>
    </Drawer>
  </card>
</template>
<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import Cropper from '@/components/cropper'
import DragList from '_c/drag-list'
import uploadPicInput from '@/view/components/upload-pic-input'

export default {
  components: {
    Cropper,
    DragList,
    uploadPicInput
  },
  data () {
    const validatePassCheck = (rule, value, callback) => {
      if (value !== this.updateData.password) {
        callback(new Error('您填写两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      submitRules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '账户不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请再次填写确认您的密码', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      },
      imageUrl: '',
      userName: 'admin',
      userID: '',
      roleMode: false,
      insertMode: false,
      modifyMode: false,
      list1: [],
      list2: [],
      dropConClass: {
        left: ['drop-box', 'left-drop-box'],
        right: ['drop-box', 'right-drop-box']
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
    ...mapState('userManage', [
      'total',
      'pageIndex',
      'pageSize',
      'searchData',
      'updateData',
      'insertData',
      'data',
      'tableColumns'
    ]),
    ...mapState('userManage', {
      'selections': 'selection'
    })
  },
  created () {
    this.findDataAction({})
  },
  methods: {
    ...mapGetters('userManage', []),
    ...mapMutations('userManage', ['setAvator', 'selection']),
    ...mapActions('userManage', ['findDataAction', 'submitRolesData', 'getHaveRolesData', 'getNoneRolesData', 'insertFormData', 'updateFormData', 'getModifyData', 'deleteFormData']),
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
        this.$refs.upload.modifySrc(this.updateData.avator)
        this.modifyMode = true
      })
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
      this.selections.forEach((val, index) => {
        ids.push(val['id'])
      })
      this.deleteFormData({ ids }).then(({ data: { status, message } }) => {
        if (status) {
          this.findDataAction({})
          this.$Message.success('删除成功')
        } else {
          this.$Message.error(message)
        }
      })
    },
    insertForm () {
      this.insertFormData().then(({ data: { status, message } }) => {
        if (status) {
          this.$Message.success('添加成功')
          this.findDataAction({})
          this.handleReset('insertForm')
          this.insertMode = false
        } else {
          this.$Message.error(message)
        }
      })
    },
    updateForm () {
      this.updateFormData().then(({ data: { status, message } }) => {
        if (status) {
          this.$Message.success('修改成功')
          this.findDataAction({})
          this.handleReset('updateForm')
          this.modifyMode = false
        } else {
          this.$Message.error(message)
        }
      })
    },
    findForm () {
      this.findDataAction({})
    },
    setRoleAction () {
      if (this.selections.length < 1) {
        this.$Message.info('请选择要分配角色的用户')
        return
      } else if (this.selections.length > 1) {
        this.$Message.info('请选择一条用户数据')
        return
      }
      if (this.userName === this.selections[0].name && this.list1.length > 0 && this.list2.length > 0) {
        this.roleMode = true
        return
      }
      this.$Message.loading({
        content: '数据加载中...',
        duration: 0
      })
      this.userName = this.selections[0].name
      this.userID = this.selections[0].id
      this.getHaveRolesData(this.selections[0].id).then((result1) => {
        this.list1 = result1
        this.getNoneRolesData(result1).then((result2) => {
          this.list2 = result2
          this.$Message.destroy()
          this.roleMode = true
        })
      })
    },
    submitRoles () {
      this.$Modal.confirm({
        title: '修改',
        content: '<p>您确认修改吗？</p>',
        onOk: () => {
          let list = this.list1
          let uid = this.userID
          this.submitRolesData({ list, uid }).then(({ data: { status, msg } }) => {
            if (status) {
              this.$Message.success(msg)
              this.roleMode = false
            } else {
              this.$Message.error(msg)
            }
          })
        },
        onCancel: () => { }
      })
    },
    handleUpload (v) {
      this.insertData.avator = v
      this.updateData.avator = v
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
  .drop-box{
    border: 1px solid #eeeeee;
    height: 500px;
    border-radius: 5px;
    background: #eeeeee;
  }
  .left-drop-box{
    margin-right: 10px;
  }
  .right-drop-box{

  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
