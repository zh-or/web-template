<template>
    <view class="page">
        {{title}}
        <u-button text="月落"></u-button>
        <view>
            <u-rate :count="count" v-model="value"></u-rate>
        </view>
    </view>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {}
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style lang="scss">

</style>
