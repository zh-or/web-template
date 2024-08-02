<template>
<div class="l-tab-item" v-if="$parent.value === name">
    <slot/>
</div>
</template>

<script>
    export default {
        name: "LTabItem",
        inject: {
            regName: {value: 'regName', default: () => console.error('LTabItem 需要在 LTab 内.')},
        },
        props: {
            name: String
        },
        data() {
            return {
            }
        },
        created() {
            this.regName(this.name);
        },
        watch: {
            name() {
                this.regName(this.name);
            }
        }
    }
</script>

<style lang="less">
.l-tab-item {

}
</style>
