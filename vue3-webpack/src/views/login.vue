<template>
    <div class="">
        <button @click="test++">add</button>
        <el-button type="primary">aaa</el-button>
        <el-button type="primary" @click="showToast">toast</el-button>
        <el-button type="primary" @click="modal.success('success')">modal</el-button>
        <el-button type="primary" @click="startAnim">startAnim</el-button>
        <el-button type="primary" @click="startAnim2">startAnim2</el-button>
        <div class="anim-wrap">
            <div class="child" :style="animStyle">{{test}}</div>
        </div>
        <div>{{animStyle}}</div>
        <SvgIcon name="user"/>
    </div>
</template>
<script setup name="login">
import { $t } from '@/autoImportUtils';


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

    let style = reactive({
        left: 0,
        top: 0
    });
    const animStyle = computed(_ => {
        return {
            left: style.left + '%',
            top: style.top + 'px'
        }
    });

    let animCancel = null;

    function startAnim() {
        if(animCancel) {
            animCancel.cancel();
        }
        let s = Date.now();
        animCancel = $t.tween('linear', {left: 0, top: 0}, {left: 50, top: 50}, 2000, v => {
            style.left = v.left;
            style.top = v.top;
            if(v.top >= 50) {
                console.log('t:', Date.now() - s);
            }
        });
    }

    function startAnim2() {
        if(animCancel) {
            animCancel.cancel();
        }
        animCancel = $t.seriesTween({
            ts: [
                {
                    from: {left: 0, top: 0},
                    to: {left: 50, top: 50}
                },
                {
                    from: {left: 50, top: 50},
                    to: {left: 30, top: 60}
                },
            ],
            cb: (v) => {
                style.left = v.left;
                style.top = v.top;
            }
        })
    }

</script>
<style lang='scss'>
.anim-wrap {
    position: relative;
    height: 80px;
    .child {
        display: inline-block;
        position: absolute;
        left: 0%;
        width: 20px;
        background-color: aquamarine;
    }
}
</style>
