<template>
    <div class="page page-index">
        首页
        <svg-icon name="ad"/>
        <button @click="test">测试</button>
    </div>
</template>

<script setup>
    import t from '@zh-or/lib';

    function test() {
        t.showToast('123');
    }
</script>

<style lang="less">

</style>
