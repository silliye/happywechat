import { createStore } from 'vuex';
import axios from 'axios';
import { nextTick } from 'vue';

/**
 * 2024-9-26  对这个文件做注解
 */

export default createStore({
  state() {
    return {

      // 当前的用户对象
      CurrentUserWid : "",

      // 是否有用户登录: 
      ifLogin : false,
      // 是否需要注册:对于那些phone第一次登录的时候, 需要注册
      ifNeedRegister : false,
      
      // 返回的注册状态, 注册成功则可以跳至login.vue
      ResgisterState : false,

      // test, 无实际意义
      count: 0,

      // 当前用户和某一个好友的历史聊天信息
      chatInfo: {
          wechat_id:"",
          remarkName:"",
          chatContent:[]
        },
      
      // 当前用户和某一个好友的新的聊天记录
      // 以上两部分构成全部的聊天记录
      temporaryChatInfo : {
        chatContent:[]
      },

      currentId : 0,


      // 自己的头像路径
      selfProfilePath:"",

      // 对方的头像路径
      oppositeProfilePath:"",


      // Main.vue中需要的数据: 好友信息列表, 用于页面展示
      friendUserList:{}

    };
  },
  mutations: {
    increment(state) {
        state.count++;
      },

      
    addMessageToChatList(state, chatItem) {
        state.temporaryChatInfo.chatContent.push(chatItem)
      },

    GetChatMessages(state, chatInfo){
        // chatinfo是我们后端的Chat对象
        state.chatInfo = { ...chatInfo }; // 直接赋值即可
        nextTick(()=> {
          if(state.chatInfo.chatContent.length > 0)
            state.currentId = state.chatInfo.chatContent[state.chatInfo.chatContent.length - 1].id;
        })
        
      },
    
      // 头像相关赋值
      GetBothProfilePaths(state, profiles){
        state.selfProfilePath = profiles[0]
        state.oppositeProfilePath = profiles[1]
      },

      // 赋值当前用户wechat_id
      SET_CURRENT_USER(state, value) {
        state.CurrentUserWid = value
        state.ifLogin  = true
      },

      // 登录状态的设置
      LoginData(state,value) {
        state.ifNeedRegister = value.needRegister
        state.ifLogin = true
      },

      // 注册状态的设置 注册成功/失败
      SETREGISTERINFO(state, value) {
        state.ResgisterState = true
      },

      // 将好友列表赋值
      GetFriendUserList(state, value) {
        state.friendUserList = value
      },
      SET_USER_LOG_OUT(state) {
        state.CurrentUserWid = ""
        state.ifLogin = false
      },

      GetCurrentId(state) {
        if(state.chatInfo.chatContent.length > 0)
          return state.chatInfo.chatContent[state.chatInfo.chatContent.length - 1].id
      }

     
  },

  actions: {

    // 获取聊天信息
    getChatMessages({ commit }, wechat_id) {

      axios.get(`https://localhost:443/wechat/api/getchat?wechat_id=${wechat_id[0]}&receive_wechat_id=${wechat_id[1]}`).then(
        response => {
          commit('GetChatMessages', response.data);
        },
        error => {
            console.log(error)
        }
      )
    },

    // 获取头像(actually mysql & mongondb, here using mongondb)
    getBothProfilePaths({commit}, wechat_id) {

      axios.get(`https://localhost:443/wechat/api/getProfile?id1=${wechat_id[0]}&id2=${wechat_id[1]}`).then(
        response => {
          commit('GetBothProfilePaths', response.data);
        },
        error => {
            console.log(error)
        }
      )
    },

    // 生成验证码, 并发送给指定的Phone短信
    GenerateVcodeAndStoreToRedis({commit}, phone) {
      axios.post('https://localhost:443/wechat/api/generateVcode', {
        phoneNumber: phone
      }).then(
        response => {          
          return response.data
        }
      ).catch(
        error => {
          console.log(error)
        }
      )
    },

    // 登录验证(select from mysql)
    login({ commit }, info) {
      axios.post('https://localhost:443/wechat/api/login', {
        phone: info[0],
        vcode: info[1]
      })
      .then(response => {
        // 处理响应
        if (response.data.success) {
          // 提交 mutation 设置用户信息
          commit('SET_CURRENT_USER', response.data.user_w_id);
          commit("LoginData", response.data);

          // JWT token的设置:
          localStorage.setItem('userToken', response.data.token);

        } else {
          // 处理错误
          console.error('Login failed');
        }
      })
      .catch(error => {
        // 处理错误
        console.error('Error during login:', error);
      })
    },



    // 注册验证(insert into mysql & mongondb)
    signup({commit}, info) {
      axios.post('https://localhost:443/wechat/api/signup', {
        phone: info[0],
        wid: info[1],
        username: info[2],
        vcode: info[3]
      })
      .then(response => {
        // 处理响应
        if (response.data.success) {
          // 提交 mutation 设置用户信息
          commit("SETREGISTERINFO", response.data.success)
        } else {
          // 处理错误
        }
      })
      .catch(error => {
        // 处理错误
        console.error('Error during signup:', error);
      })
    },

    // 得到好友信息列表(mysql)
    getFriendUserList({commit}, wechat_id) {
      axios.get(`https://localhost:443/wechat/api/getFriUList?id=${wechat_id}`).then(
        response => {
          console.log(response.data)
          commit('GetFriendUserList', response.data);
        },
        error => {
            console.log(error)
        }
      )
    },

    // 将最后一条数据传输到
    writeThelastContent({commit}, ChatContent) {

      let time_ = ChatContent.time
      let content_ = ChatContent.content
      let send_ = ChatContent.send
      let receive_ = ChatContent.receive

      console.log(time_, content_, send_, receive_)
      
      axios.post(`https://localhost:443/wechat/api/setLastContentToDB`,
        {time:time_, content:content_,send:send_, receive:receive_}
      ).then(
        response => {
          console.log(response.data)
        },
        error => {
            console.log(error)
        }
      )
      
    },

    // 弃用
    getChatInfo({commit}){
      commit('getChatInfo')
    }
  },
  getters: {
    doubleCount(state) {
        return state.count * 2;
      },

    // // currentId : 用作于客户端维护的id, 我们从历史记录中获取:
    // currentId(state) {
    //   if(state.chatInfo.chatContent.length > 0)
    //     return state.chatInfo.chatContent[state.chatInfo.chatContent.length - 1].id
    //   else 
    //     return 0
    // }
   
  }
});