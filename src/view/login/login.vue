<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">请输入用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions('user', [
      'handleLogin',
      'recordLoginLog'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        let { status: success, msg } = res
        if (success) {
          const message = this.$Message.loading({
            content: msg,
            duration: 0
          })
          setTimeout(() => {
            this.recordLoginLog()
            this.$router.push({
              name: this.$config.homeName
            })
            message()
          }, 500)
        } else {
          this.$Message.error(msg)
        }
      })
    }
  }
}
</script>

<style>

</style>
