<template>
    <l-button @click="clickFun"
              :loading="loading"
              :disabled="countdown > 0"
              :type="type"
              :loading-str="loadingStr">
        <span v-if="countdown > 0">{{showSec}}</span>
        <slot v-else/>
    </l-button>
</template>

<script>
    export default {
        name: "LTimeoutButton",
        props: {
            loadingStr: String,
            type: String,
            keyName: String,
            format: {
                type: String,
                default: '{time}秒后再试'
            }
        },
        data() {
            return {
                timer: null,
                countdown: 0,
                showSec: '',
                loading: false,
            }
        },
        created() {
            let n = this.$t.getLocal(this.keyName || 'rkgheo2', 0);
            n = Number(n);
            this.countdown = isNaN(n) ? 0 : n;
            this.execTime();
        },
        methods: {
            execTime() {
                if(this.countdown <= 0 || this.countdown < Date.now()) {
                    this.countdown = 0;
                    return;
                }
                clearTimeout(this.timer);
                let timeFun = call => {
                    let loss = this.countdown - Date.now();
                    let str = this.format;
                    loss = loss / 1000;
                    loss = loss.toFixed(0);
                    this.showSec = str.replaceAll('{time}', loss);

                    if(!call) {
                        this.execTime();
                    }
                };
                this.timer = setTimeout(timeFun, 1000);
                timeFun(true);
            },
            clickFun() {
                this.loading = true;
                let p = new Promise((resolve, reject) => {
                    this.$emit('click', {resolve, reject});
                });
                p.then(t => {
                    this.countdown = Date.now() + t;
                    this.$t.setLocal(this.keyName || 'rkgheo2', this.countdown);
                    this.execTime();
                    this.loading = false;
                })
                .catch(e => {
                    this.loading = false;
                })
            }
        }
    }
</script>

<style lang="less">

</style>
