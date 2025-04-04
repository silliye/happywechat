<template>
  <div class="video-container" @wheel="handleWheelEvent">
    <video ref="videoPlayer"  controls :src="videoSrc" width="100%" height="auto" @loadedmetadata="playVideo">
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script>
import {ref, computed, reactive, nextTick } from 'vue'

export default {
  name: 'Video',

  setup(props, context) {
    // 原生数据
    let videoList = reactive(['public/video/1.mp4', 
                   'public/video/2.mp4',
                   'public/video/3.mp4',
                   'public/video/4.mp4',
                   'public/video/5.mp4'])
    // 原生数据
    let videoIndex = ref(0)

    // 计算属性
    let videoSrc = computed(()=> {
      return videoList[videoIndex.value]
    }) 

    let videoLength = computed(()=> {
      return videoList.length
    })

    const videoPlayer = ref(null)

    // 方法
    function handleWheelEvent (event) {
        // 阻止默认的滚动行为
        event.preventDefault();


        // 检查滚轮方向
        if (event.deltaY < 0 && videoIndex.value > 0) {   // 向上
          console.log('上');
          videoIndex.value--;
        } 
        if (event.deltaY > 0 && videoIndex.value < (videoLength.value - 1)) {  // 向下
          console.log('下');
          videoIndex.value++;
        }

        nextTick(() => {
          videoPlayer.value.play();
        });
      }

    function playVideo() {
      console.log('play...')
      videoPlayer.value.play();
    }

    return {videoList, videoIndex, videoSrc, videoLength, handleWheelEvent, playVideo, videoPlayer}

  }
}
</script>

<style scoped>
.video-container {
  background-color: #000;
  padding: 20px;
  border-radius: 10px;
}

video {
  outline: none;
}
</style>