<template>
    <div class="print-view no-print" :pid="id">
        <div class="print-title">
            <slot name="title"></slot>
        </div>
        <div class="print-content">
            <template v-for="page in pages">
                <slot :page="page"></slot>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PrintView",
        props: {
            data: {
                type: Array, default() {
                    return [];
                }
            }
        },
        data() {
            return {
                id: this.$tool.getId(),
                pages: [],
                height: 1123,
                width: 794,
                column: 0,
                iframe: null,
            }
        },
        watch: {
            data() {
                this.buildPages();
            }
        },
        mounted() {
            this.buildPages();
            this.$nextTick(() => {
                this.iframe = document.createElement('iframe');
                this.iframe.style = 'border: 0; height: 1px; width: 1px;position: absolute;z-index: -1; top:0; left: 0;';
                document.body.appendChild(this.iframe);
                let css = document.createElement('link');
                css.type = 'text/css';
                css.rel = 'stylesheet';
                css.href = './static/css/print.css';
                this.iframe.contentDocument.querySelector('head').appendChild(css);
                this.iframe.contentDocument.body.appendChild(this.$el);
            });
        },
        destroyed() {
            const body = document.body;
            body.removeChild(this.iframe);
        },
        methods: {
            buildPages() {

                this.pages = [this.data];
            },
            print() {
                this.iframe.contentWindow.print();
            }
        }
    }
</script>

<style lang="less">
    .no-print {
        display: none !important;
    }

    .print-view {
        overflow: auto;
    }
</style>
