<template>
    <div class="">
        <button @click="test++">add</button>
        <el-button type="primary">aaa</el-button>
        <el-button type="primary" @click="showToast">toast</el-button>
        <el-button type="primary" @click="modal.success('success')">modal</el-button>
        <div>{{test}}</div>
        <SvgIcon name="user"/>
    </div>
</template>
<script setup name="login">
    const modal = $modal;
    let test = ref(0);
    const {proxy} = getCurrentInstance();

    function a() {
        $api.login({test: 1})
            .then(res => {
                console.log(res);
            })
            .catch(e => {
                console.error(e);
            })
    }

    a();

    onMounted(_ => {

        console.log('test', _, proxy);
    })

    function showToast() {
        $t.showToast('test');
        console.error('1');
    }
</script>
<style lang='scss'>

</style>
