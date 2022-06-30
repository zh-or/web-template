<template>
    <div class="">
        <button @click="test++">add</button>
        <el-button type="primary">aaa</el-button>
        <el-button type="primary" @click="showToast">toast</el-button>
        <el-button type="primary" @click="modal.success('success')">modal</el-button>
        <el-button type="primary" @click="startAnim">startAnim</el-button>
        <div class="anim-wrap">
            <div class="child" :style="animStyle">{{test}}</div>
        </div>
        <div>{{animStyle}}</div>
        <SvgIcon name="user"/>
    </div>
</template>
<script setup name="login">

    console.log(process.env);
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

    let left = ref(0);
    const animStyle = computed(_ => {
        return {
            left: left.value + '%'
        }
    });

    let animCancel = null;

    function startAnim() {
        if(animCancel) {
            animCancel.cancel();
        }
        animCancel = $t.tween('linear', 0, 100, 2000, v => {
            left.value = v;
        });
    }
</script>
<style lang='scss'>
.anim-wrap {
    position: relative;
    height: 40px;
    .child {
        display: inline-block;
        position: absolute;
        left: 0%;
        width: 20px;
        background-color: aquamarine;
    }
}
</style>
