<template>
</template>
<script>
    import {getConfig} from "../index";
    export default {
        name: 'base-controls',
        props: {
            input: {
                /*v-model*/
                type: Function
            },
            value: '',
            config: {
                /*配置*/
                type: Object,
                default() {
                    //console.log('mixins', this, this.$options.name);
                    return getConfig(this.$options.name);
                }
            },
            edit: false,
        },
        data() {
            return {
                val: this.config.defaultVal,
            }
        },
        watch: {
            'val': function (v) {
                this.$emit('input', v);
            },
            'value': function (v) {
                this.val = v;
            }
        },
        created() {
            if (typeof this.val === typeof this.value) {
                this.val = this.value;
            } else {
                console.log('数据类型不正确', this.value, 'is not ' + (Array.isArray(this.val) ? '[Array]' : (typeof this.val)));
            }
        },
        updated(){
            console.log('updated', this);
        },
        methods: {
            createName() {
                let name = 'name-' + (new Date().getTime().toString(16));
                return name;
            }
        }
    }
</script>

<style>

</style>
