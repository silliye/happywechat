<template>
    <div class="main-header">
        <div class="exit" style="font-size:14px; color:black" @click="exit" >
          LogOut
        </div>

        <div class="title" style="font-weight: 500;text-align: center; color: black; font-size: 15px; font-weight:400; padding-top: 5px;">
          {{name}}
          </div>
      <div class="icons">
        <img src="../assets/img/search.png" alt="Search" class="icon1" />
        <img src="../assets/img/mainAppplus.png" alt="Add" class="icon2" />
      </div>
    </div>
  </template>
  
  <script>
import { computed } from 'vue';
  import {useStore} from 'vuex'
  import { useRouter } from 'vue-router';

  export default {
    name: "MainHead",
    setup() {
      const store = useStore()
      const name = computed(()=>store.state.CurrentUserWid)
      const router = useRouter()

      /**
       * 退出登录;
       * 将vuex中的CurrentUserWid  &  ifLogin  复位
       * 将localStorage  复位
       * 路由到登录界面;  
      */
     
      function exit() {
        store.commit("SET_USER_LOG_OUT")
        localStorage.removeItem("userToken")
        router.push({ name: 'login'})
      }

      return {name, exit}
    }
  };
  </script>
  
  <style scoped>
  .main-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ededed;
    padding: 10px 15px;
    border-bottom: 1px solid #ddd;
    height: 40px;
  }
  
  .title {
    margin-left: 60px;
    margin-bottom: 8px;
    font-weight:1700;
    text-align: center; 
    color: #333;
  }

  
  
  .icons {
    display: flex;
    align-items: center;
  }
  
  .icon1 {
    width: 35px;
    height: 30px;
    margin-left: 15px;
    cursor: pointer;
  }

  .icon2 {
    width: 38px;
    height: 30px;
    margin-left: 15px;
    cursor: pointer;
    margin-bottom: 4px;
  }
  </style>
  