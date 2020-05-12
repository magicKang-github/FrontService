<template>
  <Row style="height:100%">
    <Col span="6" style="height:100%">
      <card style="height:100%">
        <div style="margin-left: 15px">
          <Divider orientation="left">菜单树列表</Divider>
          <Button style="margin-right: 2px;" type="success" @click="insertTreeNode()" icon="md-add">增加</Button>
          <Button style="margin-right: 2px;" type="info" @click="modifyTreeNode()" icon="ios-create">修改</Button>
          <Button style="margin-right: 2px;" type="error" @click="deleteTreeNode()" icon="ios-trash">删除</Button>
          <Tree :data="menuData" @on-select-change="selectTreeAction" ref="treess" style="padding:10px"></Tree>
        </div>
      </card>
    </Col>
    <Col span="17" offset="1" style="height:100%">
      <card style="height: 100%" >
        <Divider orientation="left">菜单详情表格</Divider>
        <Form ref="findForm" :model="searchData" :label-width="50" inline>
          <FormItem label="编号：" prop="id">
            <Input v-model="searchData.id"  placeholder="请输入编号..." clearable style="width: 170px" />
          </FormItem>
          <FormItem label="名称：" prop="name">
            <Input  v-model="searchData.name" placeholder="请输入名称..." clearable style="width: 170px" />
          </FormItem>
          <FormItem label="状态："  prop="status" >
            <Select v-model="searchData.status" clearable style="width:170px">
              <Option  :value="1">可用</Option>
              <Option  :value="0">不可用</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button style="margin-left: 8px" type="primary" ghost @click="handleSubmit('findForm')">查询</Button>
            <Button style="margin-left: 8px" type="warning" ghost @click="handleReset('findForm')">重置</Button>
          </FormItem>
        </Form>
        <!-- 数据表格 -->
        <Table :columns="tableColumns" :data="data" >
          <div style="margin: 20px;overflow: hidden" slot="footer">
            <div style="float: right;">
              <Page :total="total" :page-size="pageSize" show-total :current="pageIndex" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
            </div>
          </div>
        </Table>

        <!-- 添加弹框 -->
        <Drawer title="addMode" v-model="insertMode" width="500" :mask-closable="false" :styles="styles">
          <div slot="header" style="font-size:14px;font-weight:bold;">
            <span>添加菜单功能信息</span>
          </div>
          <Form ref="insertForm" :model="insertData"  :rules="submitRules" :label-width="130">
            <FormItem label="父级菜单编号" prop="pid">
              <Input v-model="insertData.pid" readonly style="width:250px" />
            </FormItem>
            <FormItem label="父级菜单名称" prop="pname">
              <Input v-model="insertData.pname" readonly style="width:250px" />
            </FormItem>
            <FormItem label="名称" prop="name">
              <Input v-model="insertData.name" placeholder="请输入功能名称..." style="width:250px" />
            </FormItem>
            <FormItem label="路径" prop="path">
              <Input v-model="insertData.path" placeholder="请输入路径..." style="width:250px" />
            </FormItem>
            <FormItem label="图标" prop="icon" >
              <Input :icon="insertData.icon" placeholder="点击选择图标" v-model="insertData.icon" @on-focus="showEditIcon(0)" style="width:250px"/>
            </FormItem>
            <template v-if="isFirstMenu">
              <FormItem label="组件" prop="component">
                <Select v-model="insertData.component" style="width:250px">
                  <Option value="main">主菜单</Option>
                </Select>
              </FormItem>
              <FormItem label="默认子级名称" prop="childrenName">
                <Input v-model="insertData.childrenName" placeholder="请输入功能名称..." style="width:250px" />
              </FormItem>
              <FormItem label="默认子级路径" prop="childrenPath">
                <Input v-model="insertData.childrenPath" placeholder="请输入路径..." style="width:250px" />
              </FormItem>
              <FormItem label="默认子级图标" prop="childrenIcon" >
                <Input :icon="insertData.childrenIcon" placeholder="点击选择图标" v-model="insertData.childrenIcon" @on-focus="showEditIcon(2)" style="width:250px"/>
              </FormItem>
              <FormItem label="默认子级组件" prop="childrenComponent">
                <Select v-model="insertData.childrenComponent" style="width:250px" filterable>
                  <Option v-for="item in componentList" :value="item.value" :key="item.value" :label="item.label"><span>{{ item.label }}</span><span style="float: right;color:#ccc">{{ item.value }}</span></Option>
                </Select>
              </FormItem>
            </template>
            <template v-else >
              <FormItem label="组件" prop="component">
                <Select v-model="insertData.component" style="width:250px" filterable>
                  <Option v-for="item in componentList" :value="item.value" :key="item.value" :label="item.label"><span>{{ item.label }}</span><span style="float: right;color:#ccc">{{ item.value }}</span></Option>
                </Select>
              </FormItem>
            </template>
          </Form>
          <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="closeFormAction('insertMode','insertForm')">取消</Button>
            <Button type="primary" @click="handleSubmit('insertForm')">提交</Button>
          </div>
        </Drawer>

        <!-- 修改弹框 -->
        <Drawer title="updateMode" v-model="modifyMode" width="500" :mask-closable="false" :styles="styles">
          <div slot="header" style="font-size:14px;font-weight:bold;">
            <span>修改菜单功能信息</span>
          </div>
          <Form ref="updateForm" :model="updateData"  :rules="submitRules" :label-width="130">
            <FormItem label="编号" prop="nodeKey">
              <Input v-model="updateData.id" readonly="readonly" style="width:250px" />
            </FormItem>
            <FormItem label="名称" prop="name">
              <Input v-model="updateData.name" placeholder="请输入功能名称..." style="width:250px" />
            </FormItem>
            <FormItem label="路径" prop="path">
              <Input v-model="updateData.path" placeholder="请输入路径..." style="width:250px" />
            </FormItem>
            <FormItem label="图标" prop="icon" >
              <Input :icon="updateData.icon" placeholder="点击选择图标" v-model="updateData.icon" @on-focus="showEditIcon(1)" style="width:250px"/>
            </FormItem>
            <template v-if="!isFirstMenu">
              <FormItem label="组件" prop="component">
                <Select v-model="updateData.component" style="width:250px" filterable>
                  <Option v-for="item in componentList" :value="item.value" :key="item.value" :label="item.label"><span>{{ item.label }}</span><span style="float: right;color:#ccc">{{ item.value }}</span></Option>
                </Select>
              </FormItem>
            </template>
          </Form>
          <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="closeFormAction('modifyMode','updateForm')">取消</Button>
            <Button type="primary" @click="handleSubmit('updateForm')">提交</Button>
          </div>
        </Drawer>

        <Modal v-model="useTipOfMenu" title="菜单栏使用提示（可以在系统设置中关闭此弹窗）">
          <p>菜单目录规则：</p>
          <p style="margin-left: 15px;">1.二级菜单，不能增加第三级菜单</p>
          <p style="margin-left: 15px;">2."菜单"为根菜单目录，不能修改，可以添加子节点</p>
          <p style="margin-left: 15px;">3.根菜单目录下添加一级菜单时，需要默认添加二级菜单</p>
          <p style="margin-left: 15px;">4.一级和二级菜单目录名称不能相同</p>
        </Modal>

        <Modal title="选择图标" v-model="iconModalVisible" :width="800" :styles="{top: '30px'}" footer-hide>
          <icon-choose @on-select="handleSelectIcon"></icon-choose>
        </Modal>
      </card>
    </Col>
  </Row>
