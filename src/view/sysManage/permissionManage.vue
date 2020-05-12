<template>
  <card style="height: 100%" >
    <!-- 主页面数据 -->
    <!-- 查询框 -->
    <Form ref="findForm" :model="searchData" :label-width="80" inline>
      <FormItem label="编号：" prop="id">
        <Input v-model="searchData.id"  placeholder="请输入编号..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="名称：" prop="name">
        <Input  v-model="searchData.name" placeholder="请输入名称..." clearable style="width: 190px" />
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
      <Button style="margin-right: 3px;" type="warning" @click="setFunctionAction"  icon="ios-albums" >分配功能</Button>
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
        <span>添加角色信息</span>
      </div>
      <Form ref="insertForm" :model="insertData"  :rules="submitRules" :label-width="130">
        <FormItem label="名称" prop="name">
          <Input v-model="insertData.name" placeholder="请输入角色名称..." style="width:250px" />
        </FormItem>
        <FormItem label="描述" prop="introduce">
          <Input v-model="insertData.introduce" placeholder="请输入角色信息描述..." style="width:250px" />
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
    <Drawer title="updateMode" v-model="modifyMode" width="500" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>修改角色信息</span>
      </div>
      <Form ref="updateForm" :model="updateData"  :rules="submitRules" :label-width="130">
        <FormItem label="编号" prop="id">
          <Input v-model="updateData.id" readonly="readonly" style="width:250px" />
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="updateData.name" placeholder="请输入角色名称..." style="width:250px" />
        </FormItem>
        <FormItem label="描述" prop="introduce">
          <Input v-model="updateData.introduce" placeholder="请输入角色信息描述..." style="width:250px" />
        </FormItem>
        <FormItem label="禁用状态" prop="status">
          <RadioGroup v-model="updateData.status">
            <Radio :label='1'>激活</Radio>
            <Radio :label='0'>禁用</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="modifyMode = false">取消</Button>
        <Button type="primary" @click="handleSubmit('updateForm')">提交</Button>
      </div>
    </Drawer>

    <!-- 分配功能弹框 -->
    <Drawer title="allotMode" v-model="allotMode" width="800" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>给<span style="color: red;margin-left: 3px;margin-right: 3px;">{{roleName}}</span>角色分配功能</span>
      </div>
      <Row style="height: 100%">
        <Col span="10" style="height: 100%;">
          <Card :bordered="false" style="height: 100%;">
            <p slot="title">当前已有权限</p>
            <Tree :data="haveMenuData" @on-select-change="selectTreeLeftAction" ref="treess" style="padding:10px"></Tree>
          </Card>
        </Col>
        <Col span="4" style="height: 100%;padding-top: 30%;padding-left: 3%">
          <div style="height: 20%;">
            <Button style="margin: 5px auto;" :disabled="!insertBtnAble" type="success" @click="insertTreeNode()" icon="md-arrow-back">添加</Button>
            <Button style="margin: 5px auto;" :disabled="!deleteBtnAble" type="info" @click="deleteTreeNode()" icon="md-arrow-forward">删除</Button>
            <Button style="margin: 5px auto;" :disabled="!returnBtnAble" type="error" @click="returnAction()" icon="md-return-left">撤销</Button>
          </div>
        </Col>
        <Col span="10" style="height: 100%;">
          <Card :bordered="false" style="height: 100%;">
            <p slot="title">可分配权限</p>
            <Tree :data="noneMenuData" @on-select-change="selectTreeRightAction" ref="treess" style="padding:10px"></Tree>
          </Card>
        </Col>
      </Row>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="closeTreeWindow">取消</Button>
        <Button type="primary" @click="submitTreeAction">提交</Button>
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
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      },
      roleName: 'admin',
      roleID: '',
      insertMode: false,
      modifyMode: false,
      allotMode: false,
      insertBtnAble: false,
      deleteBtnAble: false,
      returnBtnAble: false,
      currentNodeLeft: Object,
      currentNodeRight: Object,
      historyAction: [],
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static',
        background: '#eee'
      }
    }
  },
  computed: {
    ...mapState('permissionManage', [
      'total',
      'pageIndex',
      'pageSize',
      'searchData',
      'updateData',
      'insertData',
      'data',
      'tableColumns',
      'haveMenuData',
      'noneMenuData'
    ]),
    ...mapState('permissionManage', {
      'selections': 'selection'
    })
  },
  created () {
    this.findDataAction({})
    // this.findMenuData()
  },
  methods: {
    ...mapGetters('permissionManage', []),
    ...mapMutations('permissionManage', ['selection', 'insertTreeNodeJs', 'deleteTreeNodeJs', 'setHaveMenu', 'setNoneMenu', 'sethaveMenuData', 'setnoneMenuData']),
    ...mapActions('permissionManage', ['findMenuData', 'submitTreeData', 'findDataAction', 'insertFormData', 'updateFormData', 'getModifyData', 'deleteFormData']),
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
      this.deleteFormData({ ids }).then(({ data: { status, msg } }) => {
        if (status) {
          this.findDataAction({})
          this.$Message.success(msg)
        } else {
          this.$Message.error(msg)
        }
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
    selectTreeLeftAction (currentArray, currentNode) {
      if (currentNode.nodeKey === 0) {
        this.$Message.info('无法选择修改根节点目录')
        currentNode.selected = false
        return
      }
      this.currentNodeLeft = currentNode
      this.deleteBtnAble = true
    },
    selectTreeRightAction (currentArray, currentNode) {
      if (currentNode.nodeKey === 0) {
        this.$Message.info('无法选择修改根节点目录')
        currentNode.selected = false
        return
      }
      this.currentNodeRight = currentNode
      this.insertBtnAble = true
    },
    insertTreeNode () {
      this.historyAction.push({ left: JSON.stringify(this.haveMenuData), right: JSON.stringify(this.noneMenuData) })
      this.insertTreeNodeJs(this.currentNodeRight)
      this.currentNodeRight.selected = false
      this.insertBtnAble = false
      this.returnBtnAble = true
    },
    deleteTreeNode () {
      this.historyAction.push({ left: JSON.stringify(this.haveMenuData), right: JSON.stringify(this.noneMenuData) })
      this.deleteTreeNodeJs(this.currentNodeLeft)
      this.currentNodeLeft.selected = false
      this.deleteBtnAble = false
      this.returnBtnAble = true
    },
    returnAction () {
      if (this.historyAction.length < 1) {
        this.$Message.error('当前没有操作历史')
        return
      }
      let history = this.historyAction.pop()
      this.setHaveMenu(JSON.parse(history.left))
      this.setNoneMenu(JSON.parse(history.right))
      if (this.historyAction.length < 1) {
        this.returnBtnAble = false
      }
    },
    setFunctionAction () {
      if (this.selections.length < 1) {
        this.$Message.info('请选择要分配功能的角色')
        return
      } else if (this.selections.length > 1) {
        this.$Message.info('只能选中一条数据进行操作')
        return
      }
      this.findMenuData(this.selections[0].id)
      this.roleID = this.selections[0].id
      this.roleName = this.selections[0].name
      this.allotMode = true
    },
    submitTreeAction () {
      this.$Modal.confirm({
        title: '修改',
        content: '<p>您确认修改吗？</p>',
        onOk: () => {
          this.submitTreeData(this.roleID).then(result => {
            if (result) {
              this.$Message.success('分配权限成功')
              this.allotMode = false
              this.historyAction = []
              this.returnBtnAble = false
            } else {
              this.$Message.error('分配权限失败，具体问题请系统联系管理员！！！')
            }
          })
        },
        onCancel: () => { }
      })
    },
    closeTreeWindow () {
      this.allotMode = false
      this.historyAction = []
      this.returnBtnAble = false
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
