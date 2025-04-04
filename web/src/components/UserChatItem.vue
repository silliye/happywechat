<template>
    <AUser v-if="ifA()" :content="content"></AUser>
    <Buser v-else-if="ifB()" :content="content"></Buser>
</template>

<script>

import {computed, ref} from 'vue'
import AUser from './AUser.vue';
import Buser from './Buser.vue';

export default {
    
    props:['chatItem', 'selfWechatId', 'oppositeWID'],
    components:{AUser, Buser},
    setup(props) {
        
        const send = props.chatItem.send
        const receive = props.chatItem.receive

        let content = props.chatItem.content


        function ifA() {
            return send === props.oppositeWID && receive === props.selfWechatId
        }

        function ifB() {
            return send === props.selfWechatId && receive === props.oppositeWID
        }

        return {content, ifA, ifB}
    }
}
</script>

<style>

</style>