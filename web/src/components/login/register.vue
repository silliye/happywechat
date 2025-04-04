<template>
    <div class="all">
        <phonehead></phonehead>
        <chathead></chathead>
     
        <header class="allheader">
        <div class="title">首次登录需要注册
            <img class="wechatImg" src="../../assets/img/wx.png" >
            <span class="lower-size"></span>
        </div>
        <div class="b">
          <div class="tab-item">输入指定信息</div>
        </div>
      </header>
  
      <div class="register">
        <div class="input-group">
          <input v-model="phone" type="text" placeholder="手机号">
        </div>
        <div class="input-group">
            <input v-model="wechat_id" type="text" placeholder="微信号">
          </div>
        <div class="input-group">
        <input v-model="username" type="text" placeholder="用户名">
        </div>
        <div class="input-group">
          <input v-model="verificationCode" type="text" placeholder="请输入6位数验证码">
          <button v-if="!ifSend" class="input-group-button" @click="getVerificationCode">获取验证码</button>
          <button v-else class="input-group-button"> 重新获取({{counted_}}s)</button>
        </div>

        <div>
              <span class="btn-text" @click="signup">立即注册</span>
        </div>
      </div>
      <hr>
      <div>
        <span class="divider" @click="toLogin">立即登录</span>
      </div>
    </div>
</template>

<!-- 这里我们留一个任务：
       我们这里的  PhoneWarning, WechatIDWaring, UsernaeWaring, verificationCode
    用来标记 用户名/验证码 的错误提示信息
    需要注入到html下，可以用个span，若这些为true，就显示出来，用v-if
    这里，不作为主要功能，我们就不实现了
-->


<script>
    import {nextTick, ref, computed} from 'vue'
    import {useStore} from 'vuex'
    import {useRouter} from 'vue-router'

    import chathead from '../chathead.vue';
    import phonehead from '../phonehead.vue';

export default {
    name : "Register",
    components: { chathead, phonehead},

    setup() {
        const phone = ref("")
        const wechat_id = ref("")
        const username = ref("")
        const verificationCode = ref("")
        const ifSend = ref(false)
        let Registerstate

        const counted_ = ref(60)

        const store = useStore();

        const router = useRouter();


        const PhoneWarning = ref(false)
        const WechatIDWaring = ref(false)
        const UsernaeWaring = ref(false)
        const verificationWaring = ref(false)

        function getVerificationCode() {
            console.log("生成了验证码")

            /**
            // 生成验证码 : 随机六位数
            // 在redis中存储一个120s过期的key, 即验证码
            // 将验证码发送到指定手机的短信中
               这三件事情可以在后端完成:
               因为前端，我们只做页面的渲染和响应后端的数据
               这些联系数据库的, 我们就在后端做
            **/
            if(comformPhoneFormat(phone)) {
                store.dispatch("GenerateVcodeAndStoreToRedis", phone.value)
            } else {
                alert("输入正确的手机号")
            }


            let intervalId
            
            // ifSend = false 并做一个60s的倒计时动画
            ifSend.value = true
            intervalId = setInterval(() => {
                if (counted_.value >= 0) {
                    counted_.value -= 1;
                } else {
                    clearInterval(intervalId);
                    counted_.value = 60;
                    ifSend.value = false
                }
            }, 1000);
            
            // 默认 60s到了之后, ifSend = true
            setTimeout(()=>{
                ifSend.value = false
                counted_.value = 60
            }, 60000)

        }

        function signup() {
            // 携带数据 请求后端 写入数据库
            store.dispatch("signup", [phone.value, wechat_id.value, username.value ,verificationCode.value])

            // 读取注册状态;
            Registerstate = computed(()=>store.state.ResgisterState)

            // 路由  注册成功 则返回重新登录  反之不动
            
            nextTick(() => {
                if(Registerstate.value === true) {
                    alert("注册成功")
                    router.push({name:"login"})
                } else  {
                    alert("注册失败")
                    // 注册失败需要将code重置;
                    verificationCode.value = ''
                    username.value = ''
                    wechat_id.value = ''
                }
            })

        }

        function comformPhoneFormat(phone) {
            phone = phone.value
            console.log(typeof phone)
            return phone.length == 11 && phone[0] == '1'

        }

        function toLogin() {
          router.push({name:'login'})
        }

        
        return {
            phone, wechat_id, username, verificationCode, ifSend, counted_,  
            PhoneWarning, WechatIDWaring, UsernaeWaring, verificationWaring,
            Registerstate, getVerificationCode, signup, toLogin
        }
    }
}
</script>

<style scoped>
  /* 基础样式 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  
  .all {
    height: 693px;
    max-height: 700px;
    font-family: Arial, sans-serif;
    background-color: #fff;
    color: #333;
  }

  .title {
    font-size: 20px;
    height: 30px;
  }
  
  .wechatImg {
    height : 30px; 
    width : 30px;
    margin-bottom: auto;
    max-height: 100px; 
    max-width: 200px
  }

  .allheader {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #ddd;
  }
  
  .lower-size {
    font-size: 14px;
    color: #666;
  }
  
  .b {
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }
  
  .tab-item {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
  }
  
  .tab-item.active {
    font-weight: bold;
    color: #5677fc;
    border-bottom: 2px solid #5677fc;
  }
  
  .register {
    padding-left: 10px;
    margin: 20px auto;
  }
  
  .register .input-group input {
    flex: 1;
    margin-right: 10px;
    max-width: 250px; /* 保证最小宽度 */
    width: 250px;
    padding: 5px;
    margin-bottom: 20px;
    font-size: 16px;
    border: none; /* 隐藏所有边框 */
    border-bottom: 1px solid #bcbcbc; /* 只显示底部边框 */
  }
  
  .register .input-group input:focus {
    border-bottom: 1px solid #4566dc; /* 输入框获得焦点时，底部边框颜色变化 */
  }
  
  /* 设置验证码和按钮在同一行 */
  .input-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  

  
  .input-group-button {
    background-color: #fff;
    color: rgb(148, 118, 238);
    border: none;
    padding: 10px 10px;
    margin-right: 25px;
    margin-bottom: 15px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    
  }
  
  .input-group button:hover {
    background-color: #4566dc;
  }
  
  .btn-text {
    background-color: #5677fc;
    padding: 10px 130px;
    color: white;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 30px;
  }
  
  .divider {
    display: block;
    text-align: center;
    margin: 20px 0;
    color: #999;
    font-size: 14px;
  }
  
  /* 适配不同屏幕 */
  @media (min-width: 768px) {
    .register {
      width: 400px;
    }
  }
  </style>
  