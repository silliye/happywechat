<template>
    <div class="phonehead">
        <div class="line1" style="text-align: left; height: 100%; float: left; padding: 2px ; margin: 0 2px;">

          <img style="height: 30px; max-height: 50px; max-width: 200px;" src="../assets/img/left-head.png" >
        </div>

        <div class="line1" style="text-align: center; color: black; font-size: 12px; font-weight:400; padding-top: 5px;">
          <!-- 2.时间 -->
          {{time}}
        </div>

        <div class="line1" style="text-align: right; height: 100%; float: right; padding: 2px 0; margin: -25px 2px 0 0;">
          <img style="height:40px; max-height: 100px; max-width: 200px" src="../assets/img/right-head.png">
        </div>
      </div>
</template>

<script>

import {ref} from 'vue'

export default {
    name:'PhoneHead',

    setup() {
        let now = new Date()
        let time = ref("")
        time.value = getTimeFormat(now)

        function getTimeFormat(now) {
            let minute = now.getMinutes()
            
            
            if(minute >= 0 && minute < 10) {
                return `${now.getHours()}:0${now.getMinutes()}`
            } else {
                return `${now.getHours()}:${now.getMinutes()}`
            }
        }

        // 定义更新时间的函数
        function updateTime() {
            now = new Date();
            time.value = getTimeFormat(now);
        }

         // 设置定时器，每分钟更新时间
        const intervalId = setInterval(updateTime, 30000);


        return {time, updateTime, intervalId, getTimeFormat}
    }
}
</script>

<style>

.phonehead {
    background-color: rgb(236, 236, 236);
    width: 100%;  
    font-size: 13px;
    font-weight: 800;
    overflow: hidden;
    height: 25px;
  }

.line1 {
    width: 33%;
    float: left;
  }

</style>