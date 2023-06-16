<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script setup>
    import { reactive } from 'vue';
    import api from '@doc-admin/api/api.js';
    import router from '@doc-admin/router';
    import t from '@zh-or/lib';

    let data = reactive({
        indexPath: ''
    });


    data.indexPath = router.history.current.fullPath;

    console.log(router);
</script>
<style lang="less">
</style>
