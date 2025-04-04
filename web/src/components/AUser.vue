<template>
    <div class="dialog">
        <div class="avatar"> <img :src="oppositeProfile" />
        </div>
        <div class="word">
          {{chatContent}}
        </div>
      </div>
</template>

<script>
import { computed } from 'vue';

import {useStore} from 'vuex'

export default {
  name : 'AUserChatItem',
  props:['content'],
  setup(props) {
    let chatContent = computed(()=> props.content) 

    const store = useStore()
    const oppositeProfile = computed(() => `/src/${store.state.oppositeProfilePath}`) 

    return {chatContent, oppositeProfile}
  }
}
</script>

<style scoped>
.dialog {
    margin: 5px 3px;
    float: left;
    clear: both;
  }

  .word{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .word {
    font-family: "Microsoft YaHei";

    right: 0px;
    min-width: 32px;
    max-width: 200px;
    min-height: 30px;
    max-height: 200px;
    background: #ffffff;
    font-size: 14px;
    color: black;
    word-break: break-word;
    position: relative;
    padding: 4px 10px;
    margin-right: 0px;
    float: right;

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
    left: -12px;
    top: 15px;
    border: 6px solid;
    border-color: transparent white transparent transparent;
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