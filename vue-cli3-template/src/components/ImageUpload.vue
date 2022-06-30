<template>
    <el-upload
        class="avatar-uploader"
        :action="action"
        :data="postData"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <img v-if="tmpUrl" :src="$store.getters.host + tmpUrl" class="avatar" :title="image ? '点击上传修改' : '点击选择文件'">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
    export default {
        name: "ImageUpload",
        props: ['action', 'size', 'suffix', 'image', 'postData'],
        data() {
            return {
                tmpUrl: null,
            }
        },
        watch: {
            image(v) {
                if (v) {
                    this.tmpUrl = v;
                }
            }
        },
        methods: {
            handleSuccess(res, file) {
//               console.log('upload file response:', res);
                if (res.code == 0) {
                    this.$emit('update:image', res.data.source_path);
                } else {
                    this.$error(res.msg);
                }
                //this.tmpUrl = URL.createObjectURL(file.raw);
            },
            beforeUpload(file) {
                if (!this.$t.TypeFilter(this.suffix, file.name, ';')) {
                    this.$error('文件格式不正确!');
                    return false;
                }

                if (file.size / 1024 > this.size) {
                    this.$error('文件大小超过限制!');
                    return false;
                }

                return true;
            }
        }
    }
</script>

<style lang="less">
    @size: 80px;

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: @size;
        height: @size;
        line-height: @size;
        text-align: center;
    }

    .avatar {
        width: @size;
        height: @size;
        display: block;
    }
</style>
