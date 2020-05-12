<template>
  <div>
    <Poptip trigger="hover" title="图片预览" placement="bottom-start" width="350">
      <Input
        v-model="picUrl"
        @on-change="handleChange"
        placeholder="可直接填入网络图片链接"
        :style="{width: width}"
        clearable
      />
      <div slot="content">
        <img :src="picUrl" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
        <a @click="viewImage=true" style="margin-top:5px;text-align:right;display:block">查看大图</a>
      </div>
    </Poptip>

    <Modal title="图片预览" v-model="viewImage" :styles="{top: '30px'}" draggable>
      <img :src="picUrl" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
      <div slot="footer">
        <Button @click="viewImage=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'picView',
  props: {
    defaultType: String,
    defaultImages: String,
    width: {
      type: String,
      default: '200px'
    }
  },
  data () {
    return {
      picUrl: '',
      loading: false,
      viewImage: false
    }
  },
  created () {
    this.picUrl = this.defaultImages
  },
  watch: {
    defaultImages: {
      handler (newName, oldName) {
        this.picUrl = newName
      }
    }
  },
  methods: {
    handleChange (v) {
      this.$emit('on-change', this.picUrl, this.defaultType)
    },
    setPicUrl (v) {
      this.picUrl = v
      this.$emit('on-change', this.picUrl, this.defaultType)
    },
    modifySrc (src) {
      this.picUrl = src
    }
  }
}
</script>

<style lang="less">
.upload {
  display: inline-block;
  margin-left: 10px;
}
</style>
