<template>
    <div class="test">{{data.hello}}</div>
</template>

<script setup name="test">
import {reactive} from 'vue';

let data = reactive({
    hello: 'hello world'
})
</script>

<style lang="less">
.test {
    color: #ff0;
}
</style>
