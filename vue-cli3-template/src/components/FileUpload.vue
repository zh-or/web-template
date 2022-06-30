<template>
    <el-upload
        :action="action"
        :show-file-list="false"
        :on-success="handleSuccess"
        v-loading="uploading"
        :before-upload="beforeUpload">
        <el-button slot="trigger" type="primary" class="btn-primary">{{btn || '上传文件'}}</el-button>
        <span v-if="uploadFile" class="file-name">{{uploadFile.name}}</span>
    </el-upload>
</template>

<script>
    export default {
        name: "FileUpload",
        props: {
            action: {
                type: String
            },
            size: {
                type: Number,
                default: () => {
                    return 0;
                }
            },
            suffix: {
                type: String
            },
            btn: {
                type: String
            }
        },
        data(){
            return {
                uploadFile: null,
                uploading: false,
            }
        },
        methods: {
            handleSuccess(res, file){
                console.log('upload file response:', res);
                this.uploadFile = file;
                this.uploading = false;
            },
            beforeUpload(file){
                if(this.uploading){
                    return false;
                }
                if(this.suffix && !this.$t.TypeFilter(this.suffix, file.name, ';')){
                    this.$error('文件格式不正确!');
                    return false;
                }

                if(Number(this.size) > 0 && file.size / 1024 > this.size){
                    this.$error('文件大小超过限制!');
                    return false;
                }
                this.uploading = true;
                return true;
            }
        }
    }
</script>

<style lang="less" scoped>
.file-name{
    padding-left: 10px;
}
</style>
