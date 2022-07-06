<template>
    <!--#ifdef MP-WEIXIN-->
    <view class="tab-bar-wrap">
        <view class="tab-bar">
            <view class="item"
                        v-for="(item, i) in tabs"
                        :key="i"
                        @click="switchPage(item, i)"
                        :class="{'select': selected === i}">
                <image :src="'/' + (selected === i ? item.selectedIconPath : item.iconPath)" mode="aspectFit"/>
                <view class="text">{{item.text}}</view>
            </view>
        </view>
    </view>
    <!--#endif-->
</template>

<script>
    export default {
        name: "custom-tab-bar",
        data() {
            return {
                tabs: [
                    {
                        "pagePath": "pages/home",
                        "text": "首页",
                        "iconPath": "static/icon/tab1.png",
                        "selectedIconPath": "static/icon/tab1-s.png"
                    },
                    {
                        "pagePath": "pages/great",
                        "text": "优选",
                        "iconPath": "static/icon/tab4.png",
                        "selectedIconPath": "static/icon/tab4-s.png"
                    },
                    {
                        "pagePath": "pages/my",
                        "text": "我的",
                        "iconPath": "static/icon/tab5.png",
                        "selectedIconPath": "static/icon/tab5-s.png"
                    }
                ]
            }
        },
        mounted() {
            /*这里的当前选中项 不能直接存组件里面, 实际运行的时候会创建几个组件*/
        },
        computed: {
            selected() {
                return this.$store.getters.selectTab;
            }
        },
        methods: {
            switchPage(obj, i) {
                this.$store.dispatch('setSelectTab', i);
                this.$r.switchTab('/' + obj.pagePath);
            }
        }
    }
</script>

<style lang="scss">
    .tab-bar-wrap {
        height: 80px;
        display: flex;
        align-items: flex-end;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99999;
    }
.tab-bar {
    width: 100%;
    height: $tab-bar-height;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 5px 0;
    box-shadow: 0px -8px 21px 0px #0000002e;

    .item {
        flex-grow: 1;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &.select {

            .text {
                color: #00ADB5;
            }
        }

        image {
            width: 22px;
            height: 22px;
        }

        .text {
            margin-top: 8rpx;
            font-size: 20rpx;
            color: #666;
        }
    }
}
</style>
