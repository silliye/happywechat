<template>
    <div class="all">
        <phonehead></phonehead>
        <chathead></chathead>
     
        <header class="allheader">
        <div class="title">登录微信
            <img class="wechatImg" src="../../assets/img/wx.png" >
            <span class="lower-size"></span>
        </div>
        <div class="b">
          <div class="tab-item" @click="setActiveTab('scan')">扫码登录</div>
          <div class="tab-item" :class="{ active: activeTab === 'code' }" @click="setActiveTab('code')">验证码登录</div>
          <div class="tab-item" @click="setActiveTab('password')">密码登录</div>
        </div>
      </header>
  
      <div class="signup">
        <div class="input-group">
          <input v-model="phone" type="text" placeholder="手机号(第一次登录即注册)">
        </div>
        <div class="input-group">
          <input v-model="verificationCode" type="tel" placeholder="请输入6位数验证码">
          <button v-if="!ifSend" class="input-group-button" @click="getVerificationCode">获取验证码</button>
          <button v-else class="input-group-button"> 重新获取({{counted_}}s)</button>
        </div>

        <div>
              <span class="btn-text" @click="login">立即登录</span>
        </div>
      </div>
      <hr>
      <div>
        <span class="divider" @click="Toregister">注册</span>
      </div>
    </div>
  </template>
  
  <script>
        import phonehead from '../phonehead.vue';
        import chathead from '../chathead.vue';
        import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue'
        import {useStore} from 'vuex'
        import {useRouter} from 'vue-router'

        import axios from 'axios'

  export default {
    name:'Login',
    components: { chathead, phonehead},
    
    setup() {
        const activeTab = ref('code')
        const phone = ref('')
        const verificationCode = ref('')

        const ifSend = ref(false)
        const counted_ = ref(60)
        
        const store = useStore();

        const router = useRouter();
        
        let ifNeedRegister = ref(false)

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

            store.dispatch("GenerateVcodeAndStoreToRedis", phone.value)
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

        function login() {
            // 请求登录;
            // 携带phone, Vcode 登录
          store.dispatch("login", [phone.value, verificationCode.value])
          ifNeedRegister = computed(()=>store.state.ifNeedRegister) 
          
          nextTick( ()=> {
            if (ifNeedRegister.value === true) {
              router.push({name:'register'})
            } else {
              router.push({name:"Main"})
            }
          })
        }

        function Toregister() {
          router.push({name:"register"})
        }
        

        /**
         * JWT的验证:
         *  
        */
        onMounted(()=>{
          const token = localStorage.getItem('userToken');
          console.log("现在的token", token)
          if (token) {
            // 如果有 token，尝试验证 token 的有效性
            axios.get('https://localhost:443/wechat/api/verify-token', {
              headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
              if(response.data.status) {
                // Token 有效，跳转到主界面
                console.log("跳转")
                
                // 为当前环境中赋值用户名, 否则不知道当前用户是谁？
                // 同时跳过不了验证;
                store.commit("SET_CURRENT_USER", response.data.token_user)
                console.log(store.state.CurrentUserWid)
                router.push({ name: 'Main' })
              }
            }).catch(() => {
              // Token 无效或过期，留在登录页
              console.log("catch")
            })
          } else {
            // 没有 token，留在登录页
            console.log("nothing")
          }
        })

        return {phone, verificationCode, ifSend, counted_, activeTab,
           getVerificationCode, login, Toregister}
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
  
  .signup {
    padding-left: 10px;
    margin: 20px auto;
  }
  
  .signup .input-group input {
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
  
  .signup .input-group input:focus {
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
    .signup {
      width: 400px;
    }
  }
  </style>
  