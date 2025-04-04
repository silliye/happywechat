import { createRouter, createWebHistory } from 'vue-router';



import videoComp from '../components/videoComp.vue'; 
import talkComp from '../components/talkComp.vue';
import loginComp from '../components/login/login.vue';

import mainComp from '../components/main.vue';
import registerComp from '../components/login/register.vue';
// 测试maintest
import maintestComp from '../components/maintest.vue';


import store from '../vuex/index';


const routes = [

  {
    path: '/video',
    name: 'video',
    component: videoComp
  },
  {
    path: '/chat',
    name: 'chat',
    component: talkComp,
    beforeEnter: (to, from, next) => {
      // 此处实施访问控制逻辑
      // 例如，检查用户是否已经登录

      
      const userinfo = store.state.ifLogin;
      const fromPath = from.path;

      if (userinfo) {
        // 检查是否从 main 组件跳转过来
        if (fromPath === '/main') {
          next(); // 允许访问
        } else {
          next({ name: 'login' }); // 重定向到登录页
        }
      } else {
        next({ name: 'login' }); // 用户未登录，重定向到登录页
      }
    }

  },
  {
    path: '/login',
    name: 'login',
    component: loginComp
  },
  {
    path: '/register',
    name: 'register',
    component: registerComp
  },
  {
    path: '/maintest',
    name: 'maintest',
    component: maintestComp
  },
  {
    path: '/main',
    name: 'Main',
    component: mainComp,
    beforeEnter: (to, from, next) => {
      // 此处实施访问控制逻辑
      // 例如，检查用户是否已经登录

      
      const userinfo = store.state.ifLogin
      
      if (userinfo) {
        next(); // 允许访问
      } else {
        next({ name: 'login' }); // 重定向到登录页
      }
    }
  },


];

const router = createRouter({
    history: createWebHistory(),
  routes
});

export default router;