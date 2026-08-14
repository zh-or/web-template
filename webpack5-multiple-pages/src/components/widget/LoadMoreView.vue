<template>
    <div class="loadmore-view">
        <div v-if="theEnd">已经到底了 ~</div>
        <div v-else>
            <LLoading />
            <span>加载中...</span>
        </div>
    </div>

</template>

<script>
    export default {
        name: "LoadMoreView",
        props: {
            theEnd: {
                type: Boolean,
                default: false
            }
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style lang="less">
.loadmore-view {
    padding: 10px;

    text-align: center;
    color: @colorTxt3;
    font-size: 14px;
}
</style>
