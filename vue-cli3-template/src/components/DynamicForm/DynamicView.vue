<template>
    <div class="dynamic">

        <component v-for="(ctl, index) in controls"
                   :key="'k-' + index"
                   :is="ctl.view"
                   :name="ctl.name"
                   :config.sync="ctl.config"
                   v-model="ctl.value"
        ></component>

    </div>
</template>

<script>
    import './index.js';

    export default {
        name: "DynamicView",
        props: {
            data: ''
        },
        data() {
            return {
                controls: [],
            }
        },
        created() {

        },
        methods: {
            load(data) {
                this.controls = data;
            },
            check(){

                return true;
            },
            getValues(){
                let vals = [];
                this.controls.forEach(ctl => {
                    vals.push({
                        name: ctl.name,
                        view: ctl.view,
                        val: ctl.value
                    });
                });
                return vals;
            }
        }
    }
</script>

<style>

</style>
