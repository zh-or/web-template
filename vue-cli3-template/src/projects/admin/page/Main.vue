<template>
    <transition name="el-fade-in-linear" mode="out-in">
        <el-container id="container">
            <el-container>
                <main-menu></main-menu>
                <el-main :style="widthStyle">
                    <navbar>
                        <div slot="right-view">123</div>
                    </navbar>

                    <breadcrumb id="breadcrumb-container" :style="widthStyle2" class="breadcrumb-container"/>

                    <transition name="el-fade-in-linear" mode="out-in">
                        <router-view/>
                    </transition>
                </el-main>
            </el-container>

        </el-container>
    </transition>
</template>

<script>
    import MainMenu from '../components/MainMenu.vue';
    import MainHeader from '../components/MainHeader.vue';
    import Navbar from '@/components/Navbar';
    import Breadcrumb from '@/components/Breadcrumb.vue';

    export default {
        components: {
            Navbar,
            MainMenu,
            MainHeader,
            Breadcrumb
        },
        data() {
            return {}
        },
        created() {
        },
        computed: {
            isCollapse() {
                return this.$store.getters.sidebar;
            },
            widthStyle() {
                return {
                    'margin-left': this.isCollapse ? '60px !important' : '210px !important'
                }
            },
            widthStyle2() {
                return {
                    'padding-left': this.isCollapse ? '79px !important' : '289px !important'
                }
            }
        },
        methods: {}
    }
</script>

<style>

    .el-container {
        height: 100%;
        position: relative;
    }



</style>
