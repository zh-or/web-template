<template>
    <div class="design-view cf">
        <div class="mobile-wrap fl">
            <div class="mobile-iframe ">
                <div class="dynamic">
                    <component v-for="(ctl, index) in controls"
                               :key="'k-' + index"
                               :is="ctl.view"
                               :index="index"
                               :name="ctl.name"
                               :edit="ctl.edit"
                               :draggable="ctl.edit"
                               :config.sync="ctl.config"
                               :class="{'active': ctl.active}"
                               v-model="ctl.value"
                               title="拖动更换位置"
                               @click.native="selectControl(ctl, index)"
                               @dragstart.native="dragStart(ctl, index)"
                               @dragend.native="dragEnd(ctl, index)"
                               @dragover.native.prevent
                               @drop.native="drop(ctl, index)"
                    ></component>
                </div>
                <div class="add-btn-wrap">
                    <select @change="addControl" v-model="selectCtl">
                        <option v-for="(item, index) in allControls"
                                :value="index"
                                :key="'k-' + index"
                        >添加 {{item.name}}
                        </option>
                    </select>
                    <button @click="test">测试</button>&nbsp;
                </div>
            </div>
        </div>
        <div class="arg-setting-view fl">
            <el-form label-width="100px" v-if="nowSelectIndex != -1">
                <template v-for="(ds, index) in controls[nowSelectIndex].design">
                    <el-form-item v-if="ds.type == 'text'" :label="ds.label">
                        <el-input v-model="ds.val"
                                  :placeholder="ds.title"
                        ></el-input>
                    </el-form-item>

                    <el-form-item v-else-if="ds.type == 'checkbox'" :label="ds.label">
                        <el-checkbox v-model="ds.val">{{ds.title}}</el-checkbox>
                    </el-form-item>

                    <template v-else-if="ds.type == 'multiple'">
                        <el-form-item v-for="(v, j) in ds.val"
                                      :key="'k-' + j"
                                      :label="ds.label">
                            <el-input v-model="ds.val[j]"
                                      :placeholder="ds.title"
                            ></el-input>
                        </el-form-item>
                        <div class="text-center pd10">
                            <el-button size="small"
                                       type="primary"
                                       @click="ds.val.push('');"
                            >添加选项
                            </el-button>
                        </div>
                    </template>
                </template>
            </el-form>
            <div class="text-center pd10" v-if="nowSelectIndex != -1">
                <el-button type="danger" @click="deleteControl">删除组件</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {getConfig, getControls, getDesign} from './index.js';

    export default {
        name: "DesignView",
        data() {
            let allControls = [];

            getControls().forEach(ctl => {
                allControls.push({
                    ...ctl,
                    active: false,
                    edit: true,
                    value: '',
                })
            });
            console.log('all controls:', allControls);
            return {
                controls: [],
                allControls: allControls,

                selectCtl: '',

                nowSelectIndex: -1, /*当前选择组件所在的下标*/
                sortStart: -1,
            }
        },
        watch: {
            controls: {
                deep: true,
                handler(v) {
                    //console.log('design change:', v);

                    this.copyDesign();
                }
            }
        },
        methods: {
            addControl() {
                let cmd = this.allControls[Number(this.selectCtl)];
                let ctl = {
                    /*每个控件都创建一个对象*/
                    design: getDesign(cmd.view),
                    config: getConfig(cmd.view),
                    ...cmd,
                };
                ctl.value = ctl.config.defaultVal;
                console.log('add control:', {...ctl});
                this.controls.push(ctl);
                this.$forceUpdate();
            },
            selectControl(ctl, index) {
                this.nowSelectIndex = -1;
                this.controls.forEach(c => {
                    c.active = false;
                });
                ctl.active = true;
                this.nowSelectIndex = index;
                this.$forceUpdate();
            },
            copyDesign() {
                if (this.nowSelectIndex != -1) {
                    let ctl = this.controls[this.nowSelectIndex];
                    ctl.design.forEach(d => {
                        ctl.config[d.key] = d.val;
                    });
                    //console.log('copy design', {...ctl});

                    this.$forceUpdate();
                }
            },
            deleteControl() {
                if (this.nowSelectIndex != -1) {
                    this.controls.splice(this.nowSelectIndex, 1);
                    this.nowSelectIndex = -1;
                    this.$forceUpdate();
                } else {
                    this.$waring('错误!');
                }
            },
            dragStart(ctl, index) {
                //console.log('start:', index);
                this.sortStart = index;
            },
            dragEnd(ctl, index) {
                //console.log('end:', index);
            },
            drop(ctl, index) {
                //console.log('drop:', index);
                let tmp = this.controls[this.sortStart];
                this.controls[this.sortStart] = this.controls[index];
                this.controls[index] = tmp;
                this.$forceUpdate();
            },
            test() {
                let output = [];
                this.controls.forEach(ctl => {
                    let obj = {
                        view: ctl.view,
                        name: ctl.name,
                        config: ctl.config,
                        value: ctl.config.defaultVal
                    };
                    output.push(obj);
                });
                //console.log(JSON.stringify(output));

                this.$local.set('test', output);
            }
        }
    }
</script>

<style>

</style>
