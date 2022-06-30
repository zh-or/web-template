const filterIcon = 'M568.553 954.182a86.342 86.342 0 0 1-41.426-10.473l-114.269-62.836a86.575 86.575 0 0 1-44.916-76.102V442.18a16.99 16.99 0 0 0-6.982-13.73L97.047 218.298l-3.956-3.49a85.876 85.876 0 0 1 62.836-144.99h711.215a86.575 86.575 0 0 1 63.767 144.99l-3.49 3.49-266.24 213.411a17.455 17.455 0 0 0-6.052 13.731v422.4a86.342 86.342 0 0 1-86.574 86.342z m-426.59-787.55l262.284 209.455a85.178 85.178 0 0 1 32.815 66.095V804.77a17.92 17.92 0 0 0 8.61 15.593l114.27 62.138a17.687 17.687 0 0 0 17.687 0 17.222 17.222 0 0 0 8.378-15.36V445.44a85.876 85.876 0 0 1 31.884-67.258l263.214-211.55a17.687 17.687 0 0 0 1.63-18.152 17.455 17.455 0 0 0-15.593-8.844H155.927a17.222 17.222 0 0 0-13.963 27.695zM920.67 512H731.695a34.444 34.444 0 0 1 0-69.818h188.974a34.444 34.444 0 0 1 0 69.818z m0 128.93H731.695a34.444 34.444 0 0 1 0-69.817h188.974a34.444 34.444 0 0 1 0 69.818z m0 128H731.695a34.444 34.444 0 0 1 0-69.817h188.974a34.444 34.444 0 0 1 0 69.818z';
import FilterView from './FilterView.vue';

export default {
    name: 'BigDataColumn',
    inject: ['onSort', 'onFilter', 'sortObj', 'onResizeHeader', 'dataWrap', 'resize'],
    props: {
        label: String,
        rowspan: Number,
        colspan: Number,
        width: String | Number,
        prop: String,//列名
        sort: Boolean,//排序
        filter: Boolean,//过滤数据
        fixedLeft: Boolean,//左列浮动
        fixedRight: Boolean,//右列浮动
    },
    data() {
        return {
            resize: {
                down: false,
                downX: 0,
                move: 0,
            },
            isFilterData: false,
        }
    },
    created() {
        if (this.resize) {
            window.addEventListener('mousemove', this.resizeMouseMove);
            window.addEventListener('mouseup', this.resizeMouseUp);
        }
    },
    destroyed() {
        if (this.resize) {
            window.removeEventListener('mousemove', this.resizeMouseMove);
            window.removeEventListener('mouseup', this.resizeMouseUp);
        }
    },
    render(h) {
        let label;
        let child = [];
        if (this.$slots.title) {//有slot title
            label = this.$slots.title;
        } else {
            label = h('span', {staticClass: 'bd-head-item-text'}, this.label);
        }

        if (this.sort) {
            child.push(this.createSortView(h, label));
        } else {
            child.push(label);
        }
        if (this.filter) {
            //child.push();
            child.push(this.createFilterView(h));
        }
        //console.log(this.resize, this.fixedLeft, this.fixedRight);
        if (this.resize &&/*可拖动调整列宽*/
            /*固定列不支持拖动调整宽度*/
            (!this.fixedLeft && !this.fixedRight)
        ) {

            child.push(this.createResizeView(h));
        }
        return h('div', {staticClass: 'bd-head-item-label', class: {'bd-filter-column': this.isFilterData}}, child);
    },
    methods: {
        createSortView(h, label) {
            return h(
                'div',
                {
                    staticClass: 'bd-sort-wrap',
                    on: {
                        click: this.sortClickFun
                    }
                },
                [
                    label,
                    h('div', {staticClass: 'bd-sort-view'},
                        [
                            h('span', {
                                staticClass: 'bd-sort-asc',
                                class: {
                                    'active': this.sortObj.column == this.prop && this.sortObj.order == 'asc'
                                }
                            }),
                            h('span', {
                                staticClass: 'bd-sort-desc',
                                class: {
                                    'active': this.sortObj.column == this.prop && this.sortObj.order == 'desc'
                                }
                            }),
                        ]
                    )
                ]
            );
        },
        createFilterIcon(h) {
            return h(
                'svg',
                {
                    staticClass: 'bd-filter-icon',
                    attrs: {viewBox: '0 0 1024 1024'},
                },
                [
                    h('path', {attrs: {d: filterIcon}}),
                ]
            );
        },
        createFilterView(h) {
            return h(
                FilterView,
                {
                    props: {
                        baseData: this.dataWrap.primeList,
                        column: this.prop,
                        /*用于传入filterview 格式化列表的值*/
                        valueFormat: this.$scopedSlots,
                    },
                    on: {
                        'update:select': this.filterDataFun,
                    }
                },
                [this.createFilterIcon(h)]
            );
        },
        createResizeView(h) {
            return h('span', {
                staticClass: 'bd-resize-view',
                class: {
                    'bd-resize-active': this.resize.down,
                },
                style: {
                    'right': (-this.resize.move) + 'px'
                },
                on: {
                    mousedown: (e) => {
                        this.resize.downX = e.screenX;
                        this.resize.down = true;
                    }
                }
            });
        },
        resizeMouseMove(e) {
            if (this.resize.down) {
                this.resize.move = e.screenX - this.resize.downX;
                //console.log('resizeMouseMove', e);
            }
        },
        resizeMouseUp(e) {
            if (this.resize.down) {
                this.resize.move = 0;
                let move = e.screenX - this.resize.downX;
                this.resize.down = false;
                this.onResizeHeader(this.prop, move);
            }
        },
        filterDataFun(select, column, isFilter) {
            this.isFilterData = isFilter;
            this.onFilter(select, this.prop);
        },
        sortClickFun() {
            let order = '';
            switch (this.sortObj.order) {
                case 'asc':
                    order = 'desc';
                    break;
                case 'desc':
                    order = '';
                    break;
                default:
                    order = 'asc';
                    break;
            }
            this.onSort(order, this.prop);
        }
    }
}
