<template>
    <div class="wrap">
        <button @click="$t.showToast('toast')">toast</button>
        <button @click="showWait">wait</button>
        <button @click="ajax">ajax</button>
        <button @click="goFormDesign">form design</button>
        <button @click="testLoading = !testLoading">loading</button>

        <div v-loading="testLoading" style="position: relative;">
            awdawd
            <br>
            awdawd
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: "Test",
        data() {
            return {
                testLoading: false
            }
        },
        methods: {
            ...mapActions(['test']),
            showWait() {
                this.$t.showWait('wait');
                setTimeout(this.$t.hideWait, 3000);
            },
            ajax() {
                this.test()
                    .then((req, res) => {
                        console.log('test res', arguments);
                    })
                    .catch(e => {
                        console.log('error:', e);
                    })
            },
            goFormDesign(){
                this.$router.push('/createForm');
            }
        }
    }
</script>

<style lang="less">
    .wrap {
        padding: 30px;
        text-align: center;

        button {
            border: 1px solid #3f3f3f;
            padding: 5px;
        }
    }

    button + button {
        margin-left: 10px;
    }

</style>
