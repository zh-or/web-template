<template>
    <view class="page page-goods-details">
        <view class="html-data">
            <u-parse :html="data.content"></u-parse>
        </view>
    </view>
</template>

<script>
    export default {
        name: "details",
        data() {
            return {}
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style lang="scss">
.page-goods-details {
    .html-data {
        padding: 20rpx 32rpx 20rpx;

        image {
            max-width: 100%;
        }
    }
}
</style>
