<template>
  <div class="card">
    <div class="nav-bar">
      <router-link class="nav-link" to="/video">抖音</router-link>
      <router-link class="nav-link" to="/video">直播</router-link>
      <router-link class="nav-link" to="/video">地图</router-link>
      <router-link class="nav-link" to="/main">贴吧</router-link>
      <router-link class="nav-link" to="/login">微信</router-link>
    </div>
    <div class="content">
      <keep-alive >
        <router-view ></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import videoComp from './components/videoComp.vue'; 
import talkComp from './components/talkComp.vue';
import loginComp from './components/login/login.vue';


import {provide, ref} from 'vue'
export default {
  name: 'App',

  setup(props, context) {

      
  },

  components: {
    videoComp,
    talkComp,
    loginComp,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  overflow-y: hidden; /* 不允许垂直滚动 */
  
  height: 1060px;

}
* {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

body {
  font-family: "Microsoft YaHei", Arial, sans-serif;

  background: #222;
  overflow: hidden;
}

.card {
  top:0;
  
  width: 70%;
  max-width: 470px;
  background: linear-gradient(135deg, #111414, #5b548a);
  color: #fff;
  margin: 10px auto 0;
  margin-top: 1px;
  border-radius: 20px;
  padding: 45px 35px;
  text-align: center;
  display: flex;

  flex-direction: column;
  justify-content: flex-start;
  height: 900px; 
}

.nav-bar {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 3px;
  margin: 5px;
}

.nav-link:hover {
  background-color: #fff;
  color: #5b548a;
}

.content {
  flex: 1;
  overflow-y: hidden;
  
  padding: 10px;
}
</style>