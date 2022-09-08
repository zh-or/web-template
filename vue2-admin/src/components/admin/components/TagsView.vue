<template>
    <div class="tags-view-wrap">
        <el-scrollbar wrap-class="">
            <div class="tags-view box-shadow">
                <div v-for="tag in tags"
                     :key="tag.fullPath"
                     class="tag"
                     :class="{'current': tag.fullPath === currentFullPath}"
                     @click="goRouter(tag)">
                    <span>{{tag.meta.title}}</span>
                    <span v-if="tags.length > 1 && !tag.meta.affix" @click.prev="closeTag(tag)">
                    <svg-icon name="cancel" />
                </span>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup>
    import $store from '@/store';
    import $router from '@/router';

    const tags = computed(_ => {
        return $store.getters.tags;
    });

    const currentFullPath = computed(_ => {
        const route = $router.app.$route;
        return route.fullPath;
    });

    function closeTag(item) {
        $store.dispatch('removeTag', item);
        $router.back();
    }

    function goRouter(item) {
        $router.push(item.fullPath);
    }

</script>
<script>
    export default {
        name: "TagsView",
    }
</script>

<style lang="scss">
    @import "~@/assets/css/var.scss";
.tags-view {
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .tag {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;

        .svg-icon {
            margin-left: 8px;

            &:hover {
                background-color: #ddd;
                border-radius: 50%;
            }
        }

        &.current {
            background-color: $main-theme;
            border-color: $main-theme;
            color: #fff;

            &:before {
                content: "";
                background: #fff;
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: relative;
                margin-right: 2px;
            }
        }
    }
}
</style>
