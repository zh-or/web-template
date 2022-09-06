<template>
    <div class="file-select clearfix" :len="data.select.length" :l="props.limit" :h="data.select.length < props.limit">
        <template v-if="isPic">
            <template v-for="(item, i) in data.select">
                <div class="img-view"
                     v-if="!item.isDel">
                    <img :src="item.url" :n="item.name"/>

                    <div class="del-mask"
                         v-if="!props.disabled">
                        <span
                                class="del-icon"
                                @click="deleteFile(item, i)"
                        >
                            <svg-icon name="delete"/>
                        </span>
                    </div>
                </div>
            </template>

            <div class="img-select"
                 v-if="selectLen < props.limit && !props.disabled"
                 @click="selectFile">
                <svg-icon name="plus"/>
            </div>
        </template>
        <template v-else>
            <el-button type="primary">选取文件</el-button>
        </template>

        <!-- 上传提示 -->
        <div class="file-select-tip" v-if="showTip">
            <template  v-if="fileSize || inFileType">请上传</template>
            <template v-if="fileSize">大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
            <template v-if="inFileType"> 格式为 <b style="color: #f56c6c">{{ inFileType.join(", ") }}</b></template>
            <template  v-if="fileSize || inFileType">的文件</template>
            <span v-if="tip">, {{tip}}</span>
        </div>

        <input type="file"
               class="file"
               :multiple="props.limit > 1"
               @change="changeFile"
               ref="input"/>

    </div>
</template>

<script setup>
    import {
        $api,
        $modal,
        $notify,
        $store,
        $router,
        getImgUrl,
        downloadXhr,
    } from '@/autoImportUtils/index.js';
    const t = {
        isDel: false,
        isNew: true,
        file: null,
        url: '',
        name: '',
        id: '',
    }
    const defFileType = ["doc", "xls", "ppt", "txt", "pdf"];
    const emit = defineEmits(['delete']);
    const selectLen = computed(_ => {
        return data.select.filter(_ => !_.isDel).length;
    })

    let props = defineProps({
        tip: String,
        isShowTip: {
            type: Boolean,
            default: true,
        },
        // 大小限制(MB)
        fileSize: {
            type: Number,
            default: 5,
        },
        // 文件类型, 例如['png', 'jpg', 'jpeg']
        fileType: {
            type: Array,
            default: () => ["doc", "xls", "ppt", "txt", "pdf"],
        },
        fileList: {
            type: [Array, Object],
            default: _ => [],
        },
        limit: {
            type: Number,
            default: 1,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        isPic: {
            type: Boolean,
            default: false,
        }
    });
    const input = ref(null);

    let inFileType = props.fileType;
    if(props.isPic && inFileType[0] === 'doc' && inFileType[inFileType.length - 1] === 'pdf') {
        inFileType = ['png', 'jpg', 'jpeg'];
    }
    const showTip = computed(
        () => props.isShowTip && (inFileType || props.fileSize)
    );

    const data = reactive({
        select: [],
    });

    function buildSelectVal() {
        console.log('copy -->', props.fileList, toRaw(props.fileList));
        data.select = Array.isArray(props.fileList)
            ? props.fileList : (props.fileList ? [props.fileList] : []);
    }

    buildSelectVal();

    watch(_ => props.fileList, buildSelectVal);

    function selectFile() {
        if (props.disabled) {
            return;
        }
        if (selectLen.value >= props.limit) {
            $modal.warning(`上传文件数量不能超过 ${props.limit} 个!`)
            return;
        }
        input.value.click();
    }

    function deleteFile(f, i) {
        if (props.disabled) {
            return;
        }
        let obj = data.select[i];
        if (obj.isNew) {
            data.select.splice(i, 1);
        } else {
            obj.isDel = true;
        }
        emit('delete', obj);

        notifyChange();
    }

    function validateFile(file) {
        // 校检文件类型
        if (inFileType.length > 0) {
            let fileExtension = "";
            if (file.name.lastIndexOf(".") > -1) {
                fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
            }
            const isTypeOk = inFileType.some((type) => {
                if (file.type.indexOf(type) > -1) return true;
                if (fileExtension && fileExtension.indexOf(type) > -1) return true;
                return false;
            });
            if (!isTypeOk) {
                $modal.msgError(`文件格式不正确, 请上传${inFileType.join("/")}格式文件!`);
                return false;
            }
        }
        // 校检文件大小
        if (props.fileSize) {
            const isLt = file.size / 1024 / 1024 < props.fileSize;
            if (!isLt) {
                $modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`);
                return false;
            }
        }
        return true;
    }

    function changeFile() {
        let fs = input.value.files;
        console.log('select file:', fs, fs.length);
        for(let i = 0; i < fs.length; i ++) {
            if (selectLen.value >= props.limit) {
                $modal.warning(`上传文件数量不能超过 ${props.limit} 个!`)
                break;
            }

            if(!validateFile(fs[i])) {
                continue;
            }

            let obj = reactive({
                isDel: false,
                isNew: true,
                file: fs[i],
                url: '',
                name: fs[i].name || '',
                id: '',
            });
            data.select.push(obj);
            const reader = new FileReader();
            reader.readAsDataURL(fs[i]);
            reader.onload = () => {
                obj.url = reader.result;
            };
            console.log('push:', obj, data.select)
        }
        input.value.value = '';
        notifyChange();
    }

    function notifyChange() {

        let obj;
        if (props.limit <= 1) {
            obj = selectLen.value > 0 ? data.select[0] : null;
        } else {
            obj = data.select;
        }
        console.log('notify', obj)
        emit('update:fileList', obj);
    }
</script>

<style lang="scss">
    .file-select {
        display: flex;
        flex-wrap: wrap;

        .img-view {
            position: relative;
            overflow: hidden;

            img {
                position: relative;
                z-index: 1;
                max-height: 100%;
                max-width: 100%;
            }

            .del-mask {
                transition: opacity 100ms;
                opacity: 0;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: rgba(0, 0, 0, .5);
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;

                .del-icon {
                    cursor: pointer;
                    color: #fff;
                }
            }

            &:hover {
                .del-mask {
                    opacity: 1;
                }
            }
        }

        .img-select {
            cursor: pointer;
            &:hover {
                border-color: #1c84c6;
            }
        }

        .img-view, .img-select {
            height: 148px;
            width: 148px;
            margin-right: 10px;
            margin-bottom: 10px;
            border: 1px dashed #cdd0d6;
            border-radius: 4px;
            background-color: #fafafa;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .file {
            display: none;
        }

        .file-select-tip {
            width: 100%;
        }
    }
</style>
