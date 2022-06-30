<template>
    <div class="mobile-view">
        <dynamic-view ref="form" :disabled="isVerify"></dynamic-view>

    </div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: "App",
        data() {
            return {


            }
        },
        computed: {
            isVerify() {
                return this.$store.getters.isVerify;
            }
        },
        created() {

        },
        methods: {
            ...mapActions([
                'test',
            ]),

        }
    }
</script>

<style lang="less">

</style>
