<template>
  <div class="register">
    <van-popup
      class="register-popup"
      v-model="visible"
      position="bottom">
      <div class="header">
        <i class="iconfont icon-i-close close-button" @click="handleCloseRegister"></i>
        <span>注册新用户</span>
      </div>
      <div class="fields">
        <van-field
          v-model="form.username"
          clearable
          label="用户名"
          placeholder="输入用户名"
          @input="handleInputChange"
          :error-message="errorMessages.username"
        />
        <van-field
          type="password"
          v-model="form.password"
          clearable
          label="密码"
          placeholder="设置密码(6-12位)"
          @input="handleInputChange"
          :error-message="errorMessages.password"
        />
        <van-field
          type="password"
          v-model="form.confirmPassword"
          clearable
          label="确认密码"
          placeholder="再次输入密码"
          @input="handleInputChange"
          :error-message="errorMessages.confirmPassword"
        />
      </div>
      <div class="buttons">
        <van-button type="primary" size="large" @click="handleRegister">注 册</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import API from 'api/main'
import { RSA_PUBLIC_KEY } from 'config'
import JSEncrypt from 'jsencrypt'
import ValidateSchema from 'async-validator'
import mixin from 'mixins/main'

const descriptor = {
  username: { required: true, message: '请输入用户名' },
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, max: 12, message: '密码长度需在6-12之间' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码' },
    {
      validator (rule, value, callback, source, options) {
        let errors = []
        if (value !== source['password']) {
          errors.push(new Error('密码长度需在6-12之间'))
        }
        callback(errors)
      },
      message: '两次密码不匹配'
    }
  ]
}

export default {
  name: 'Register',
  props: {
    value: Boolean
  },
  mixins: [mixin],
  data () {
    let validator = new ValidateSchema(descriptor)

    return {
      form: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      errorMessages: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      visible: false,
      validator
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleRegister () {
      this.handleValidate()
        .then(async () => {
          try {
          // RSA公钥加密密码
            let encrypt = new JSEncrypt()
            encrypt.setPublicKey(RSA_PUBLIC_KEY)
            let password = encrypt.encrypt(this.form.password)

            this.$toast({
              type: 'loading',
              duration: 0,
              forbidClick: true
            })
            await API.usersAPI.register({
              data: {
                username: this.form.username,
                password
              }
            })
            this.$toast({
              type: 'success',
              message: '注册成功'
            })
            setTimeout(() => {
              this.handleCloseRegister()
            }, 300)
          } catch (e) {
            console.error(e)
          }
        })
        .catch(e => {})
    },
    handleCloseRegister () {
      this.visible = false
      this.resetForm()
      this.resetErrorMessages()
    }
  }
}
</script>
