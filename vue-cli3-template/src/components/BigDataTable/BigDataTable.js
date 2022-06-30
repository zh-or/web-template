import './style/style.less';
import tools from '@/tools/tools.js'

function nodeIsBdColumn(opts) {
    return opts && (opts.Ctor.options.name == 'BigDataColumn' || opts.tag == 'bd-column');
}

let _textWidthCache = {},
    _cacheSpan = null;
const _columnMinWidth = 10;

function getTextWidth(text) {
    let width = _textWidthCache[text];
    if (typeof width != 'number') {
        if (!text || text.length <= 0) {
            width = _columnMinWidth;
        } else {
            if (!_cacheSpan) {
                _cacheSpan = document.createElement('span');
                _cacheSpan.style.display = 'inline-block';
                _cacheSpan.style.position = 'fixed';
                _cacheSpan.style.opacity = '0';
                _cacheSpan.style.top = '0';
                _cacheSpan.style.zIndex = -1;
                document.body.appendChild(_cacheSpan);
            }
            _cacheSpan.innerText = text;
            width = _cacheSpan.offsetWidth;
        }
        _textWidthCache[text] = width;
    }
    return width;
}

const tableAttr = {cellpadding: 0, cellspacing: 0, border: 0};

export default {
    name: 'BigDataTable',
    provide() {
        /*共享数据给子组件, 当前数据只传递到 bd-column */
        return {
            sortObj: this.sortObj,
            dataWrap: this.dataWrap,
            onSort: this.onSortData,
            onFilter: this.onFilterData,
            onResizeHeader: this.onResizeHeader,
            emptyText: this.emptyText,
            resetText: this.resetText,
            resize: this.resize,
        }
    },
    props: {
        data: Array, //数据
        finalData: {
            type: Array,
            default() {
                return [];
            }
        },//最终筛选排序后的数据
        emptyText: {
            type: String,
            default() {
                return '暂无数据';
            }
        },//数据为空时显示
        resetText: {
            type: String,
            default() {
                return '重置';
            }
        },
        stripe: Boolean,//斑马条纹
        border: Boolean,//边框
        highlightCurrentRow: Boolean,//是否能选中列表项
        current: {//当前选中项
            type: Number,
            default() {
                return -1;
            }
        },
        sort: Boolean,//可调整列顺序
        resize: Boolean,//可调整列宽度
        props: {
            type: Object,
            default() {
                /*
                {
                  prop => {
                   sort 动态改变顺序,
                   show 动态控制显示,
                   width 动态控制宽度
                  }
                }
                * */
                return {}
            }
        },//配置
    },
    data() {
        let ConstObj = {
            /*render 用*/
            _columnsList: [
                /* {sort 动态改变顺序, show 动态控制显示, width 动态控制宽度 }*/
            ],
            _contentTableHeight: 0,//内容table总高度
        };
        Object.preventExtensions(ConstObj);
        return {
            ConstObj: ConstObj,
            dataWrap: {
                /*方便 provide 传值*/
                primeList: [],
                showList: []
            },
            DataPos: {//当前显示数据的下标
                start: 0,
                len: 1,
            },
            hoverRowBound: -1,
            isScrolling: false,//滚动时不处理hover事件
            scrollChoke: null,
            sizeInfo: {
                tableWrapHeight: 0,//整个table高度
                tableWrapWidth: 0,//整个table宽度
                tableHeaderHeight: 0,
                rowHeight: 0,//最大行高
                contentTableViewWidth: 0,//table 真实宽度
                contentTableWidth: 0,//内容 table 宽度
                contentTableHeight: 0,//内容 table 高度
                contentTableVisibleHeight: 0,//table内容可视高度

                fixedLeftTableWidth: 0,
                fixedRightTableWidth: 0,

                scrollBarWidth: 15,//滚动条宽度
                scrollLeftPos: 0,//横向滚动条位置
                scrollViewWidth: 0,//横向滚动条宽度
                hasVScrollBar: false,//是否有竖向滚动条
                hasHScrollBar: false,//是否有横向滚动条
                footerViewHeight: 0,//

            },
            sortObj: {
                column: '',
                order: '',
            },
        }
    },
    watch: {
        data() {
            this.buildData();
        },
        'dataWrap.showList': function () {
            this.$emit('update:final-data', this.dataWrap.showList);
        }
    },
    computed: {
        dataViewMarginTop() {
            let mt = this.sizeInfo.rowHeight * this.DataPos.start;
            return mt < 0 ? 0 : mt;
        },
        dataViewMarginBottom() {
            let data = this.dataWrap.showList;
            if (data && data.length > 0) {
                let mb = this.sizeInfo.rowHeight * (data.length - this.DataPos.start - this.DataPos.len);
                return mb < 0 ? 0 : mb;
            }
            return 0;
        },
    },
    created() {
        /**/
        function getScrollWidth() {
            var noScroll, scroll, oDiv = document.createElement("DIV");
            oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
            noScroll = document.body.appendChild(oDiv).clientWidth;
            oDiv.style.overflowY = "scroll";
            scroll = oDiv.clientWidth;
            document.body.removeChild(oDiv);
            return noScroll - scroll;
        }

        //
        this.sizeInfo.scrollBarWidth = getScrollWidth();
        this.buildData();
        //Object.preventExtensions({});
        window.addEventListener('resize', this.windowReSize);
    },
    destroyed() {
        window.removeEventListener('resize', this.windowReSize);
    },
    mounted() {
        /*ref BdTableWrap BdTableHeader BdTableBody
        */
        this.countSize();
    },
    render(h) {
        let {headers, items, maxRowspan, hasFixedLeft, hasFixedRight} = this.parseStructure(h, this.$slots.default || []);

        let scrollLeftPos = this.sizeInfo.scrollLeftPos;
        let scrollViewWidth = this.sizeInfo.scrollViewWidth;//横向滚动条长度
        let scrollBarWidth = this.sizeInfo.scrollBarWidth;//滚动条宽度
        let tableWrapWidth = this.sizeInfo.tableWrapWidth;
        let headerHeight = this.sizeInfo.tableHeaderHeight;
        let footerViewHeight = this.sizeInfo.footerViewHeight;
        let hasVScrollBar = this.sizeInfo.hasVScrollBar;
        let hasHScrollBar = this.sizeInfo.hasHScrollBar;
        let contentTableWidth = this.sizeInfo.contentTableWidth;
        let needShowFixedTable = contentTableWidth >= tableWrapWidth;
        if (contentTableWidth <= tableWrapWidth) {
            contentTableWidth = (hasVScrollBar ? (tableWrapWidth - scrollBarWidth) : tableWrapWidth) + 'px';
        } else {
            contentTableWidth = contentTableWidth + 'px';
        }

        let fixedTableBottom = (hasHScrollBar ? scrollBarWidth : 0) + 'px';
        if (!hasVScrollBar) {
            // 垂直高度未填满时, 左右浮动的table需要控制底部位置对齐
            fixedTableBottom = (this.sizeInfo.tableWrapHeight - headerHeight - this.sizeInfo.contentTableWrapHeight) + 'px';
        }
        let views = [];
        let bodyChildViews = [this.buildBody(
            h, items,
            this.buildColGroup(h, items, false),
            contentTableWidth,
            'BdDataTable'
        )];
        if (this.dataWrap.showList.length <= 0) {
            //无数据时占位用
            bodyChildViews.push(
                h('div', {
                        staticClass: 'bd-empty-data',
                        style: {width: contentTableWidth}
                    },
                    this.emptyText || this.$t('el.table.emptyText')
                )
            );
        } else if (this.$slots && this.$slots.footer) {
            bodyChildViews.push(
                h('div',
                    {
                        staticClass: 'bd-footer',
                        ref: 'BdFooterView'
                    },
                    [this.$slots.footer]
                )
            );
        }
        views.push(h(
            'div',
            {staticClass: 'bd-main-table', ref: 'BdMainTableWrap'},
            [
                h('div', {staticClass: 'bd-head-wrap', ref: 'BdTableHeadWrap'},
                    [
                        this.buildHeader(
                            h, headers, maxRowspan,
                            this.buildColGroup(h, items, true, true),
                            contentTableWidth,
                            true
                        )
                    ]
                ),
                h('div', {
                        staticClass: 'bd-body-wrap', ref: 'BdTableBodyWrap', on: {scroll: this.dataViewScroll},
                        style: {}
                    },
                    bodyChildViews
                )
            ]
        ));


        if (hasFixedLeft && needShowFixedTable) {
            views.push(h(
                'div',
                {
                    staticClass: 'bd-fixed-left-table',
                    class: {'bd-right-boxshadow': scrollLeftPos > 0},
                    on: {
                        mousewheel: this.fixedTableMouseWheel
                    },
                    style: {
                        width: this.sizeInfo.fixedLeftTableWidth + 'px',
                        bottom: fixedTableBottom,
                        'padding-top': headerHeight + 'px'
                    }
                },
                [
                    h('div', {staticClass: 'bd-head-wrap', ref: 'BdFixedLeftTableHeadWrap'},
                        [
                            this.buildHeader(
                                h, headers, maxRowspan,
                                this.buildColGroup(h, items, true),
                                contentTableWidth
                            )
                        ]
                    ),
                    h('div', {
                            staticClass: 'bd-body-wrap', ref: 'BdFixedLeftTableBodyWrap',
                            style: {
                                'top': headerHeight + 'px',
                                'padding-bottom': footerViewHeight + 'px'
                            }
                        },
                        [
                            this.buildBody(
                                h, items,
                                this.buildColGroup(h, items, false),
                                contentTableWidth
                            )
                        ]
                    )
                ]
            ));

        }

        if (hasFixedRight && needShowFixedTable) {
            views.push(h(
                'div',
                {
                    staticClass: 'bd-fixed-right-table',
                    class: {'bd-left-boxshadow': scrollLeftPos < (scrollViewWidth - tableWrapWidth)},
                    on: {
                        mousewheel: this.fixedTableMouseWheel
                    },
                    style: {
                        width: this.sizeInfo.fixedRightTableWidth + 'px',
                        bottom: fixedTableBottom,
                        right: (hasVScrollBar ? scrollBarWidth : 0) + 'px'
                    }
                },
                [
                    h('div', {staticClass: 'bd-head-wrap', ref: 'BdFixedRightTableHeadWrap'},
                        [
                            this.buildHeader(
                                h, headers, maxRowspan,
                                this.buildColGroup(h, items, true),
                                contentTableWidth
                            )
                        ]
                    ),
                    h('div', {
                            staticClass: 'bd-body-wrap', ref: 'BdFixedRightTableBodyWrap',
                            style: {
                                'top': headerHeight + 'px',
                                'padding-bottom': footerViewHeight + 'px'
                            }
                        },
                        [
                            this.buildBody(
                                h, items,
                                this.buildColGroup(h, items, false),
                                contentTableWidth
                            )
                        ]
                    )
                ]
            ));
        }

        if (hasVScrollBar) {
            views.push(h('div', {
                staticClass: 'bd-cover',
                style: {
                    width: scrollBarWidth + 'px',
                    height: headerHeight + 'px',
                }
            }));
        }

        //console.log('render -> sizeInfo', {...this.sizeInfo});

        return h('div',
            {
                staticClass: 'bd-table',
                ref: 'BdTableWrap',
                class: {
                    'is-border': this.border,
                    'is-resize': this.resize,
                },
                style: {
                    'padding-top': headerHeight + 'px',
                }
            },
            views
        );
    },
    methods: {
        getColumns() {
            return this.ConstObj._columnsList;
        },
        selectItem(bound, e) {
            if (this.highlightCurrentRow) {
                //this.current = bound;
                this.$emit('update:current', bound);
                this.$emit('select', bound, this.dataWrap.showList[bound]);
            }
        },
        windowReSize(e) {
            this.countSize();
            //this.$forceUpdate();
        },
        fixedTableMouseWheel(e) {
            this.dataViewScroll(null, e.deltaY);
            e.stopPropagation();
        },
        dataViewScroll(e, selfY) {
            this.isScrolling = true;
            //节流
            clearTimeout(this.scrollChoke);
            this.scrollChoke = setTimeout(_ => {this.isScrolling = false}, 500);

            let left = this.$refs.BdTableBodyWrap.scrollLeft;
            this.$refs.BdTableHeadWrap.scrollLeft = left;//同步横向滚动条
            let top = this.$refs.BdTableBodyWrap.scrollTop;
            if (selfY) {
                top += selfY;
                this.$refs.BdTableBodyWrap.scrollTop = top;
            }
            if (this.$refs.BdFixedLeftTableBodyWrap) {
                this.$refs.BdFixedLeftTableBodyWrap.scrollTop = top;
            }
            if (this.$refs.BdFixedRightTableBodyWrap) {
                this.$refs.BdFixedRightTableBodyWrap.scrollTop = top;
            }

            let dataLen = this.dataWrap.showList.length;
            this.sizeInfo.scrollLeftPos = left;
            this.DataPos.start = Math.floor(top / this.sizeInfo.rowHeight);
            if(isNaN(this.DataPos.start)){
                //debugger 0 / 0 = NaN
                //console.error('e: NaN', `top:${top}, rowHeight:${this.sizeInfo.rowHeight}`);
                this.DataPos.start = 0;
            }
            if (this.DataPos.start + this.DataPos.len > dataLen) {
                this.DataPos.start = dataLen - this.DataPos.len;
            }
            if(this.DataPos.start  < 0){
                this.DataPos.start = 0;
            }
        },
        countSize() {
            if (this.$refs.BdRow) {
                this.sizeInfo.rowHeight = this.$refs.BdRow.clientHeight;
            }
            this.sizeInfo.contentTableViewWidth = this.$refs.BdDataTable.offsetWidth;
            let t = this.sizeInfo.contentTableWrapHeight;
            this.sizeInfo.contentTableWrapHeight = this.$refs.BdTableBodyWrap.clientHeight;
            if (t != this.sizeInfo.contentTableWrapHeight && this.DataPos.len > 1) {
                this.$forceUpdate();
                //对齐fixed table
            }
            this.sizeInfo.tableHeaderHeight = this.$refs.BdTableHeadWrap.offsetHeight;
            if(this.sizeInfo.tableHeaderHeight <= 0){
                this.sizeInfo.tableHeaderHeight = 37;//set default
            }
            this.sizeInfo.scrollViewWidth = this.$refs.BdTableBodyWrap.scrollWidth;
            this.sizeInfo.tableWrapWidth = this.$refs.BdTableWrap.clientWidth;
            this.sizeInfo.tableWrapHeight = this.$refs.BdTableWrap.clientHeight;
            this.sizeInfo.hasHScrollBar = this.sizeInfo.scrollViewWidth > this.sizeInfo.tableWrapWidth;
            this.sizeInfo.hasVScrollBar = this.sizeInfo.rowHeight * this.dataWrap.showList.length > this.$refs.BdMainTableWrap.clientHeight;

            //console.log(this.$refs.BdTableBodyWrap.scrollHeight, this.$refs.BdTableBodyWrap.clientHeight);
            this.sizeInfo.contentTableVisibleHeight = this.$refs.BdTableWrap.clientHeight - this.sizeInfo.tableHeaderHeight;

            if (this.$refs.BdFooterView) {
                this.sizeInfo.footerViewHeight = this.$refs.BdFooterView.offsetHeight;
            }

            //console.log('countSize -> sizeInfo', {...this.sizeInfo});
        },
        parseStructure(h, nodes) {//解析table结构
            let tableNodes = [];
            let tableHeaders = [],
                tableItems = [],
                hasFixedLeft = false,
                hasFixedRight = false;
            let maxRowspan = 1;//多级表头 行数

            let _props = this.props;

            //排序 列
            if (this.sort) {
                nodes.sort((a, b) => {
                    if (!a.tag || !b.tag) {
                        return 0;
                    }
                    let optA = a.componentOptions,
                        optB = b.componentOptions;
                    if (!optA || !optB || !nodeIsBdColumn(optA) || !nodeIsBdColumn(optB)) {
                        return;
                    }
                    let sortA = _props[optA.propsData.prop];
                    let sortB = _props[optB.propsData.prop];
                    if (sortA && sortB) {
                        return sortA.sort - sortB.sort;
                    }
                    return 0;
                });
            }

            //分类 过滤
            nodes.forEach(node => {
                if (!node.tag) {
                    // v-if == false
                    return;
                }
                let opts = node.componentOptions;
                if (!opts) {//不是组件
                    console.log('未知内容:', node);
                    return;
                }
                if (!nodeIsBdColumn(opts)) {//不是 BigDataColumn 组件
                    return;
                }
                if (opts.propsData) {
                    if (opts.propsData.hasOwnProperty('fixedLeft') && opts.propsData.fixedLeft !== false) {
                        hasFixedLeft = true;
                    }
                    if (opts.propsData.hasOwnProperty('fixedRight') && opts.propsData.fixedRight !== false) {
                        hasFixedRight = true;
                    }
                }
                tableNodes.push(node);
            });

            function parseOneRow(headers, items, arr, lv) {//解析一行表头
                maxRowspan = Math.max(maxRowspan, lv + 1);
                let maxColspan = 0;
                /*
                多级表头
                * */
                let headerRow = null;
                if (headers.length > lv) {
                    headerRow = headers[lv];
                } else {
                    headerRow = [];
                    headers.push(headerRow);
                }
                arr.forEach(item => {
                    if (!item.tag) {
                        // v-if == false
                        return;
                    }
                    let opts = item.componentOptions;

                    let propsObj = _props[opts.propsData.prop];
                    if (propsObj && !propsObj.show) {
                        //console.log('隐藏', item);
                        return;
                    }
                    headerRow.push(item);

                    if (opts.children && opts.children.length > 0) {//处理表头slot
                        let childHeaderRows = opts.children.filter(cHeader => nodeIsBdColumn(cHeader.componentOptions));
                        let len = childHeaderRows.length;
                        if (len > 0) {//多级表头
                            let childMaxColspan = parseOneRow(headers, items, childHeaderRows, lv + 1);
                            childMaxColspan = Math.max(childMaxColspan, len);
                            opts.propsData.colspan = childMaxColspan;//当前表头的跨列数
                            maxColspan += childMaxColspan;//子级可能有多列, 子级的子级又有多列
                        } else {
                            items.push(item);
                        }
                    } else {
                        items.push(item);
                    }
                });
                return maxColspan;
            }

            parseOneRow(tableHeaders, tableItems, nodes, 0);

            let tColumnsList = [];
            tableItems.forEach((item, index) => {
                let opts = item.componentOptions;
                if (opts && opts.propsData) {
                    let propsData = opts.propsData;
                    let fixedLeft = (propsData.hasOwnProperty('fixedLeft') && propsData.fixedLeft !== false);
                    let fixedRight = (propsData.hasOwnProperty('fixedRight') && propsData.fixedRight !== false);

                    let obj = {
                        label: propsData.label,
                        prop: propsData.prop,
                        sort: tColumnsList.length,
                        hasSortView: propsData.hasOwnProperty('sort') && propsData.sort !== false,
                        hasFilterView: propsData.hasOwnProperty('filter') && propsData.filter !== false,
                        realWidth: getTextWidth(propsData.label) + 20, /*text width, 20 is padding*/
                        propWidth: Number(propsData.width) || 0,
                        resize: 0,//拖动改变大小
                        useWidth: 0,
                        /*固定列不能拖动*/
                        fixed: fixedLeft || fixedRight,
                        fixedLeft: fixedLeft,
                        fixedRight: fixedRight,
                    };
                    if (obj.hasSortView) {
                        obj.realWidth += 24;
                    }
                    if (obj.hasFilterView) {
                        obj.realWidth += 25;
                    }
                    let memObj = this.ConstObj._columnsList[index];
                    if (memObj) {
                        obj.resize = memObj.resize;
                    }
                    tColumnsList.push(obj);
                } else {
                    //console.error('->', item);
                }

            });
            this.ConstObj._columnsList = tColumnsList;
            //console.log('width:', tColumnsList);
            return {
                headers: tableHeaders,
                items: tableItems,
                maxRowspan: maxRowspan,
                hasFixedLeft: hasFixedLeft,
                hasFixedRight: hasFixedRight,
            }
        },
        buildColGroup(h, items, isHeader, needGutter) {
            let cols = [];
            let columnsList = this.ConstObj._columnsList,
                columnsListLen = columnsList.length,
                contentTableWidth = 0,
                fixedLeftWidth = 0,
                fixedRightWidth = 0,
                hasVScrollBar = this.sizeInfo.hasVScrollBar,
                hasHScrollBar = this.sizeInfo.hasHScrollBar,
                maxWidth = this.sizeInfo.tableWrapWidth,
                surplus = 0,
                unWidthCount = 0,
                oneWidth = 0;

            if (hasVScrollBar) {//有滚动条时减去滚动条宽度
                maxWidth = maxWidth - this.sizeInfo.scrollBarWidth;
            }
            surplus = maxWidth;
            if (surplus > 0) {
                for (let i = 0; i < columnsListLen; i++) {
                    let columnInfo = columnsList[i];
                    if (columnInfo.propWidth) {
                        surplus -= (columnInfo.propWidth || columnInfo.realWidth);
                    } else {
                        unWidthCount++;
                    }
                }
            }
            if (surplus > 0) {
                oneWidth = Math.ceil(surplus / unWidthCount);
            }

            items.forEach((item, index) => {
                let columnInfo = columnsList[index],
                    tWidth = 0;
                if (columnInfo.propWidth > 0) {
                    tWidth = columnInfo.propWidth;
                } else {
                    tWidth = Math.max(oneWidth, columnInfo.realWidth);
                }
                tWidth += columnInfo.resize;//拖动改变的宽度
                if (columnInfo.fixedLeft) {
                    fixedLeftWidth += tWidth || 0;
                }
                if (columnInfo.fixedRight) {
                    fixedRightWidth += tWidth || 0;
                }

                columnInfo.useWidth = tWidth;
                cols.push(h('col', {attrs: {width: tWidth}}));
                if (tWidth > 0) {
                    contentTableWidth += tWidth;
                }
            });
            //console.log('contentTableWidth :', contentTableWidth );
            this.sizeInfo.contentTableWidth = contentTableWidth;
            this.sizeInfo.fixedLeftTableWidth = fixedLeftWidth;
            this.sizeInfo.fixedRightTableWidth = fixedRightWidth;
            if (isHeader && needGutter && this.sizeInfo.hasVScrollBar) {
                cols.push(h('col', {attrs: {width: this.sizeInfo.scrollBarWidth}}));
            }

            return h('colgroup', null, cols);
        },
        buildHeader(h, headers, maxRowspan, colgroup, width, needGutter) {//表头table
            let childs = [colgroup], theads = [];

            headers.forEach((row, index) => {
                let columns = [];
                row.forEach(column => {
                    let opts = column.componentOptions;
                    columns.push(h(
                        'th',
                        {
                            staticClass: 'bd-head-item',
                            class: {
                                'bd-hidden':
                                    !((opts.propsData.hasOwnProperty('fixedLeft') && opts.propsData.fixedLeft !== false) ||
                                        (opts.propsData.hasOwnProperty('fixedRight') && opts.propsData.fixedRight !== false))
                            },
                            attrs: {
                                rowspan: opts.propsData.colspan > 0 ? null : (maxRowspan - index),
                                colspan: opts.propsData.colspan
                            },
                        },
                        [column]
                    ));
                });
                if (needGutter && this.sizeInfo.hasVScrollBar && columns.length > 0) {
                    columns.push(h('td',
                        {
                            staticClass: 'bd-head-gutter bd-head-item',
                            attrs: {rowspan: maxRowspan}
                        }
                    ));
                }
                theads.push(h(
                    'tr',
                    {staticClass: 'bd-head-row'},
                    columns
                ))
            });

            childs.push(h('thead', null, theads));

            return h(
                'table',
                {
                    staticClass: 'bd-head',
                    attrs: tableAttr,
                    ref: 'BdTableHeader',
                    style: {
                        'width': width,
                    }
                },
                childs
            );
        },
        buildBody(h, items, colgroup, width, ref) {//内容table
            let rows = [];
            let contentTableVisibleHeight = this.sizeInfo.contentTableVisibleHeight,
                rowHeight = this.sizeInfo.rowHeight,
                data = this.dataWrap.showList,
                dataLen = data.length;
            if (data && data.length > 0) {
                let len = 1;
                if (contentTableVisibleHeight > 0 && rowHeight > 1) {
                    len = Math.ceil(contentTableVisibleHeight / rowHeight) + 4;
                }
                if (len > 1) {
                    this.$nextTick(this.countSize);
                }
                len = Math.min(len, dataLen - this.DataPos.start);
                if(len < 0){
                    len = 0;
                    //debugger
                }
                this.DataPos.len = len;
                let start = this.DataPos.start;
                let end = start + len;
                //console.log(start, end, end - start);
                for (let i = start; i < end; i++) {
                    let itemData = data[i];
                    let columns = [];
                    items.forEach((item, cIndex) => {
                        let columnObj;
                        if (item.data.scopedSlots) {
                            try {
                                columnObj = item.data.scopedSlots.default({row: itemData, index: i});
                            } catch (e) {
                                console.error('scope slot error:', e);
                            }
                        } else if (item.componentOptions && item.componentOptions.children) {
                            columnObj = item.componentOptions.children.filter(x => x.data && x.data.slot != 'title');
                        }

                        if (columnObj === undefined || columnObj.length <= 0) {
                            columnObj = tools.ObjGet(itemData, item.componentOptions.propsData.prop);
                        }

                        let opts = item.componentOptions;
                        columns.push(h('td',
                            {
                                staticClass: 'bd-body-item',
                                key: 'td-' + i + '-' + cIndex,
                                attrs: {
                                    'key-attr': 'td-' + i + '-' + cIndex,
                                },
                                class: {
                                    'bd-hidden':
                                        !((opts.propsData.hasOwnProperty('fixedLeft') && opts.propsData.fixedLeft !== false) ||
                                            (opts.propsData.hasOwnProperty('fixedRight') && opts.propsData.fixedRight !== false))
                                },
                            },
                            columnObj
                        ));
                    });

                    let tr = h(
                        'tr',
                        {
                            staticClass: 'bd-body-row',
                            class: {
                                'bd-select-row': this.current == i,
                                'bd-hover-row': this.hoverRowBound == i,
                            },
                            on: {
                                click: this.selectItem.bind(this, i),
                                mouseover: e => {
                                    if(this.isScrolling) {
                                        return ;
                                    }
                                    this.hoverRowBound = i
                                },
                                mouseout: e => {
                                    if(this.isScrolling) {
                                        return ;
                                    }
                                    this.hoverRowBound = -1
                                },
                            },
                            attrs: {
                                'key-attr': 'tr-' + i,
                            },
                            ref: 'BdRow',
                            key: 'tr-' + i,
                        },
                        columns
                    );
                    rows.push(tr);
                }

            }
            let childs = [colgroup, h('tbody', {ref: 'BdTableTBody'}, rows)];

            return h(
                'table',
                {
                    staticClass: 'bd-body',
                    ref: ref,
                    attrs: tableAttr,
                    class: {
                        'is-stripe': this.stripe,
                    },
                    style: {
                        'width': width,
                        'margin-top': this.dataViewMarginTop + 'px',
                        'margin-bottom': this.dataViewMarginBottom + 'px',
                    }
                },
                childs
            );
        },
        buildData() {
            this.dataWrap.primeList = this.data.filter(x => true);
            this.dataWrap.showList = this.data.filter(x => true);
            this.$nextTick(_ => {
                this.countSize();
            });
        },
        onSortData(order, column) {
            this.sortObj.order = order;
            this.sortObj.column = column;
            if (order == '') {
                this.dataWrap.showList = this.dataWrap.primeList.filter(x => true);
            } else {
                tools.sortArray(order, this.dataWrap.showList, column);
            }
        },
        onFilterData(selectArr, column) {
            let tmp = [];
            this.dataWrap.primeList.forEach(item => {
                if (selectArr.some(x => tools.ObjGet(x, column) == tools.ObjGet(item, column))) {
                    tmp.push(item);
                }
            });
            this.dataWrap.showList = tmp;
        },
        onResizeHeader(prop, size) {
            let obj = this.ConstObj._columnsList.filter(x => x.prop == prop)[0];
            if (obj) {
                obj.resize += size;
                //有可能不会触发更新, 手动触发
                this.$forceUpdate();
                this.$nextTick(_ => {
                    this.countSize();
                });
                //console.log('resize header', obj, prop, size);
            } else {
                console.warn('未定义prop的列不能拖动改变大小');
            }

        }

    }
}
