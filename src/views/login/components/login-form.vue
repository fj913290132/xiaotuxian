<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formCom" class="form" :validation-schema="myschema" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field  :value="form.account" :class="{error:errors.account}" v-model="form.account" name="account" type="text" placeholder="请输入用户" />
          </div>
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :value="form.password" :class="{error:errors.password}" v-model="form.password" name="password" type="password" placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :value="form.mobile" :class="{error:errors.mobile}" v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :value="form.code" :class="{error:errors.code}"  v-model="form.code" name="code" type="password" placeholder="请输入验证码" />
            <span @click="send" class="code">{{time<=0?'发送验证码':`请${time}秒后发送`}}</span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field name="isAgree" as="XtxCheckbox" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <img
        src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
        alt=""
      />
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import message from '@/components/library/Message'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
export default {
  name: 'LoginForm',
  components: {
    Form, Field
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 是否短信登录
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: true,
      account: 'zhousg',
      password: '123456',
      mobile: '13666666666',
      code: '123456'
    })

    // vee-validate 校验基本步骤
    // 1.导入Form  Field 组件将form和input进行替换，需要加上name用来指定将来校验规则函数的
    // 2.Field需要进行数据绑定,字段名称最好和后台接口保持一致
    // 3.定义Field的name属性指定的校验规则函数：Form的validation-schema接收定义好的校验规则
    const myschema = {
      // 校验函数规则：返回true就是校验成功，返回一个字符串就是校验失败，字符串是错误提示
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 切换表单元素，还原数据和清除校验效果
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 还原数据
      form.isAgree = true
      form.account = 'zhousg'
      form.password = '123456'
      form.mobile = '13666666666'
      form.code = '123456'
      // 补充校验效果清除，Form组件提供resetForm()
      formCom.value.resetForm()
    })
    // 登陆按钮点击事件
    const login = async () => {
      // 对表单进行兜底校验，返回一个promise
      const valid = await formCom.value.validate()
      if (valid) {
        let res = null
        try {
          if (isMsgLogin.value) {
          //! 手机号登录
          // 1.发送验证码
          // 2.手机号登录
            const obj = {
              mobile: form.mobile,
              code: form.code
            }
            res = await userMobileLogin(obj)
          } else {
          //! 账号登录
            const obj = {
              account: form.account,
              password: form.password
            }
            res = await userAccountLogin(obj)
          // try {
          //   res = await userAccountLogin(obj)
          //   // 1. 存储信息
          //   const { id, account, nickname, avatar, token, mobile } = res.result
          //   store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
          //   // 进行跳转
          //   router.replace(route.query.redirectUrl || '/')
          //   message({ type: 'success', text: res.msg })
          //   // console.log(res)
          // } catch (error) {
          //   message({ type: 'error', text: error.response.data.message })
          // }
          }
          // 1. 存储信息
          const { id, account, nickname, avatar, token, mobile } = res.result
          store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
          store.dispatch('cart/mergeCart').then(() => {
            // 进行跳转
            router.push(route.query.redirectUrl || '/')
            message({ type: 'success', text: res.msg })
          })
          // console.log(res)
        } catch (error) {
          message({ type: 'error', text: error.response.data.message })
        }
      }
    }
    // pause 暂停 resume开启
    // useIntervalFn(回调函数，执行间隔，是否立即开启)
    // isActive: 当前计时器是否处于激活状态
    const time = ref(0)
    const { pause, resume, isActive } = useIntervalFn(() => {
      time.value-- // 每隔一秒time的值--，小于等于0的时候关闭定时器
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    // 组件销毁时清除定时器
    onUnmounted(() => {
      pause()
    })
    // 发送短信
    const send = async () => {
      const valid = myschema.mobile(form.mobile)
      // console.log(valid)
      if (isActive.value === true) return // 当前正在做倒计时器
      if (valid === true) {
        // 通过
        time.value = 60 // 将time的值设置为60开启定时器
        resume()
        try {
          const res = await userMobileLoginMsg(form.mobile)
          message({ type: 'success', text: '发送成功' })
          console.log(res)
        } catch (error) {
          message({ type: 'error', text: error.response.data.message })
        }
      } else {
        // 不通过
        formCom.value.setFieldError('mobile', valid)
      }
    }
    return { isMsgLogin, form, myschema, formCom, login, send, time }
  }
}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
