<template>
  <div class="input-container">
    <button class="voice-btn" @click="onVoiceClick">
      <img src="../assets/img/call.png" >
    </button>
    <input
      type="text"
      v-model="inputText"
      class="text-input"
      @keydown.enter="SendMessage"
    />
    <button class="emoji-btn" @click="onEmojiClick">
      <img src="../assets/img/emoji.png" >
    </button>
    <button class="add-btn" @click="onAddClick">
      <img src="../assets/img/plus.png" >
    </button>
  </div>
</template>
  
  <script>
    import {nextTick, ref} from 'vue'
    import { useStore } from 'vuex';

  export default {

    setup(props, context) {
        let inputText = ref('')
        const store = useStore();

        function  onVoiceClick() {
        console.log('Voice button clicked');
      }
        function onEmojiClick() {
        console.log('Emoji button clicked');
      }
        function onAddClick() {
        console.log('Add button clicked');
      } 

        function SendMessage() {
          // 使用自定义事件向父组件传输数据
          context.emit('sendMess', inputText)
          

          nextTick(()=>{
            inputText.value = ''
          })
        }

      return {inputText, onAddClick, onEmojiClick, onVoiceClick, SendMessage}
    }


  }
</script>
  

<style scoped>
.input-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  background-color: #f7f7f7;
  border-radius: 20px;
  padding: 5px;
  width: 100%; /* 使容器宽度保持与屏幕一致 */
  box-sizing: border-box; /* 确保 padding 不影响整体宽度 */
}

.voice-btn,
.emoji-btn,
.add-btn {
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin: 0 5px;
}

.text-input {
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%; /* 使输入框占满剩余空间 */
  height: 30px;
}

.text-input::placeholder {
  color: #999;
}

.voice-btn img {
  height: 100%;
  max-height: 40px;
  max-width: 40px;
}

.emoji-btn img {
  height: 100%;
  max-height: 40px;
  max-width: 40px;
}

.add-btn img {
  height: 100%;
  max-height: 40px;
  max-width: 40px;
}

</style>