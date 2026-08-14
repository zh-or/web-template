<template>
    <div class="app-main">
        aaa1
    </div>
</template>
<script setup >

import msg from '@base/components/msg.js';
import t from '@zh-or/lib';
import e from '@zh-or/lib/event.js';
import u from '@base/lib/tools.js';
import api from '@base/api/api.js';
import papi from '@index/api/api.js';

import {
    reactive, ref, useTemplateRef, computed,
    onMounted, onUnmounted
} from 'vue';

import {getHost, getImgUrl} from '@base/api/host.js';
import {waitLogin, waitInit, userStore } from "@base/lib/store.js";


defineOptions({name: 'App'});

let props = defineProps({
})


let data = reactive({

});


onMounted(() => {

})



</script>
<style lang="less">
.app-main {

}
</style>
