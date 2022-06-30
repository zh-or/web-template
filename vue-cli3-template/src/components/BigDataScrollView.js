export default {
    name: 'BigDataScrollView',
    props: {
        data: Array
    },
    data() {
        return {
            DataPos: {//当前显示数据的下标
                start: 0,
                len: 1,
            },
            columnHeight: 1,
            bodyHeight: 0,
        }
    },
    computed: {
        dataViewMarginTop() {
            return this.columnHeight * this.DataPos.start;
        },
        dataViewMarginBottom() {
            if (this.data && this.data.length > 0) {
                return this.columnHeight * (this.data.length - this.DataPos.start - this.DataPos.len);
            }
            return 0;
        },
    },
    watch: {
        data() {
            this.$nextTick(_ => {
                this.countSize();
            })
        }
    },
    updated() {
        this.$nextTick(_ => {
            this.countSize();
        });
    },
    created() {
        window.addEventListener('resize', this.countSize);
    },
    destroyed() {
        window.removeEventListener('resize', this.countSize);
    },
    mounted() {
        this.$nextTick(_ => {
            this.countSize();
        });
    },
    render(h) {
        let items = [];

        if (this.data && this.data.length > 0) {
            //计算需要显示的数据的下标
            let tlen = this.DataPos.len;
            if (this.bodyHeight > 0 && this.columnHeight > 1) {
                tlen = Math.ceil(this.bodyHeight / this.columnHeight) + 3;
            } else {
                tlen = 1;
            }

            this.DataPos.len = Math.min(tlen, this.data.length - this.DataPos.start);
            let end = this.DataPos.start + this.DataPos.len;

            for (let i = this.DataPos.start; i < end; i++) {
                let item = this.data[i];
                let slot = null;
                if (this.$scopedSlots.default) {
                    //具名插槽
                    slot = this.$scopedSlots.default({row: item});
                } else {
                    slot = this.$slots.default;
                }
                items.push(
                    h(
                        'div',
                        {
                            staticClass: 'bd-scroll-view-item',
                            scopedSlots: {row: item}
                        },
                        [slot]
                    )
                );
            }
        }
        return h('div',
            {
                staticClass: 'bd-scroll-view',
                ref: 'BigDataScrollView',
                on: {
                    scroll: this.dataViewScroll,
                },
                style: {
                    'height': '100%',
                    'overflow-y': 'auto',
                }
            },
            [
                h(
                    'div',
                    {
                        staticClass: 'bd-scroll-view-wrap',
                        ref: 'BigDataScrollViewWrap',
                        style: {
                            'margin-top': this.dataViewMarginTop + 'px',
                            'margin-bottom': this.dataViewMarginBottom + 'px',
                        }
                    },
                    items
                )
            ]
        );
    },
    methods: {
        dataViewScroll(e) {
            let top = this.$refs.BigDataScrollView.scrollTop;
            this.DataPos.start = Math.floor(top / this.columnHeight);

            if (this.DataPos.start + this.DataPos.len > this.data.length) {
                this.DataPos.start = this.data.length - this.DataPos.len;
            }
            this.countSize();
        },
        countSize() {
            this.bodyHeight = this.$refs.BigDataScrollView.clientHeight;
            if (this.$refs.BigDataScrollViewWrap.childNodes.length > 0) {
                this.columnHeight = this.$refs.BigDataScrollViewWrap.childNodes[0].clientHeight;
            }
        }
    }
}
