<template>
  <card style="height: 100%" >
    <Tabs v-model="tabName">
      <!--   新闻数据   -->
      <TabPane label="新闻数据" name="name1">
        <!-- 主页面数据 -->
        <!-- 查询框 -->
        <Form ref="findForm" :model="searchData" :label-width="65" inline>
          <FormItem label="编号：" prop="id">
            <Input v-model="searchData.id"  placeholder="请输入编号..." clearable style="width: 200px" />
          </FormItem>
          <FormItem label="标题：" prop="title">
            <Input  v-model="searchData.title" placeholder="请输入标题..." clearable style="width: 200px" />
          </FormItem>
          <FormItem label="作者：" prop="author">
            <Input  v-model="searchData.author" placeholder="请输入作者名..." clearable style="width: 200px" />
          </FormItem>
          <FormItem label="类型：" prop="type">
            <Select v-model="searchData.type" placeholder="请选择类型..." clearable style="width:200px">
              <Option v-for="itemType in typeList" :value="itemType.id" :key="itemType.id" >{{ itemType.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态：" prop="status">
            <Select v-model="searchData.status" placeholder="请选择类型..." clearable style="width:200px">
              <Option  :value="1">可用</Option>
              <Option  :value="0">禁用</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button style="margin-left: 8px" type="primary" ghost @click="handleSubmit('findForm')">查询</Button>
            <Button style="margin-left: 8px" type="warning" ghost @click="handleReset('findForm')">重置</Button>
          </FormItem>
        </Form>
        <!-- 数据表格 -->
        <Table :columns="tableColumns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="showParams(index)">查看</Button>
            <Button type="error" size="small" style="margin-right: 5px" @click="deleteNews(index)">删除</Button>
          </template>
          <div style="margin: 10px;overflow: hidden" slot="footer">
            <div style="float: right;">
              <Page :total="total" :page-size="pageSize" show-total :current="pageIndex" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
            </div>
          </div>
        </Table>
      </TabPane>
      <!--   编辑文章 Editor   -->
      <TabPane label="编辑文章(Editor)" name="name2">
        <Form ref="insertFrom" :model="insertData" :label-width="80" inline>
          <FormItem label="文章标题：" prop="title">
            <Input  v-model="insertData.title" placeholder="请输入标题..." clearable style="width: 500px" />
          </FormItem>
          <FormItem label="作者：" prop="author">
            <Input  v-model="insertData.author" placeholder="请输入作者名..." clearable style="width: 200px;" />
          </FormItem>
          <FormItem label="文章类型：" prop="type">
            <Select v-model="insertData.type" placeholder="请选择类型..." clearable style="width:200px">
              <Option v-for="itemType in typeList" :value="itemType.id" :key="itemType.id" >{{ itemType.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="文章摘要：" prop="summary" >
            <Input type="textarea" v-model="insertData.summary" :rows="1" style="width:500px" />
          </FormItem>
          <FormItem label="图片路径：" prop="url" >
            <upload-pic-input :defaultImages="insertData.images" placeholder="请输入图片路径..." @on-change="handleUpload" width="200px" ref="upload"></upload-pic-input>
          </FormItem>
          <Button style="margin-left: 8px;width:100px;" icon="md-brush" type="primary" ghost @click="handleSubmit('insertFrom')">点击发布</Button>
          <editor ref="editor" :value="insertData.content" @on-change="handleChange"/>
        </Form>
      </TabPane>
      <!--   编辑文章 MarkDown   -->
      <TabPane label="编辑文章(MarkDown)" name="name3">
        <Form ref="insertMarkDownFrom" :model="insertMarkDownData" :label-width="80" inline>
          <FormItem label="文章标题：" prop="title">
            <Input  v-model="insertMarkDownData.title" placeholder="请输入标题..." clearable style="width: 500px" />
          </FormItem>
          <FormItem label="作者：" prop="author">
            <Input  v-model="insertMarkDownData.author" placeholder="请输入作者名..." clearable style="width: 200px;" />
          </FormItem>
          <FormItem label="文章类型：" prop="type">
            <Select v-model="insertMarkDownData.type" placeholder="请选择类型..." clearable style="width:200px">
              <Option v-for="itemType in typeList" :value="itemType.id" :key="itemType.id" >{{ itemType.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="文章摘要：" prop="summary" >
            <Input type="textarea" v-model="insertMarkDownData.summary" :rows="1" style="width:500px" />
          </FormItem>
          <FormItem label="图片路径：" prop="url" >
            <upload-pic-input :defaultImages="insertMarkDownData.images" placeholder="请输入图片路径..." @on-change="handleUpload" width="200px" ref="upload"></upload-pic-input>
          </FormItem>
          <Button style="margin-left: 8px;width:100px;" icon="md-brush" type="primary" ghost @click="handleSubmit('insertMarkDownFrom')">点击发布</Button>
          <markdown-editor ref="MarkDown" v-model="insertMarkDownData.content" @on-change="handleMarkDownChange"/>
        </Form>
      </TabPane>
    </Tabs>

    <Drawer v-model="showMode" width="550" :styles="styles" :closable="false">
      <div slot="header" style="font-size:14px;font-weight:bold;text-align: center">
        <span style="font-style: italic; color: rgb(194, 79, 74);">{{newsInfo.title}}</span>
      </div>
      <div class="demo-drawer-profile">
        <Row style="margin-bottom: 12px;">
          <Col span="7" offset="1">
            作者: {{newsInfo.author}}
          </Col>
          <Col span="8">
            阅读量: {{newsInfo.record}}
          </Col>
          <Col span="8">
            发布时间: {{newsInfo.createtime}}
          </Col>
        </Row>
        <Row style="margin-bottom: 12px;">
          <Col span="23" offset="1">
            <Card dis-hover style="width:90%;margin: 0 auto 20px;" >
              <img :src="newsInfo.images" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
            </Card>
          </Col>
        </Row>
        <Row style="margin-bottom: 12px;">
          <Col span="23" offset="1">
            摘要: {{newsInfo.summary}}
          </Col>
        </Row>
        <Row style="margin-bottom: 12px;">
          <Col span="23" offset="1">
            内容: <span v-html="newsInfo.content">{{newsInfo.content}}</span>
          </Col>
        </Row>
      </div>
    </Drawer>
  </card>
</template>
<script>
import Editor from '_c/editor'
import MarkdownEditor from '_c/markdown'
import uploadPicInput from '../components/upload-pic-input'
import { getTypeListRequest, findDataActionRequest, insertFormDataRequest, deleteFormDataRequest } from '../../api/news/newsManageApi'
import config from '../../config/index'

const { pageSize } = config
export default {
  components: {
    Editor,
    MarkdownEditor,
    uploadPicInput
  },
  data () {
    return {
      tabName: 'name1',
      typeList: [],
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
      },
      showMode: false,
      newsInfo: {
        id: '',
        author: '',
        content: '',
        title: '',
        type: '',
        record: '',
        status: '',
        summary: '',
        images: '',
        createtime: ''
      },
      total: 0,
      pageIndex: 1,
      pageSize: pageSize,
      searchData: {
        id: '',
        title: '',
        author: '',
        type: '',
        status: ''
      },
      insertMarkDownData: {
        title: '',
        author: '',
        type: '',
        summary: '',
        content: '',
        images: ''
      },
      insertData: {
        title: '',
        author: '',
        type: '',
        summary: '',
        content: '',
        images: ''
      },
      data: [],
      tableColumns: [
        {
          align: 'center',
          title: '编号',
          key: 'id'
        },
        {
          align: 'center',
          title: '文章标题',
          key: 'title',
          tooltip: true
        },
        {
          align: 'center',
          title: '文章作者',
          key: 'author'
        },
        {
          align: 'center',
          title: '文章类型',
          key: 'type',
          render: (h, params) => {
            let re = ''
            this.typeList.forEach(item => {
              if (params.row.type === item.id) {
                re = item.name
              }
            })
            return h('div', re)
          }
        },
        {
          align: 'center',
          title: '文章概要',
          key: 'summary',
          tooltip: true
        },
        {
          align: 'center',
          title: '阅读量',
          key: 'record'
        },
        {
          align: 'center',
          title: '发布时间',
          key: 'createtime'
        },
        {
          title: '查看详情',
          slot: 'action',
          fixed: 'right',
          width: 200,
          align: 'center'
        }
      ]
    }
  },
  created () {
    this.findDataAction()
    this.getTypeList()
  },
  methods: {
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
      this.pageSize = pageSize
      this.findDataAction()
    },
    changePage (pageNum) {
      this.pageIndex = pageNum
      this.findDataAction()
    },
    findForm () {
      this.findDataAction()
    },
    findDataAction () {
      let params = {
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }
      findDataActionRequest({ ...this.searchData, ...params }).then(({ data: { data: trueData } }) => {
        let { total, records, current, size } = trueData
        records.forEach((item, index) => {
          records[index].status = item.status ? 1 : 0
        })
        this.data = records
        this.total = total
        this.pageIndex = current
        this.pageSize = size
        this.loading = false
      })
    },
    getTypeList () {
      getTypeListRequest().then(({ data: { status, msg, data } }) => {
        if (status) {
          this.typeList = data
        } else {
          this.$Message.error(msg)
        }
      })
    },
    showParams (index) {
      this.newsInfo = this.data[index]
      this.showMode = true
    },
    deleteNews (index) {
      let ids = []
      ids.push(this.data[index].id)
      deleteFormDataRequest(ids).then(({ data: { status, msg } }) => {
        if (status) {
          this.$Message.success(msg)
          this.findDataAction()
        } else {
          this.$Message.error(msg)
        }
      })
    },
    insertFrom () {
      insertFormDataRequest(this.insertData).then(({ data: { status, msg } }) => {
        if (status) {
          this.$Message.success('文章发布成功！')
          this.findDataAction()
          this.handleReset('insertFrom')
          this.$refs.editor.setHtml('')
          setTimeout(() => {
            this.tabName = 'name1'
          }, 1000)
        } else {
          this.$Message.error('文章发布失败！' + msg)
        }
      })
    },
    insertMarkDownFrom () {
      insertFormDataRequest(this.insertMarkDownData).then(({ data: { status, msg } }) => {
        if (status) {
          this.$Message.success('文章发布成功！')
          this.findDataAction()
          this.handleReset('insertMarkDownFrom')
          this.insertMarkDownData.content = ''
          setTimeout(() => {
            this.tabName = 'name1'
          }, 1000)
        } else {
          this.$Message.error('文章发布失败！' + msg)
        }
      })
    },
    handleUpload (v) {
      this.insertData.images = v
      this.insertMarkDownData.images = v
    },
    handleChange (html, text) {
      this.insertData.content = html
    },
    handleMarkDownChange (html) {
      this.insertMarkDownData.content = html
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
