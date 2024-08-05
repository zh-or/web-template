<template>
    <div class="l-tab">
        <div class="tab-wrap">
            <div v-for="name in names"
                 @click="selectName(name)"
                 class="name"
                 :class="{select: name === value}"
                 :key="name">{{name}}</div>
        </div>
        <div class="l-tab-content">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LTab",
        provide() {
            return {
                regName: this.regName
            }
        },
        props: {
            value: String,
        },
        data() {
            return {
                names: []
            }
        },
        methods: {
            regName(name) {
                if(!this.names.find(_ => _ === name)) {
                    this.names.push(name);
                }
            },
            selectName(name) {
                this.$emit('change', name);
                this.$emit('input', name);
            }
        }
    }
</script>

<style lang="less">
.l-tab {
    .tab-wrap {
        .name {
            padding: 5px 0;
            min-width: 100px;
            text-align: center;
            font-weight: bold;
            font-size: 13px;
            color: @colorTxt2;
            border-top-right-radius: 4px;
            border-top-left-radius: 4px;
            display: inline-block;
            cursor: pointer;

            &.select {
                background-color: @colorBase;
                color: #fff;
            }
        }
    }

    .l-tab-content {
        border-top: 1px solid @colorTxt3;
    }
}
</style>
