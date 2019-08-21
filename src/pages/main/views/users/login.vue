<template>
  <div class="login-field">
    <div class="login-field__title">
      <h1>Todo App</h1>
    </div>
    <div class="login-field__fields">
      <van-cell-group>
        <van-field
          v-model="form.username"
          clearable
          label="用户名"
          placeholder="输入用户名"
          @input="handleInputChange"
          :error-message="errorMessages.username"
        />
        <van-field
          v-model="form.password"
          type="password"
          clearable
          label="密码"
          placeholder="输入密码"
          @input="handleInputChange"
          :error-message="errorMessages.password"
        />
      </van-cell-group>
    </div>
    <div class="buttons">
      <van-button type="primary" size="large" @click="handleLogin">登 录</van-button>
    </div>
    <div class="login-field__footer">
      <span @click="registerVisible = true">注册新用户</span>
    </div>

    <!-- 注册新用户 -->
    <register v-model="registerVisible"></register>
  </div>
</template>

<script>
import register from './register'
import JSEncrypt from 'jsencrypt'
import { RSA_PUBLIC_KEY, userInfoName } from 'config'
import { setStorage } from 'utils'
import ValidateSchema from 'async-validator'
import mixin from 'mixins/main'
import API from 'api/main'

const descriptor = {
  username: { required: true, message: '请输入用户名' },
  password: { required: true, message: '请输入密码' }
}

export default {
  name: 'Login',
  components: {
    register
  },
  mixins: [mixin],
  data () {
    let validator = new ValidateSchema(descriptor)

    return {
      form: {
        username: '',
        password: ''
      },
      registerVisible: false,
      errorMessages: {
        username: '',
        password: ''
      },
      validator
    }
  },
  methods: {
    async handleLogin () {
      this.handleValidate()
        .then(async () => {
          try {
            let encrypt = new JSEncrypt()
            encrypt.setPublicKey(RSA_PUBLIC_KEY)
            let password = encrypt.encrypt(this.form.password)

            this.$toast({
              type: 'loading',
              duration: 0,
              forbidClick: true
            })
            let results = await API.usersAPI.login({
              data: {
                username: this.form.username,
                password
              }
            })
            let { username } = results
            let userInfo = {
              username
            }
            setStorage(userInfoName, JSON.stringify(userInfo))
            setTimeout(() => {
              this.$router.push({ path: '/' })
            }, 100)
            this.$toast.clear()
          } catch (e) {
            console.error(e)
          }
        })
        .catch(e => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.login-field{
  @extend %single-page-common;
  padding-top: 0;
  &__title{
    padding: 30px 0 25px 0;
    font-size: 30px;
    text-align: center;
  }
  &__footer{
    margin: 15px 0;
    text-align: center;
    > span{
      color: $linkColor;
    }
  }
}
</style>
