<template>
    <el-popover
            placement="top"
            trigger="click">
        <div class="pop-content">
            <div class="col1">
                <div class="item" v-for="left in allLeft" @click="selectChild(left)">
                    {{left.label}}
                </div>
            </div>
            <div class="col1">
                <div class="item" v-for="left in allRight">
                    <el-checkbox v-model="left.select" @change="selectParent">{{left.label}}</el-checkbox>
                </div>
            </div>
        </div>
        <div class="cascader" slot="reference">
            <span class="cc-none" v-if="select.length <= 0">请选择</span>
            <el-tag
                    v-for="(tag, index) in select"
                    :key="tag.label + index"
                    effect="plain"
                    :disable-transitions="true"
                    @close="removeSelect(tag)"
                    closable>
                {{tag.label}}
            </el-tag>
        </div>
    </el-popover>

</template>

<script>
    export default {
        name: "Cascader",
        props: {
            options: {
                type: Array,
                default() {
                    return [];
                }
            },
            value: {},
            disabled: Boolean,
            clearable: Boolean
        },
        data() {
            return {
                select: [],
                allLeft: [],
                allRight: [],
            }
        },
        watch: {
            options() {
                this.buildData();
            },
            value(){
                this.buildData();
            }
        },
        mounted() {
            this.buildData();
        },
        methods: {
            buildData() {
                this.allRight = [];
                this.allLeft = [];
                this.select = [];
                let val = Array.isArray(this.value) ? this.value : [];
                this.options.forEach(item => {
                    let children = item.children.map(_ => {
                        let isSelect = val.some(v => v[1] == _.value);
                        if(isSelect){
                            this.select.push(_);
                        }
                        return {
                            label: _.label,
                            select: isSelect,
                            obj: _,
                        }
                    });
                    this.allLeft.push({
                        label: item.label,
                        select: children.every(c => c.select),
                        obj: item,
                        children: children
                    });
                    this.allRight = this.allRight.concat(children);
                });
            },
            selectChild(left) {
                left.select = !left.select;
                left.children.forEach(_ => {
                    _.select = left.select;
                })
            },
            selectParent() {
                this.allLeft.forEach(_ => {
                    _.select = _.children.every(x => x.select);
                });
                this.buildValue();
            },
            buildValue() {
                this.select = [];
                let val = [];
                this.allLeft.forEach(_ => {
                    _.children.forEach(c => {
                        if(c.select) {
                            this.select.push(c.obj);
                            val.push([_.obj.value, c.obj.value]);
                        }
                    })
                });
                this.$emit('input', val);
            },
            removeSelect(tag) {
                this.allLeft.forEach(_ => {
                    _.children.forEach(c => {
                        if(c.obj === tag) {
                            c.select = false;
                        }
                    })
                });
                this.buildValue();
            }
        }
    }
</script>

<style lang="less">
    .cascader {
        display: inline-block;
        border: 1px solid #f2f2f2;
        border-radius: 4px;
        padding: 0px 10px;
        text-align: center;
        cursor: pointer;
        word-break: break-all;

        .cc-none {
            color: #867d7c;
            min-width: 100px;
        }

        .el-tag {
            margin-right: 10px;
        }
    }

    .pop-content {
        width: 300px;

        .col1 {
            vertical-align: top;
            display: inline-block;
            max-height: 100px;
            overflow-y: auto;
            width: 50%;
            padding: 0 10px;

            & + .col1 {
                border-left: 1px solid #f2f2f2;
            }

            .item {
                padding: 3px 0;
                cursor: pointer;
            }
        }
    }
</style>
