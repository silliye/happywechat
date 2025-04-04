<template>
    <div class="main-container">
      <phonehead></phonehead>
      <mainhead></mainhead>
  
      <!-- User List -->
      <div class="user-list">
        <div class="user" v-for="(user, index) in users" :key="index" @click="gotoChat(user)">
          <img :src="getProfile(user.friend_profile)" alt="User Icon" class="user-icon" />
          <div class="user-info">
            <p class="user-name">{{ user.friend_remark_name}}</p>
            <br>
            <p class="last-message">{{ user.last_chat_message }}</p>
          </div>
          <div class="time">{{transTime(user.time)}}</div>
        </div>
      </div>
  
      <!-- Bottom Navigation -->
      <mainbottom class="mainbottom"></mainbottom>
    </div>
  </template>
  
  <script>
    import phonehead from "./phonehead.vue";
    import mainhead from "./mainhead.vue";
    import mainbottom from "./mainbottom.vue";


    import { computed, nextTick, reactive, ref} from "vue";
    import {useStore} from 'vuex'

  
    export default {
      components: { phonehead, mainhead, mainbottom },
      setup() {
        const store = useStore();

        const wechat_id = ref("michael13")
        let users

        // 拉取数据
        store.dispatch("getFriendUserList", wechat_id.value)

        
        users = computed(()=> store.state.friendUserList)

        function getProfile(img) {
          return "/src/" + img
        }

        function transTime(timeString) {
          const givenDate = new Date(timeString);
          const now = new Date();
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);

          // 获取年、月、日
          const givenYear = givenDate.getFullYear();
          const givenMonth = givenDate.getMonth() + 1; // JavaScript 中月份是从0开始的
          const givenDay = givenDate.getDate();

          const nowYear = now.getFullYear();
          const nowMonth = now.getMonth() + 1;
          const nowDay = now.getDate();
  
          const yesterdayYear = yesterday.getFullYear();
          const yesterdayMonth = yesterday.getMonth() + 1;
          const yesterdayDay = yesterday.getDate();

          // 检查是否是今天
          if (givenYear === nowYear && givenMonth === nowMonth && givenDay === nowDay) {
            return `${pad(givenDate.getMinutes())}:${pad(givenDate.getHours())}`;
            
          }
          // 检查是否是昨天
          else if (givenYear === yesterdayYear && givenMonth === yesterdayMonth && givenDay === yesterdayDay) {
            return `昨天 ${pad(givenDate.getMinutes())}:${pad(givenDate.getHours())}`;
          }
          // 其他情况
          else {
            return `${pad(givenMonth)}-${pad(givenDay)}`;
            
          }
        }

        // 辅助函数，用于添加前导零
        function pad(number) {
          return number < 10 ? '0' + number : number;
        }


        function gotoChat(user) {
          // 通过这个user中的属性去得到不同的好友聊天界面
          
        }
        

     

        return {users, wechat_id, getProfile, transTime, gotoChat};
      },
    };
  </script>
  
  <style scoped>
  .main-container {
    position: relative; /* Ensure child elements with absolute position are relative to this container */
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f0f0f0;
  }
  
  .user-list {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px 0;
  }
  
  .user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: white;
    border-bottom: 1px solid #eee;
  }
  
  .user-icon {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    object-fit: cover;
  }
  
  .user-info {
    flex-grow: 1;
    margin-left: 10px;
  }
  
  .user-name {
    font-size: 16px;
    float: left;
    font-weight: 400;
    color:black;
  }
  
  .last-message {
    float: left;
    font-size: 10px;
    margin-top: 8px;
    color: gray;
  }
  
  .time {
    font-size: 12px;
    color: gray;
  }
  
  /* Bottom Navigation */
  .mainbottom {
      position: fixed; /* Fixed position at the bottom of the viewport */
      bottom: 0;
      height: 50px;
      
      width: 380px;
      background-color: #f7f7f7;
      border-top: 1px solid #ddd;
      z-index: 10; /* Ensure it appears above other content */
  }
  
  .bottom-nav {
    display: flex;
    padding: 10px;
  }
  
  .nav-item {
    text-align: center;
  }
  
  .nav-item img {
    width: 24px;
    margin-bottom: 5px;
  }
  
  .nav-item span {
    font-size: 12px;
  }
  </style>
  