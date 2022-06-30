<template>
    <div id="app">
        <svg-view ref="SvgView"></svg-view>
    </div>
</template>
<script>
    import SvgView from "@/components/SvgView";
    import map from '@/assets/map/index.js';

    export default {
        components: {SvgView},
        data() {
            return {
            }
        },
        mounted() {
            this.$refs.SvgView.loadMap(map.huadong, function(){
                //updatePosition -> mouse down and move
                console.log('update');
            });
        },
        methods: {

        }
    }
</script>
<style lang="less">
    #app {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
</style>
