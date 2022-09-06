<template>
    <el-dialog :visible.sync="show"
               :title="!obj ? '新建规格' : '编辑规格'"
               v-loading="loading" >
        <el-form :model="data.form"
                 :rules="data.rules"
                 ref="form"
                 :disabled="props.disabled"
                 label-width="120px"
                 class="dialog-form">

            <el-form-item label="规格名称:" prop="specicationName">
                <el-input v-model="data.form.specicationName" :disabled="inline" max="10" placeholder="请输入规格名称"/>
            </el-form-item>
            <el-form-item label="排序值:" prop="iorder">
                <el-input v-model="data.form.iorder" :disabled="inline" type="number" placeholder="请输入排序值"/>
            </el-form-item>
            <el-form-item label="规格值:" prop="values">
                <div class="specs-wrap">
                    <table class="table">
                        <tr>
                            <th >排序值</th>
                            <th>规格值</th>
                            <th>
                                <el-button type="primary"
                                           :disabled="props.disabled"
                                           @click="data.form.values.push({iorder:'', specicationValueName: ''})">新增</el-button>
                            </th>
                        </tr>
                        <tr v-if="data.form.values.length <= 0">
                            <td colspan="6">
                                <div class="none">请添加规格 ~</div>
                            </td>
                        </tr>
                        <tbody>
                        <tr v-for="(item, i) in data.form.values"
                            :key="i + ''">
                            <td><input type="number" v-model="item.iorder" :disabled="props.disabled" placeholder="请输入排序值"/></td>
                            <td><input v-model="item.specicationValueName" :disabled="props.disabled" placeholder="请输入规格值"/></td>
                            <td>
                                <el-button type="text"
                                           :disabled="props.disabled"
                                           @click="delSpecs(item, i)"
                                >删除</el-button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
                <el-input v-model="data.form.remark" :disabled="inline" type="textarea" :rows="4" maxlength="200" :show-word-limit="true" placeholder="请输入备注"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer" v-if="!props.disabled">
                <el-button type="primary" @click="confirmEditFun">确 定</el-button>
                <el-button @click="show = false">取 消</el-button>
            </div>
            <div class="dialog-footer" v-else>
                <el-button type="primary" @click="show = false">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="brand-dialog">
    import {getRule} from "@/utils/utils";


    import {
        $api,
        $modal,
        $notify,
        $store,
        $router,
        getImgUrl,
        downloadXhr,
    } from '@/autoImportUtils/index.js';

    const emit = defineEmits(['update']);
    const form = ref(null);
    const props = defineProps({
        visible: Boolean,
        obj: Object,
        disabled: {
            type: Boolean,
            default: false
        },
        inline: {
            type: Boolean,
            default: false,
        }
    })
    const show = ref(false);
    const loading = ref(false);
    const data = reactive({
        dels: [],
        form: {
            specicationName: '',
            iorder: '',
            remark: '',
            values: [],
        },
        rules: {
            specicationName: getRule('请输入规格名称'),
            iorder: getRule('请输入排序值'),
            values: getRule('请添加规格值'),
        }
    });
    show.value = !!props.visible.value;
    watch(show, _ => {
        emit('update:visible', _);
    })
    watch(() => props.visible, _ => {
        show.value = _;
        if(_) {
            if (props.obj) {
                data.form.specicationName = props.obj.specicationName;
                data.form.iorder = props.obj.iorder;
                data.form.remark = props.obj.remark;
                data.form.values = props.obj.values;

            } else {
                data.form.specicationName = '';
                data.form.iorder = '';
                data.form.remark = '';
                data.form.values = [];
            }
            data.dels = [];
        }
    })

    function delSpecs(item, i) {
        data.form.values.splice(i, 1);
        if(item.specicationValueId) {
            data.dels.push(item.specicationValueId);
        }
    }

    function confirmEditFun() {
        form.value.validate(async _ => {
            if (_) {
                try {
                    loading.value = true;

                    if (props.obj) {
                        let form = {
                            specicationId: props.obj.specicationId,
                            specicationName: data.form.specicationName,
                            iorder: data.form.iorder,
                            remark: data.form.remark,
                            values: data.form.values,
                            "addValues": data.form.values.filter(_ => !_.specicationValueId),
                            "deleteValueIds": data.dels,
                            "editValues": data.form.values.filter(_ => _.specicationValueId),
                        }


                        await $api.editSpecs(form);
                    } else {
                        await $api.addSpecs(data.form);
                    }
                    $modal.success('操作成功');
                    emit('update');
                    loading.value = false;
                    show.value = false;
                } catch(e) {
                    console.error(e);
                    loading.value = false;
                }
            }
        })
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin.scss';

    .specs-wrap {
        @include table(#dcdfe6);
        width: 100%;
        th {
            font-weight: 500;
            width: 100px;
            padding: 4px 0!important;
            background-color: #f2f2f2;
        }

        td {
            padding: 0 10px !important;
            text-align: center;
        }

        input {
            width: 100%;
            display: inline-block;
            border: 0;
            text-align: center;
            background-color: transparent;

            &::-webkit-input-placeholder, &::-moz-placeholder, &:-moz-placeholder, &:-ms-input-placeholder{
                color: #a8abb2;
            }

            &:focus {
                outline: none;
            }
        }
    }
</style>
