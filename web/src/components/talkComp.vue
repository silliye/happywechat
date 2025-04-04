<template>
    <div class="fake" style="float: left; width:400px">
      <!-- 手机自带头部 -->
      <PhoneHead></PhoneHead>
      
      <!-- 聊天头部组件 -->
      <ChatHead :remarkName="ChatInfo.remarkName" @LogOutTheCurrentChat="LogOutTheCurrentChat"></ChatHead>

      <!-- 聊天主体 -->
      <div class="chat" ref="chatBody">
        <!-- 对话内容 -->
        <!-- 头像的图片的初始分辨率应该统一 -->
      <UserChatItem v-for="UserChatItem in ChatInfo.chatContent" :key="UserChatItem.id" :chatItem="UserChatItem" :selfWechatId="wechat_id" :oppositeWID="receive_wechat_id"></UserChatItem>
      
      <UserChatItem v-for="UserChatItem2 in TimeLyMessage.chatContent" :key="UserChatItem2.id" :chatItem="UserChatItem2" :selfWechatId="wechat_id" :oppositeWID="receive_wechat_id"></UserChatItem>
    </div>

      <!-- 回复内容 -->
      <div>
        <Reply @sendMess="sendMessage"></Reply>
      </div>
      
      <div class="bottom">
        <img src="../assets/img/bottom.png" >
      </div>

    </div>
  </template>
  
  <script>
import { inject, ref, computed, reactive, onMounted, onUpdated, nextTick} from 'vue';
import {onBeforeUnmount , watch} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import {useStore} from 'vuex'



import Reply from './reply.vue';
import ChatHead from './chathead.vue'
import PhoneHead from './phonehead.vue';
import UserChatItem from './UserChatItem.vue';

  export default {
    name: 'Chat',
    components : {
      Reply, ChatHead, PhoneHead, UserChatItem
    },
    setup(props, context) {
      
      // 这里我想用vuex 设置聊天记录
      // 因为聊天记录是共享的, 可以在其他界面删除类似聊天记录之类的
      // 同时我们需要设置聊天记录的格式

      const store = useStore();

      // 后面还要改, 从父组件中传入
      // let wechat_id = ref("michael13")
      // let receive_wechat_id = ref("senna1487")

      const router = useRoute()
      const global_router = useRouter()

      let wechat_id = router.query.w_id
      let receive_wechat_id = router.query.o_wid

      const chatBody = ref(null)

      // 聊天记录信息
      const ChatInfo = computed(() => store.state.chatInfo);

      // 获取头像
      store.dispatch('getBothProfilePaths', [wechat_id, receive_wechat_id])


      // 获取聊天记录信息  这里不需要用await同步
      store.dispatch('getChatMessages', [wechat_id, receive_wechat_id])

      let socket

      /* 客户端每次维护的序列号, 用于和时间戳共同 保证 时序一致性*/
      let currentId 

      const TimeLyMessage = computed(()=>store.state.temporaryChatInfo)


      function sendMessage(text) {
        currentId = currentId + 1
        console.log("现在的currId", currentId)

        console.log("the word:", text)
          if (text && socket.readyState === WebSocket.OPEN) {
          // 构建消息对象，可以包含发送者、接收者、消息内容等
          const message = {
            id : currentId,
            time : new Date(),
            send : wechat_id,         
            receive : receive_wechat_id,
            content : text.value, 
            // id 需要客户端自己维护一个自增的序列号; 最初的需要通过服务器获得
            // time  使用服务器时间    
          };

          console.log(message)   
          socket.send(JSON.stringify(message)); // 发送消息对象

          console.log("消息已发送")
        } else {
          console.log("消息未发送, 消息为空或者socket未连接")
        }
      }


      onMounted( ()=>{
       


        socket = new WebSocket(`wss://localhost:443/wechat/ws?wechat_id=${wechat_id}`)

        socket.onmessage = function(event) {
          /**
           * 这个数据需要在vuex中共享, 作为新增的聊天数据
          */
          const messageData = JSON.parse(event.data);
          console.log(messageData)

          store.commit("addMessageToChatList", messageData)

        }

        socket.onopen = function(event) {
          console.log('WebSocket 连接已建立');
        }

        socket.onclose = function(event) {
          console.log('WebSocket 连接已关闭');
        }

        socket.onerror = function(error) {
        console.log("WebSocket 出现错误:", error);
        }
        
        setTimeout(()=> {
          currentId = parseInt(store.state.currentId)  // 不需要响应式
        
          console.log("currentId", currentId)
        }, 200)
        

      })


      /**
       * 在chathead组件中点击back按钮, 触发结束当前聊天界面数据
       * 在这里需要做数据的处理:
       *  
       *  2. 最后的一条聊天记录, 写入user_friend_info, 修改last_chat_message & time(server time)
       *  3. 关闭websocket连接
       * */
      function LogOutTheCurrentChat() {
        console.log("LogOutTheCurrentChat Invoke")
        let chatContent = getLastContent(TimeLyMessage.value.chatContent)

        if(chatContent)
          store.dispatch("writeThelastContent", chatContent)
        

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }

        global_router.push({ name: 'Main' })
        
      }

      function getLastContent(ChatArray) {
          if(ChatArray.length > 0) {
            return ChatArray[ChatArray.length - 1]
          }
      }

      // 自动滚动到底部的函数
      const scrollToBottom = () => {
        const chat = chatBody.value;
        if (chat) {
          chat.scrollTop = chat.scrollHeight;
        }
      };

      

      onUpdated(scrollToBottom);
      
      return {wechat_id, receive_wechat_id,
          store, chatBody, scrollToBottom,
          ChatInfo, sendMessage, TimeLyMessage, LogOutTheCurrentChat
        }
    }
  }
  </script>

  <style scoped>

  ::-webkit-scrollbar {
    display: none;
  }

  /* 针对 WebKit 浏览器隐藏滚动条 */
  ::-webkit-scrollbar {
    width: 0px; /* 将滚动条宽度设置为0 */
  }


  .fake {
    background-color: #ededed;
    max-width: 100%; /* 确保聊天框不会超出父容器的宽度 */
    max-height: 100%; /* 调整这个值以限制最大高度 */
    overflow-y: hidden; /* 允许垂直滚动 */


  }
  

  .chat {
    background-color: #f7f7f7;
    height: 390px; /* 减小聊天框高度 */
    max-height: 400px; /* 设置最大高度 */
    border-top: 1px solid rgb(214, 214, 214);
    border-bottom: 1px solid rgb(214, 214, 214);
    padding: 5px 0 0 0;
    overflow-y: auto; /* 允许垂直滚动 */
    overflow-x: hidden; /* 隐藏水平滚动条 */

    scrollbar-width: none; /* Firefox */

  }

  .reply {
    height: 58px;
    background-color: rgb(245 245 245);
  }
  </style>


  <!-- 
  
  2024.9.29需要实现什么功能：
    1. 对方来消息，我需要接收
    2. 好友系统:
      增加好友，就需要在friends表(MongoDB) & user_friend_info中更改
      需要添加一些chat字段(wid, remarkname, content)和 mysql中增加表
      注册: 需要增加一个User字段(MongoDB)
  -->