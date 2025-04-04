<template>
    <div class="chathead">
        <!-- 对话框头部 -->
        <div class="line1" style="text-align: left; ">
          
            <button class="back-btn" @click="backToLastRoute"  style=" height: 100%; float: left; padding: 2px ; margin: 0 15px; border: 1px solid #ededed;">
              <img src="../assets/img/back.png" alt="">
            </button>
          
        </div>
        <!-- 备注名 -->
        <div class="line1" style="text-align: center; color: black; font-size: 15px; font-weight:400; padding-top: 5px;">
          {{chatName}}
        </div>  

        <!-- Config选项(三个点) -->
        <div class="line1" style="text-align: right; margin-right:4px; width:30%; ">

          <button style="border: 1px solid #ededed;" class="config-btn" @click="onConfigClick">
            <img src="../assets/img/config.png">
          </button>
          <div v-if="showNavList" class="nav-popup">
            <div v-for="item in navList" :key="item.name" @click="selectNav(item)">
              {{ item.name }}
            </div>
          </div>

        </div>
      </div>
</template>

<script>
import { inject, watch, computed, ref} from 'vue';

import { useRoute } from 'vue-router';
import {useStore} from 'vuex'

export default {
    props:['remarkName'],

    setup(props, context) {
        let chatName = computed(()=> props.remarkName)
        let router = useRoute()
        const store = useStore();

        const showNavList = ref(false);
        const navList = ref([
          { name: '选项一' },
          { name: '选项二' },
          { name: '选项三' },
        ]);



        /**
         * 返回至上一个路由;
         * 用到chathead组件的组件 : talk.vue  back to main.vue 
         * 
         * 同时触发事件 : 聊天窗口关闭
         * 我们应该将当前聊天的最后一句话 写入缓存中()
         * 
         * 
         */   


        function backToLastRoute() {
          context.emit("LogOutTheCurrentChat")
          console.log("backToLastRoute Invoke")
          if (router.hasRouteChanged) {
            console.log("back需要执行")
            router.back();
          }
        }

        function onConfigClick() {
          console.log("OnconfigClick执行了")
          if(store.state.ifLogin) {
            // 用户登录了才可以点击
            if(router.name === 'Main') {
              doMainConfig()
            } else if (router.name = 'chat') {
              doChatConfig()
            }
          }
        }

        /**
         * 聊天框时候的Config选项
         * */
        function doChatConfig() {

        }

        /**
         * 用户主界面的Config选项
         * */
        function doMainConfig() {
          showNavList = !showNavList
        }

        return {chatName, backToLastRoute, onConfigClick, showNavList, navList}
    }
}
</script>

<style scoped>

.chathead {
  background-color: #ededed;
  height: 40px;
  width: 100%;
  font-size: 18px;
  font-weight: 800;
  overflow: hidden;
  padding: 3px 0 3px 0;
}
  .line1 {
    width: 33%;
    float: left;
  }
  .line1 .back-btn img {
    height: 100%;
    max-height: 50px;
    max-width: 50px;
  }


  .line1 .config-btn img {
    height: 100%;
    max-height: 30px;
    max-width: 30px;
  }

  .nav-popup {
    position: fixed;
    bottom: 40px; /* 调整位置，使其在聊天头部下方 */
    left: 0;
    width: 100%;
    background-color: white;
    border-top: 1px solid #ddd;
    padding: 10px;
    z-index: 1000; /* 设置较高的 z-index 确保覆盖聊天框 */
  }
</style>