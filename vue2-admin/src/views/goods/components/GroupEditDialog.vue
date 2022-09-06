<template>
    <el-dialog :visible.sync="show"  :title="!obj ? '新建分组' : '编辑分组'" width="600px">
        <el-form :model="data.form"
                 :rules="data.rules"
                 ref="form"
                 :disabled="props.disabled"
                 label-width="120px"
                 class="dialog-form">

            <el-form-item label="分组名称:" prop="groupName">
                <el-input v-model="data.form.groupName" maxlength="100" :show-word-limit="true" placeholder="请输入分组名称"/>
            </el-form-item>
            <el-form-item label="排序值:" prop="iorder">
                <el-input v-model="data.form.iorder" type="number" placeholder="请输入排序值"/>
            </el-form-item>
            <el-form-item label="分组图标:">
                <FileSelect :disabled="props.disabled"
                            v-model:fileList="data.form.iconFile"
                            :limit="1"
                            :isPic="true"/>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
                <el-input v-model="data.form.remark" type="textarea" :rows="4" maxlength="200" :show-word-limit="true" placeholder="请输入备注"/>
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
    import {
        obj2FormData
    } from "@/utils/utils";

    const emit = defineEmits(['update']);
    const form = ref(null);
    const props = defineProps({
        visible: Boolean,
        obj: Object,
        disabled: {
            type: Boolean,
            default: false
        }
    })
    const show = ref(false);
    const loading = ref(false);
    const data = reactive({
        form: {
            groupName: '',
            iorder: '',
            remark: '',
            iconFile: null,
        },
        rules: {
            groupName: getRule('请输入分组名称'),
            iorder: getRule('请输入排序值'),
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
                data.form.groupName = props.obj.groupName;
                data.form.iorder = props.obj.iorder;
                data.form.remark = props.obj.remark;
                data.form.iconFile = props.obj.iconFile;/*{
                    isDel: false,
                    isNew: false,
                    file: null,
                    url: props.obj.logo,
                    name: props.obj.logo,
                    id: '',
                };*/
            } else {

                data.form.groupName = '';
                data.form.iorder = '';
                data.form.remark = '';
                data.form.iconFile = null;
            }
        }
    })

    function confirmEditFun() {
        form.value.validate(async _ => {
            if (_) {
                try {
                    loading.value = true;
                    let form = {
                        groupName: data.form.groupName,
                        iorder: data.form.iorder,
                        remark: data.form.remark,
                    }
                    if (data.form.iconFile && data.form.iconFile.isNew) {
                        form.iconFile = data.form.iconFile.file;
                    }
                    form = obj2FormData(form);
                    if (props.obj) {
                        form.append('groupId', props.obj.groupId);
                        await $api.editGroup(form);
                    } else {
                        await $api.addGroup(form);
                    }
                    emit('update');
                    $modal.success('操作成功');
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

</style>
