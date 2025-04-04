<template>
    <div class="dialog">
      <div class="word">
        {{chatContent}}
      </div>
      <div class="avatar"> <img :src="selfProfile" /></div>
        
      </div>
</template>

<script>
import { computed} from 'vue';

import {useStore} from 'vuex'

export default {
  name : 'BUserChatItem',
  props:['content'],
  setup(props) {
    let chatContent = computed(()=> props.content) 

    const store = useStore()
    const selfProfile = computed(() => `/src/${store.state.selfProfilePath}`) 


    return {chatContent, selfProfile}
  }
}
</script>

<style scoped>
.dialog {
    
    margin: 5px 3px;
    float: right;
    clear: both;
  }
  
  .word {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .word {

    font-family: "Microsoft YaHei", Arial, sans-serif;

    align-items: center;  /* 垂直居中内部内容 */

    right: 0px;
    min-height: 30px;
    max-height: 200px;
    min-width: 32px;
    max-width: 200px;
    background: rgb(150 237 107);
    border-radius: 5px;
    font-size: 14px;
    color: black;
    word-break: break-word;
    position: relative;
    padding: 4px 10px;
    margin-left: 0px;
    margin-top: 0px;
    float: left;

    white-space: normal; /* 允许换行 */
    overflow-wrap: break-word; /* 允许在单词内换行 */
    word-wrap: break-word; /* 老版本浏览器的兼容性写法 */
    word-break: break-all; /* 允许在单个字之间换行 */

    text-align: left; /* 设置文本左对齐 */
  }
  .word::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    right: -12px;
    top: 12px;
    border: 6px solid;
    border-color: transparent transparent transparent rgb(150 237 107);
  }

  .avatar {
    padding: 0 5px;
    float: left;
  }
  .avatar img {
    height: 30px;
    width: 30px;
    border-radius: 4px;
  }
</style>