</template>
<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import IconChoose from '@/view/components/icon-choose'

export default {
  components: {
    IconChoose
  },
  data () {
    const validateCheckName = (rule, value, callback) => {
      if (value === this.insertData.name) {
        callback(new Error('子节点名称不能喝当前节点名称一致'))
      } else {
        callback()
      }
    }
    return {
      submitRules: {
        name: [
          { required: true, message: '节点名称不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '节点路径不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '节点图标不能为空', trigger: 'change' }
        ],
        component: [
          { required: true, message: '节点组件不能为空', trigger: 'change' }
        ],
        childrenName: [
          { required: true, message: '子节点名称不能为空', trigger: 'blur' },
          { validator: validateCheckName, trigger: 'blur' }
        ],
        childrenPath: [
          { required: true, message: '子节点路径不能为空', trigger: 'blur' }
        ],
        childrenIcon: [
          { required: true, message: '子节点图标不能为空', trigger: 'change' }
        ],
        childrenComponent: [
          { required: true, message: '子节点组件不能为空', trigger: 'change' }
        ]
      },
      useTipOfMenu: true, // 功能菜单栏的提示按钮开关
      isFirstMenu: true, // 一级菜单目录增加的判断，true为一级目录，false为二级目录，不增加三级目录
      currentSelectedNode: Object, // 当前选择的节点对象
      insertMode: false,
      modifyMode: false,
      iconModalVisible: false,
      iconType: 0,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      }
    }
  },
  computed: {
    ...mapState('functionManage', [
      'menuData',
      'iconList',
      'componentList',
      'total',
      'pageIndex',
      'pageSize',
      'searchData',
      'updateData',
      'insertData',
      'data',
      'tableColumns'
    ])
  },
  created () {
    this.findDataAction({})
    this.findMenuData()
    this.findComponentsData()
  },
  methods: {
    ...mapGetters('functionManage', []),
    ...mapMutations('functionManage', ['setParentNode', 'setTableData', 'setUpdateData']),
    ...mapActions('functionManage', ['findDataAction', 'findMenuData', 'findComponentsData', 'insertFormData', 'updateFormData', 'deleteFormData']),
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this[name]({})
        } else {
          this.$Message.error('表单数据验证失败')
        }
      })
    },
    closeFormAction (name, formName) {
      this[name] = false
      this.handleReset(formName)
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
    insertForm () {
      this.insertFormData(this.isFirstMenu).then(({ data: { status, msg } }) => {
        if (status) {
          this.$Message.success('添加成功')
          this.findDataAction({})
          this.findMenuData()
          this.handleReset('insertForm')
          this.insertMode = false
        } else {
          this.$Message.error(msg)
        }
      })
    },
    updateForm () {
      this.updateFormData().then(({ data: { status, message } }) => {
        if (status) {
          this.$Message.success('修改成功')
          this.findDataAction({})
          this.findMenuData()
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
    selectTreeAction (currentArray, currentNode) {
      this.currentSelectedNode = currentNode
      let nodeData = []
      nodeData.push(currentNode)
      this.setTableData(nodeData)
    },
    insertTreeNode () {
      if (Object.keys(this.currentSelectedNode).length < 1) {
        this.$Message.info('请选择一条数据')
      } else if (!this.currentSelectedNode.children || this.currentSelectedNode.children.length < 1) {
        this.$Message.info('不能增加第三级目录')
      } else {
        console.log(this.currentSelectedNode)
        this.isFirstMenu = this.currentSelectedNode.nodeKey === 0
        this.setParentNode(this.currentSelectedNode)
        this.insertMode = true
      }
    },
    modifyTreeNode () {
      if (Object.keys(this.currentSelectedNode).length < 1) {
        this.$Message.info('请选择一条数据')
      } else if (this.currentSelectedNode.nodeKey === 0) {
        this.$Message.info('无法选择修改根节点目录')
      } else {
        this.isFirstMenu = this.currentSelectedNode.children.length > 0
        this.setUpdateData(this.currentSelectedNode)
        this.modifyMode = true
      }
    },
    deleteTreeNode () {
      if (Object.keys(this.currentSelectedNode).length < 1) {
        this.$Message.info('请选择一条数据')
      } else if (this.currentSelectedNode.nodeKey === 0) {
        this.$Message.info('无法选择删除根节点目录')
      } else {
        let ids = []
        ids.push(this.currentSelectedNode.id)
        if (this.currentSelectedNode.children.length > 0) {
          this.currentSelectedNode.children.forEach(item => {
            ids.push(item.id)
          })
        }
        let content = (this.currentSelectedNode.children.length > 0) ? '确定要删除菜单节点目录“' + this.currentSelectedNode.name + '”和该目录下的全部子节点吗？' : '确定要删除菜单节点“' + this.currentSelectedNode.name + '”吗？'
        const deleteAction = (ids) => {
          this.deleteFormData({ ids }).then(({ data: { status, message } }) => {
            if (status) {
              this.findDataAction({})
              this.findMenuData()
              this.$Message.success('删除成功')
            } else {
              this.$Message.error(message)
            }
          })
        }
        this.$Modal.error({
          title: '删除',
          content: content,
          onOk: () => { deleteAction(ids) }
        })
      }
    },
    /**
     *  打开图标选择框
     * @param v 图表类型
     */
    showEditIcon (v) {
      this.iconType = v
      this.iconModalVisible = true
    },
    /**
     * 选择图标
     * @param v 图标值
     */
    handleSelectIcon (v) {
      if (this.iconType === 0) {
        this.insertData.icon = v
      } else if (this.iconType === 2) {
        this.insertData.childrenIcon = v
      } else {
        this.updateData.icon = v
      }
      this.iconModalVisible = false
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
