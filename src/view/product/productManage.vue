<template>
  <card style="height: 100%" >
    <!-- 主页面数据 -->
    <!-- 查询框 -->
    <Form ref="findForm" :model="searchData" :label-width="60" inline>
      <FormItem label="编号：" prop="id">
        <Input v-model="searchData.id"  placeholder="请输入编号..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="产品名：" prop="name">
        <Input  v-model="searchData.name" placeholder="请输入产品名..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="类型：" prop="type">
        <Select v-model="searchData.type" filterable clearable placeholder="请搜索选择产品类型..." style="width:190px">
          <Option v-for="itemType in typeList" :value="itemType.id" :key="itemType.id" >{{ itemType.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="标签：" prop="tags">
        <Select v-model="searchDataTags" multiple style="width:190px">
          <Option v-for="itemTag in tagList" :value="itemTag.id" :key="itemTag.id">{{ itemTag.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="状态：" prop="status" >
        <Select v-model="searchData.status" clearable style="width:190px">
          <Option  :value="1">可用</Option>
          <Option  :value="0">禁用</Option>
        </Select>
      </FormItem>
      <FormItem label="品牌：" prop="brand">
        <Input  v-model="searchData.brand" placeholder="请输入品牌..." clearable style="width: 190px" />
      </FormItem>
      <FormItem label="产地：" prop="origin">
        <Input  v-model="searchData.origin" placeholder="请输入产地..." clearable style="width: 190px" />
      </FormItem>
      <FormItem>
        <Button style="margin-left: 8px" type="primary" ghost @click="findForm">查询</Button>
        <Button style="margin-left: 8px" type="warning" ghost @click="handleReset('findForm')">重置</Button>
      </FormItem>
    </Form>
    <!-- 按钮框 -->
    <div style="margin: 5px;">
      <Button style="margin-right: 3px;" type="success" @click="insertMode = true"  icon="md-add">添加</Button>
      <Button style="margin-right: 3px;" type="info" @click="updateAction"  icon="ios-create">修改</Button>
      <Button style="margin-right: 3px;" type="error" @click="deleteAction"  icon="ios-trash"  >删除</Button>
      <Button style="margin-right: 3px;" type="warning"  :loading="exportLoading.excel" @click="exportAction" icon="md-download">导出Excel</Button>
      <Button style="margin-right: 3px;" type="warning"  :loading="exportLoading.csv" @click="getCSVModel" icon="md-download">导出CSV</Button>
      <Button style="margin-right: 3px;" type="warning"  :loading="exportLoading.template" @click="importTemplateAction" icon="md-download">下载Excel模板</Button>
      <Button style="margin-right: 3px;" type="success" @click="getTagModel" icon="md-link">关联标签</Button>
      <Button style="margin-right: 3px;" type="success" @click="getGauzeModel" icon="md-link">关联纱网</Button>
      <Button style="margin-right: 3px;" type="success" @click="getPartModel" icon="md-link">关联配件</Button>
      <Upload style="margin-top: 5px;" action="http://localhost:9090/api/product/import/product?updateSupport=true" :on-success="importSuccess" :on-error="importError">
        <Button style="margin-right: 3px;" type="primary" icon="ios-cloud-upload-outline">上传Excel</Button>
      </Upload>
    </div>
    <!-- 数据表格 -->
    <Table  @on-selection-change="setSelection" :loading="loading" :columns="tableColumns" :data="data" ref="table">
      <template slot-scope="{ row, index }" slot="action">
        <template v-if="data[index].hasInfo">
          <Button type="primary" size="small" style="margin-right: 5px" @click="showParams(index)">View</Button>
          <Button type="warning" size="small" style="margin-right: 5px" @click="modifyParams(index)">Update</Button>
        </template>
        <template v-else>
          <Button type="success" size="small" style="margin-right: 5px" @click="addParams(index)">Add</Button>
        </template>
      </template>
      <div style="margin: 10px;overflow: hidden" slot="footer">
        <div style="float: right;">
          <Page :total="total" :page-size="pageSize" show-total :current="pageIndex" @on-change="changePage" @on-page-size-change='changePageSize'></Page>
        </div>
      </div>
    </Table>

    <!-- 弹框 -->
    <!-- 添加产品基本信息弹框 -->
    <Drawer v-model="insertMode" width="550" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>添加新产品</span>
      </div>
      <Form ref="insertForm" :model="insertData"  :rules="submitRules" :label-width="130">
        <FormItem label="产品名：" prop="name">
          <Input  v-model="insertData.name" placeholder="请输入产品名..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="类型：" prop="type">
          <Select v-model="insertData.type" filterable clearable placeholder="请搜索选择产品类型..." style="width:310px">
            <Option v-for="itemType in typeList" :value="itemType.id" :key="itemType.id" >{{ itemType.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="定价：" prop="price">
          <Input  v-model="insertData.price" placeholder="请输入定价..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="海报图(小)：" prop="imagesSmall">
          <upload-pic-input :default-images="insertData.imagesSmall" :default-type="imagesUploadIndex.insertProductSmall"
                            @on-change="handleUpload" width="200px" ref="upload"></upload-pic-input>
        </FormItem>
        <FormItem label="海报图(大)：" prop="imagesDetail">
          <upload-pic-input :default-images="insertData.imagesDetail" :default-type="imagesUploadIndex.insertProductDetail"
                            @on-change="handleUpload" width="200px" ref="upload"></upload-pic-input>
        </FormItem>
        <FormItem label="状态：" prop="status" >
          <Select v-model="insertData.status" clearable style="width:310px">
            <Option  :value="1">可用</Option>
            <Option  :value="0">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="产品简介：" prop="introduce">
          <Input type="textarea" :rows="4"  v-model="insertData.introduce" placeholder="请输入产品简介..." clearable style="width: 310px" />
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="insertMode = false">取消</Button>
        <Button style="margin-right: 8px" type="warning" ghost @click="handleReset('insertForm')">重置</Button>
        <Button type="primary" @click="handleSubmit('insertForm')">提交</Button>
      </div>
    </Drawer>

    <!-- 添加产品参数弹框 -->
    <Drawer v-model="insertParamsMode" width="550" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>添加&nbsp;<span style="color: red">{{selectProductName}}</span>&nbsp;产品的产品参数</span>
      </div>
      <Form ref="insertParamsForm" :model="insertParams"  :rules="submitRules" :label-width="130">
        <FormItem label="编号" prop="id">
          <Input v-model="insertParams.pid" readonly="readonly" style="width:310px" />
        </FormItem>
        <FormItem label="品牌：" prop="brand">
          <Input  v-model="insertParams.brand" placeholder="请输入品牌..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="材质：" prop="profile">
          <Input  v-model="insertParams.profile" placeholder="请输入材质..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="尺寸：" prop="size">
          <Input  v-model="insertParams.size" placeholder="请输入尺寸..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="玻璃：" prop="glass">
          <Input  v-model="insertParams.glass" placeholder="请输入玻璃..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="颜色：" prop="color">
          <Input  v-model="insertParams.color" placeholder="请输入颜色..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="生产周期：" prop="cycle">
          <Input  v-model="insertParams.cycle" placeholder="请输入生产周期..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="产地：" prop="origin">
          <Input  v-model="insertParams.origin" placeholder="请输入产地..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="状态：" prop="status" >
          <Select v-model="insertParams.status" clearable style="width:310px">
            <Option  :value="1">可用</Option>
            <Option  :value="0">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="图片列表：" prop="brand">
          <Button style="margin-right: 8px;width: 310px" :type="imageBtn.type" ghost @click="getImageMode">{{imageBtn.value}}</Button>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="insertParamsMode = false">取消</Button>
        <Button style="margin-right: 8px" type="warning" ghost @click="handleReset('insertParamsForm')">重置</Button>
        <Button type="primary" @click="handleSubmit('insertParamsForm')">提交</Button>
      </div>
    </Drawer>

    <!-- 修改产品参数弹框 -->
    <Drawer v-model="modifyParamsMode" width="550" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>修改<span style="color: red">{{selectProductName}}</span>产品的产品参数</span>
      </div>
      <Form ref="updateParamsForm" :model="updateParams"  :rules="submitRules" :label-width="130">
        <FormItem label="编号" prop="id">
          <Input v-model="updateParams.pid" readonly="readonly" style="width:310px" />
        </FormItem>
        <FormItem label="品牌：" prop="brand">
          <Input  v-model="updateParams.brand" placeholder="请输入品牌..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="材质：" prop="profile">
          <Input  v-model="updateParams.profile" placeholder="请输入材质..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="尺寸：" prop="size">
          <Input  v-model="updateParams.size" placeholder="请输入尺寸..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="玻璃：" prop="glass">
          <Input  v-model="updateParams.glass" placeholder="请输入玻璃..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="颜色：" prop="color">
          <Input  v-model="updateParams.color" placeholder="请输入颜色..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="生产周期：" prop="cycle">
          <Input  v-model="updateParams.cycle" placeholder="请输入生产周期..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="产地：" prop="origin">
          <Input  v-model="updateParams.origin" placeholder="请输入产地..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="状态：" prop="status" >
          <Select v-model="updateParams.status" clearable style="width:310px">
            <Option  :value="1">可用</Option>
            <Option  :value="0">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="图片列表：" prop="brand">
          <Button style="margin-right: 8px;width: 310px" :type="imageBtn.type" ghost @click="getImageMode">{{imageBtn.value}}</Button>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="modifyParamsMode = false">取消</Button>
        <Button style="margin-right: 8px" type="warning" ghost @click="handleReset('updateParamsForm')">重置</Button>
        <Button type="primary" @click="handleSubmit('updateParamsForm')">提交</Button>
      </div>
    </Drawer>

    <!-- 预览产品参数弹框 -->
    <Drawer v-model="showParamsMode" width="550" :styles="styles" :closable="false">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>具体参数</span>
      </div>
      <div class="demo-drawer-profile">
        <Row style="margin-bottom: 12px;">
          <Col span="11" offset="1">
            编号: {{selectProductInfo.pid}}
          </Col>
          <Col span="12">
            品牌: {{selectProductInfo.brand}}
          </Col>
        </Row>
        <Row style="margin-bottom: 12px;">
          <Col span="11" offset="1">
            尺寸: {{selectProductInfo.size}}
          </Col>
          <Col span="12">
            玻璃: {{selectProductInfo.glass}}
          </Col>
        </Row>
        <Row style="margin-bottom: 12px;">
          <Col span="11" offset="1">
            颜色: {{selectProductInfo.color}}
          </Col>
          <Col span="12">
            生产周期: {{selectProductInfo.cycle}}
          </Col>
        </Row>
        <Row style="margin-bottom: 12px;">
          <Col span="11" offset="1">
            产地: {{selectProductInfo.origin}}
          </Col>
        </Row>
        <Row style="flex-grow: 1">
          <Col span="3" offset="1">
            <span>图片列表: </span>
          </Col>
          <Col span="20" style="height:100%">
            <div ref="viewScrollDiv" style="height:100%">
              <Scroll :height="viewScrollHeight">
                <div v-for="(item, index) in imagesCheckList" :key="index">
                  <Card dis-hover style="width:90%;margin: 0 auto 20px;" >
                    <img :src="item.url" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
                  </Card>
                </div>
              </Scroll>
            </div>
          </Col>
        </Row>
      </div>
    </Drawer>

    <!-- 修改产品基本信息弹框 -->
    <Drawer v-model="modifyMode" width="550" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>修改产品信息</span>
      </div>
      <Form ref="modifyFrom" :model="updateData"  :rules="submitRules" :label-width="130">
        <FormItem label="编号：" prop="id">
          <Input  v-model="updateData.id" readonly="readonly" clearable style="width: 310px" />
        </FormItem>
        <FormItem label="产品名：" prop="name">
          <Input  v-model="updateData.name" placeholder="请输入产品名..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="类型：" prop="type">
          <Select v-model="updateData.type" filterable clearable placeholder="请搜索选择产品类型..." style="width:310px">
            <Option v-for="itemType in typeList" :value="itemType.id" :key="itemType.id" >{{ itemType.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="定价：" prop="price">
          <Input  v-model="updateData.price" placeholder="请输入定价..." clearable style="width: 310px" />
        </FormItem>
        <FormItem label="海报图(小)：" prop="imagesSmall">
          <upload-pic-input :default-images="updateData.imagesSmall" :default-type="imagesUploadIndex.updateProductSmall"
                            @on-change="handleUpload" width="200px" ref="upload"></upload-pic-input>
        </FormItem>
        <FormItem label="海报图(大)：" prop="imagesDetail">
          <upload-pic-input :default-images="updateData.imagesDetail" :default-type="imagesUploadIndex.updateProductDetail"
                            @on-change="handleUpload" width="200px" ref="upload"></upload-pic-input>
        </FormItem>
        <FormItem label="状态：" prop="status" >
          <Select v-model="updateData.status" clearable style="width:310px">
            <Option  :value="1">可用</Option>
            <Option  :value="0">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="产品简介：" prop="introduce">
          <Input type="textarea" :rows="4"  v-model="updateData.introduce" placeholder="请输入产品简介..." clearable style="width: 310px" />
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="modifyMode = false">取消</Button>
        <Button style="margin-right: 8px" type="warning" ghost @click="handleReset('modifyFrom')">重置</Button>
        <Button type="primary" @click="handleSubmit('modifyFrom')">提交</Button>
      </div>
    </Drawer>

    <!-- 选择图片列表的抽屉弹框 -->
    <Drawer v-model="imagesMode" width="500" :mask-closable="false" :styles="styles">
      <div slot="header" style="font-size:14px;font-weight:bold;">
        <span>点击选择图片</span>
      </div>
      <div ref="scrollDiv" style="height:100%">
        <Scroll :height="scrollHeight" v-if="!spinShow">
          <div v-for="(item, index) in imagesList" :key="index" @click="selectImage(item.id)">
            <Card dis-hover style="width:90%;margin: 0 auto 20px;" >
              <img :src="item.url" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
              <Spin size="large" fix v-if="item.spinShow">
                <Icon type="md-checkmark-circle-outline" size=28 />
                <div style="margin-top:5px;"><span style="font-style: italic;">已选</span></div>
              </Spin>
            </Card>
          </div>
        </Scroll>
        <Spin fix v-if="spinShow">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
      </div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="imagesMode = false">取消</Button>
        <Button type="primary" @click="submitImages">确定</Button>
      </div>
    </Drawer>

    <!-- csv文件导出弹框 -->
    <Modal v-model="model.csv" width="500">
      <p slot="header" style="color:#2b85e4;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>导出CSV文件</span>
      </p>
      <Form ref="formInline" :model="fileProperty"  :rules="submitRules" :label-width="130">
        <FormItem label="文件名称：" prop="fileName">
          <Poptip placement="top-start" trigger="focus">
            <Input  v-model="fileProperty.fileName" placeholder="请输入文件名..." clearable style="width: 310px" />
            <div slot="content"><span>默认文件名：</span><span style="font-style: italic; color: rgb(194, 79, 74);">产品数据表&nbsp;</span></div>
          </Poptip>
        </FormItem>
        <FormItem label="数据大小：" prop="size">
          <Poptip placement="top-start" trigger="focus">
            <Input  v-model="fileProperty.size" placeholder="请输入数据大小..." clearable style="width: 310px" />
            <div slot="content"><span>总记录数：</span><span style="font-style: italic; color: rgb(194, 79, 74);">{{total}}</span></div>
          </Poptip>
        </FormItem>
        <FormItem label="导出列：" prop="columns">
          <CheckboxGroup v-model="checkedList.csv">
            <Checkbox v-for="(item,index) in csvList" :label="index" :key="item.key">{{item.title}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" size="large" long :loading="model.csvLoading" @click="exportCSVFile">导出</Button>
      </div>
    </Modal>

    <!-- 关联标签弹框 -->
    <Modal v-model="model.tag" width="400">
      <p slot="header" style="color:#2b85e4;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>选择标签</span>
      </p>
      <div style="text-align:center">
        <CheckboxGroup v-model="checkedList.tag">
          <Checkbox v-for="item in tagList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long :loading="model.tagLoading" @click="connectionTag">关联</Button>
      </div>
    </Modal>

    <!-- 关联纱网弹框 -->
    <Modal v-model="model.gauze" width="400">
      <p slot="header" style="color:#2b85e4;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>选择关联的纱网</span>
      </p>
      <div style="text-align:center">
        <CheckboxGroup v-model="checkedList.gauze">
          <Checkbox v-for="item in gauzeList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long :loading="model.gauzeLoading" @click="connectionGauze">关联</Button>
      </div>
    </Modal>

    <!-- 关联标配件弹框 -->
    <Modal v-model="model.part" width="400">
      <p slot="header" style="color:#2b85e4;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>选择关联的配件</span>
      </p>
      <div style="text-align:center">
        <CheckboxGroup v-model="checkedList.part">
          <Checkbox v-for="item in partList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long :loading="model.partLoading" @click="connectionPart">关联</Button>
      </div>
    </Modal>
  </card>
</template>
<script>
import {
  deleteProductRequest,
  exportFile,
  findDataActionRequest,
  getProductInfoByPid,
  getTagListRequest,
  getTypeListRequest,
  importTemplateFile,
  insertParamsRequest,
  insertProductRequest,
  updateParamsRequest,
  updateProductRequest,
  connectionTagRequest,
  connectionGauzeRequest,
  connectionPartRequest,
  getCheckedTagRequest,
  getCheckedGauzeRequest,
  getCheckedPartRequest,
  getImagesListRequest
} from '../../api/product/productApi'
import { downloadFile } from '../../api/commonApi'
import uploadPicInput from '../components/upload-pic-input'
import config from '../../config/index'
import _ from 'lodash'

const { pageSize } = config
export default {
  components: {
    uploadPicInput
  },
  data () {
    return {
      typeList: [], // 类型集合
      tagList: [], // 标签集合
      gauzeList: [], // 纱网数据集合
      partList: [], // 配件数据集合
      csvList: [], // CSV数据集合
      imagesList: [], // 产品图片列表
      imagesCheckList: [], // 已选图片列表，后台数据
      checkedList: {
        tag: [],
        gauze: [],
        part: [],
        csv: [],
        image: []
      }, // 选中的数据集合
      ImageScrollHeight: '650', // 图片滚动框大小
      viewScrollHeight: '500',
      imageBtn: {
        type: 'primary',
        value: '选择图片'
      },
      fileProperty: {
        fileName: '',
        size: ''
      }, // 导出CSV文件属性
      checkedCache: {
        tag: [],
        gauze: [],
        part: []
      }, // 数据集合的缓存
      spinShow: true, // 图片弹框加载显示
      insertMode: false, // 添加产品数据弹框
      modifyMode: false, // 修改产品数据弹框
      insertParamsMode: false, // 添加产品参数数据弹框
      modifyParamsMode: false, // 修改产品参数数据弹框
      imagesMode: false, // 选择图片的弹框
      showParamsMode: false, // 产品参数预览抽屉
      loading: true, // 表格数据加载
      exportLoading: {
        excel: false,
        template: false,
        csv: false
      }, // 导出按钮的加载
      model: {
        tag: false,
        tagLoading: false,
        gauze: false,
        gauzeLoading: false,
        part: false,
        partLoading: false,
        csv: false,
        csvLoading: false
      }, // 关联相关的操作弹框
      selectProductName: '',
      selectProductInfo: {
        pid: '',
        images: '',
        profile: '',
        glass: '',
        color: '',
        cycle: '',
        size: '',
        origin: '',
        brand: ''
      },
      total: 0,
      pageIndex: 1,
      pageSize: pageSize,
      imagesUploadIndex: {
        insertProductSmall: '1',
        insertProductDetail: '2',
        updateProductSmall: '3',
        updateProductDetail: '4'
      },
      searchDataTags: [],
      searchData: {
        id: '',
        name: '',
        type: '',
        status: '',
        origin: '',
        brand: ''
      },
      insertData: {
        name: '',
        type: '',
        price: '',
        imagesSmall: '',
        imagesDetail: '',
        introduce: '',
        status: 1
      },
      updateData: {
        id: '',
        name: '',
        type: '',
        price: '',
        imagesSmall: '',
        imagesDetail: '',
        introduce: '',
        status: ''
      },
      insertParams: {
        pid: '',
        images: '',
        profile: '铝合金',
        glass: '7厘',
        color: '可定制',
        cycle: '3周',
        size: '可定制',
        origin: '河北涿州',
        status: 1,
        brand: '德国美金'
      },
      updateParams: {
        pid: '',
        images: '',
        profile: '',
        glass: '',
        color: '',
        cycle: '',
        size: '',
        origin: '',
        status: '',
        brand: ''
      },
      data: [],
      selection: [],
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          align: 'center',
          key: 'id'
        },
        {
          title: '产品名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '产品类型',
          align: 'center',
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
          title: '产品简介',
          align: 'center',
          key: 'introduce',
          tooltip: true
        },
        {
          title: '产品状态',
          align: 'center',
          key: 'status',
          render: (h, params) => {
            let re = ''
            if (params.row.status === 1) {
              re = '可用'
            } else if (params.row.status === 0) {
              re = '禁用(已删除)'
            }
            return h('div', re)
          }
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createtime'
        },
        {
          title: '修改时间',
          align: 'center',
          key: 'updatetime'
        },
        {
          title: '参数详情',
          slot: 'action',
          fixed: 'right',
          width: 200,
          align: 'center'
        }
      ],
      submitRules: {
        name: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' }
        ]
      },
      pStyle: {
        fontSize: '16px',
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '24px',
        display: 'block',
        marginBottom: '16px',
        marginLeft: '10px'
      },
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      }
    }
  },
  created () {
    this.getTypeList()
    this.getTagList()
    this.findForm()
  },
  methods: {
    /**
     * 统一提交方法，表单验证
     * @param name
     */
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this[name]({})
        } else {
          this.$Message.error('表单数据验证失败')
        }
      })
    },
    /**
     * 统一重置方法
     * @param name
     */
    handleReset (name) {
      if (name !== 'findForm') {
        this.$refs[name].resetFields()
      } else {
        // TODO 清空有问题
        this.searchDataTags = []
      }
    },
    /**
     * 设置表单选中的数据
     */
    setSelection (selection) {
      this.selection = selection
    },
    /**
     * 上传之后，图片路径赋值方法
     * @param image
     * @param type
     */
    handleUpload (image, type) {
      if (type === '1') {
        this.insertData.imagesSmall = image
      } else if (type === '2') {
        this.insertData.imagesDetail = image
      } else if (type === '3') {
        this.updateData.imagesSmall = image
      } else if (type === '4') {
        this.updateData.imagesDetail = image
      }
    },
    /**
     * 获取全部类型列表
     */
    getTypeList () {
      getTypeListRequest().then(({ data: { status, msg, data } }) => {
        if (status) {
          this.typeList = data
        } else {
          this.$Message.error(msg)
        }
      })
    },
    /**
     * 获取全部标签
     */
    getTagList () {
      getTagListRequest().then(({ data: { status, msg, data } }) => {
        if (status) {
          this.tagList = data
        } else {
          this.$Message.error(msg)
        }
      })
    },
    /**
     * 查找表单提交，初始表格数据
     */
    findForm () {
      this.selection.length = 0
      let tags = ''
      this.searchDataTags.forEach(item => {
        tags = tags + ',' + item
      })
      let params = {
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        tags: tags
      }
      findDataActionRequest({ ...params, ...this.searchData }).then(({ data: { data: trueData } }) => {
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
    /**
     * 产品表单提交
     */
    insertForm () {
      insertProductRequest(this.insertData).then(({ data: { msg, status } }) => {
        if (status) {
          this.$Message.success(msg)
          this.findForm()
          this.handleReset('insertForm')
          this.insertMode = false
        } else {
          this.$Message.error(msg)
        }
      })
    },
    /**
     * 更新产品按钮事件操作
     */
    updateAction () {
      if (this.selection.length !== 1) {
        this.$Message.info('请选择一条数据')
        return
      }
      _.keys(this.updateData).forEach(key => {
        this.updateData[key] = this.selection[0][key]
      })
      this.modifyMode = true
    },
    /**
     * 更新表单的提交处理
     */
    modifyFrom () {
      updateProductRequest(this.updateData).then(({ data: { msg, status } }) => {
        if (status) {
          this.$Message.success(msg)
          this.findForm()
          this.handleReset('modifyFrom')
          this.modifyMode = false
        } else {
          this.$Message.error(msg)
        }
      })
    },
    /**
     * 删除产品按钮事件操作，以及表单提交
     */
    deleteAction () {
      if (this.selection.length < 1) {
        this.$Message.info('请选择要删除的数据')
        return
      }
      if (!confirm('确定删除选中的数据？')) {
        return
      }
      let ids = []
      this.selection.forEach(val => ids.push(val['id']))
      deleteProductRequest(ids).then(({ data: { status, msg } }) => {
        if (status) {
          this.findForm()
          this.$Message.success(msg)
        } else {
          this.$Message.error(msg)
        }
      })
    },
    /**
     * 设置页面大小操作
     * @param pageSize
     */
    changePageSize (pageSize) {
      this.pageSize = pageSize
      this.findForm()
    },
    /**
     * 翻页操作
     * @param pageNum
     */
    changePage (pageNum) {
      this.pageIndex = pageNum
      this.findForm()
    },
    /**
     * 查看参数详情操作
     * @param index
     */
    showParams (index) {
      getProductInfoByPid(this.data[index].id).then(({ data: { data, status, msg } }) => {
        if (status) {
          if (data === null) {
            this.$Message.error('该产品未找到详细参数！')
            return
          }
          this.selectProductInfo = data.info
          this.imagesCheckList = data.sysImages
          this.showParamsMode = true
          setTimeout(() => {
            this.viewScrollHeight = this.$refs.viewScrollDiv.offsetHeight
          }, 1000)
        } else {
          this.$Message.error('数据查找失败！请联系管理员！' + msg)
        }
      })
    },
    /**
     * 添加产品参数操作
     * @param index
     */
    addParams (index) {
      this.selectProductName = this.data[index].name
      this.insertParams.pid = this.data[index].id
      this.insertParamsMode = true
      this.imageBtn.type = 'primary'
      this.imageBtn.value = '选择图片'
    },
    /**
     * 修改产品参数操作
     * @param index
     */
    modifyParams (index) {
      this.selectProductName = this.data[index].name
      this.updateParams.pid = this.data[index].id
      getProductInfoByPid(this.data[index].id).then(({ data: { data, status, msg } }) => {
        if (status) {
          if (data === null) {
            this.$Message.error('该产品未找到详细参数！')
            return
          }
          _.keys(this.updateParams).forEach(key => {
            if (key === 'status') {
              this.updateParams[key] = data.info[key] ? 1 : 0
            } else {
              this.updateParams[key] = data.info[key]
            }
          })
          this.imageBtn.type = 'warning'
          this.imageBtn.value = '选择需要修改的图片'
        } else {
          this.$Message.error('数据查找失败！请联系管理员！' + msg)
        }
      })
      this.modifyParamsMode = true
    },
    /**
     * 提交添加产品参数请求
     */
    insertParamsForm () {
      if (this.imageBtn.type === 'primary' || this.imageBtn.type === 'error') {
        this.imageBtn.type = 'error'
        return
      }
      insertParamsRequest(this.insertParams).then(({ data: { msg, status } }) => {
        if (status) {
          this.$Message.success(msg)
          this.findForm()
          this.handleReset('insertParamsForm')
          this.insertParamsMode = false
          this.imageBtn.type = 'primary'
          this.imageBtn.value = '选择图片'
          this.checkedList.image = []
        } else {
          this.$Message.error(msg)
        }
      })
    },
    /**
     * 提交修改产品参数请求
     */
    updateParamsForm () {
      updateParamsRequest(this.updateParams).then(({ data: { msg, status } }) => {
        if (status) {
          this.$Message.success(msg)
          this.findForm()
          this.handleReset('updateParamsForm')
          this.modifyParamsMode = false
          this.imageBtn.type = 'primary'
          this.imageBtn.value = '选择图片'
          this.checkedList.image = []
        } else {
          this.$Message.error(msg)
        }
      })
    },
    /**
     * 导出Excel表格
     */
    exportAction () {
      this.exportLoading.excel = true
      exportFile().then(({ data: { msg, status } }) => {
        if (status) {
          downloadFile(msg)
        } else {
          console.log(msg)
        }
        this.exportLoading.excel = false
      })
    },
    /**
     * 下载Excel数据模板
     */
    importTemplateAction () {
      this.exportLoading.template = true
      importTemplateFile().then(({ data: { msg, status } }) => {
        if (status) {
          downloadFile(msg)
        } else {
          console.log(msg)
        }
        this.exportLoading.template = false
      })
    },
    /**
     * 导入数据成功
     **/
    importSuccess () {
      this.$Message.success('数据导入成功')
      this.findForm()
    },
    /**
     * 导入数据失败
     **/
    importError () {
      this.$Message.error('数据导入失败！请检查格式')
    },
    getCSVModel () {
      this.model.csv = true
      this.csvList = this.tableColumns.filter((col, index) => index > 0).filter((col, index) => index < 7)
    },
    /**
     * 导出CSV文件
     **/
    exportCSVFile () {
      this.model.csvLoading = true
      if (this.checkedList.csv.length > 0) {
        let columns = []
        this.checkedList.csv.forEach(item => {
          columns.push(this.tableColumns[item + 1])
        })
        let fileName = this.fileProperty.fileName === '' ? '产品数据表' : this.fileProperty.fileName

        let params = {
          pageNum: 1,
          pageSize: this.fileProperty.size
        }
        findDataActionRequest({ ...params }).then(({ data: { data: trueData } }) => {
          let { records } = trueData
          records.forEach((item, index) => {
            records[index].status = item.status ? 1 : 0
          })
          this.$refs.table.exportCsv({
            filename: fileName,
            columns: columns,
            data: records
          })
          this.model.csvLoading = false
          this.model.csv = false
        })
      } else {
        this.$Message.success('请选择需要导出的数据列！！')
      }
    },
    /**
     * 弹出标签关联框
     **/
    getTagModel () {
      if (this.selection.length !== 1) {
        this.$Message.info('请选择一条数据')
        return
      }
      getCheckedTagRequest(this.selection[0].id).then(({ data: { data, status, msg } }) => {
        if (status) {
          this.checkedList.tag = []
          this.checkedCache.tag = []
          if (data != null) {
            data.forEach(item => this.checkedList.tag.push(item.id))
            this.checkedCache.tag = this.checkedList.tag
          }
        } else {
          this.$Message.error('系统出问题了！' + msg)
        }
        this.model.tag = true
      })
    },
    /**
     * 进行关联
     **/
    connectionTag () {
      this.model.tagLoading = true
      let result = this.tool(this.checkedCache.tag, this.checkedList.tag)
      if (result.add.length === 0 && result.delete.length === 0) {
        return
      }
      let params = {
        productId: this.selection[0].id,
        addList: result.add,
        deleteList: result.delete
      }
      connectionTagRequest(params).then(({ data: { status, msg } }) => {
        if (status) {
          this.$Message.success(msg)
        } else {
          this.$Message.error(msg)
        }
        this.model.tagLoading = false
        this.model.tag = false
      })
    },

    /**
     * 弹出纱网关联框
     **/
    getGauzeModel () {
      if (this.selection.length !== 1) {
        this.$Message.info('请选择一条数据')
        return
      }
      getCheckedGauzeRequest(this.selection[0].id).then(({ data: { data, status, msg } }) => {
        if (status) {
          this.checkedList.gauze = []
          this.checkedCache.gauze = []
          this.gauzeList = data.gauzes
          if (data.checked != null) {
            data.checked.forEach(item => this.checkedList.gauze.push(item.id))
            this.checkedCache.gauze = this.checkedList.gauze
          }
        } else {
          this.$Message.error('系统出问题了！' + msg)
        }
        this.model.gauze = true
      })
    },
    /**
     * 进行关联
     **/
    connectionGauze () {
      this.model.gauzeLoading = true
      let result = this.tool(this.checkedCache.gauze, this.checkedList.gauze)
      if (result.add.length === 0 && result.delete.length === 0) {
        return
      }
      let params = {
        productId: this.selection[0].id,
        addList: result.add,
        deleteList: result.delete
      }
      connectionGauzeRequest(params).then(({ data: { status, msg } }) => {
        if (status) {
          this.$Message.success(msg)
        } else {
          this.$Message.error(msg)
        }
        this.model.gauzeLoading = false
        this.model.gauze = false
      })
    },

    /**
     * 弹出配件关联框
     **/
    getPartModel () {
      if (this.selection.length !== 1) {
        this.$Message.info('请选择一条数据')
        return
      }
      getCheckedPartRequest(this.selection[0].id).then(({ data: { data, status, msg } }) => {
        if (status) {
          this.checkedList.part = []
          this.checkedCache.part = []
          this.partList = data.parts
          if (data.checked != null) {
            data.checked.forEach(item => this.checkedList.part.push(item.id))
            this.checkedCache.part = this.checkedList.part
          }
        } else {
          this.$Message.error('系统出问题了！' + msg)
        }
        this.model.part = true
      })
    },
    /**
     * 进行关联
     **/
    connectionPart () {
      this.model.partLoading = true
      let result = this.tool(this.checkedCache.part, this.checkedList.part)
      if (result.add.length === 0 && result.delete.length === 0) {
        return
      }
      let params = {
        productId: this.selection[0].id,
        addList: result.add,
        deleteList: result.delete
      }
      connectionPartRequest(params).then(({ data: { status, msg } }) => {
        if (status) {
          this.$Message.success(msg)
        } else {
          this.$Message.error(msg)
        }
        this.model.partLoading = false
        this.model.part = false
      })
    },
    /**
     * 根据新数组和旧数组找出删除和添加的集合
     * @param oldList
     * @param newList
     * @returns {{add: Array, delete: Array}}
     */
    tool (oldList, newList) {
      let result = {
        add: [],
        delete: []
      }
      oldList.forEach(item => {
        if (newList.indexOf(item) === -1) {
          result.delete.push(item)
        }
      })
      newList.forEach(item => {
        if (oldList.indexOf(item) === -1) {
          result.add.push(item)
        }
      })
      return result
    },
    /**
     * 打开图片抽屉
     * */
    getImageMode () {
      this.imagesMode = true
      setTimeout(() => {
        this.spinShow = false
        this.scrollHeight = this.$refs.scrollDiv.offsetHeight
      }, 1000)
      getImagesListRequest().then(({ data: { data, status, msg } }) => {
        if (status) {
          if (this.modifyParamsMode) {
            let res = this.updateParams.images.split(',')
            res.forEach(item => {
              this.checkedList.image.push(item * 1)
            })
          }
          if (this.checkedList.image.length > 0) {
            data.forEach(item => {
              item.spinShow = this.checkedList.image.indexOf(item.id) >= 0
            })
          } else {
            data.forEach(item => {
              item.spinShow = false
            })
          }
          this.imagesList = data
        } else {
          this.$Message.error(msg)
        }
      })
    },
    /**
     * 提交Image图片信息
     */
    submitImages () {
      let result = ''
      this.checkedList.image.forEach((item, index) => {
        if (index === this.checkedList.image.length - 1) {
          result += item
        } else {
          result += item + ','
        }
      })
      this.insertParams.images = result
      this.updateParams.images = result
      this.imagesMode = false
      this.imageBtn.type = 'success'
      this.imageBtn.value = '已成功选择图片'
    },
    /**
     * 选择图片的操作
     */
    selectImage (id) {
      this.imagesList.forEach(item => {
        if (item.id === id) {
          item.spinShow = !item.spinShow
        }
      })
      let index = this.checkedList.image.indexOf(id)
      if (index >= 0) {
        this.checkedList.image.splice(index, 1)
      } else {
        this.checkedList.image.push(id)
      }
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
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .demo-drawer-profile{
    font-size: 14px;
    display:flex;
    flex-direction: column;
    height:100%;
  }
</style>
