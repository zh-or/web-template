<script >
import {
    reactive, ref, useTemplateRef, computed, nextTick, watch,
    onMounted, onUnmounted, defineComponent, h,
} from 'vue';
import { ElMenu, ElMenuItem, ElSubMenu, ElIcon} from 'element-plus';
import router from '../router.js';
import useMenuStore from '../menuStore.js';

export default defineComponent({
    name: 'MenuView',
    setup(props, { attrs, slots, emit, expose }) {
        let menuStore = useMenuStore();
        let route = router.route();

        let currentPath = ref('');

        router.router.beforeEach((to, from) => {
            currentPath.value = to.path;
        });

        nextTick(() => {
            currentPath.value = route.path;
        });

        function buildTitle(item) {
            if(item.meta && item.meta.count) {
                let v = menuStore.countValue[item.meta.count];

                return h('div', {class: 'f-grow flex f-h-lr f-v-center'}, [
                    h('span', {class: 'f-grow'}, item.meta.title),
                    h('span', {class: 'menu-count ' + item.meta.countClass}, Number(v) > 99 ? '99+' : v)
                ])
            }
            return h('span', {class: 'f-grow'}, item.meta.title);
        }

        function buildMenu(item, parent) {
            if(item.meta && item.meta.hide) {
                return;
            }
            let index = parent + item.path;

            if(item.children) {
                return h(
                        ElSubMenu,
                        { index: index },
                        {
                            title: () =>  [
                                item.meta.icon ? h(ElIcon, {}, () => h('span', {class: 'icon ' + item.meta.icon})) : null,
                                buildTitle(item)
                            ],
                            default: () => item.children.map(c =>  buildMenu(c, index))
                        }
                );
            } else {
                return h(
                        ElMenuItem,
                        {index: index},
                        {
                            title: () => buildTitle(item),
                            default: item.meta.icon ? () => h(ElIcon, {}, () => h('span', {class: 'icon ' + item.meta.icon })) : null
                        }
                );
            }
        }


        return () => {
            let paths = router.paths
                    .filter(_ => !_.redirect)
                    .find(_ => _.meta && _.meta.name === 'main')
                    .children
                    .map(item => buildMenu(item, '/'));

            let menu = h(
                    ElMenu,
                    {
                        'unique-opened': true,
                        router: true,
                        'defaultActive': currentPath.value,
                        'collapse': menuStore.isCollapse,
                        class: 'menu',
                        //'collapse-transition': false
                    },
                    {default: () => paths});

            return h('div',
                    {class: 'menu-view',},
                    menu);
        }
    }
})

</script>
<style lang="less">
.menu-view {
    font-size: 13px;
    overflow-y: auto;
    padding: 10px 0;
    background: #fff ;//url("~@base/assets/img/menu-bg.png") no-repeat bottom center ;
    background-size: auto 40%;
}

.menu {
    border-right: 0;
    background-color: transparent;

    .el-menu-item {
        border-left: 4px solid transparent;

        &.is-active {
            border-left-color: @colorBase;
            color: @colorBase;
        }
    }

    .el-sub-menu__title {
        border-left: 4px solid transparent;
    }

    .el-sub-menu {
        //margin-top: 12px;
    }

    .el-menu-item, .elsub-menu {
        margin-bottom: 5px;
    }

    .icon-point {
        font-size: 0.7em;
    }
}

.menu:not(.el-menu--collapse) {
    width: @menuWidth;
}

</style>
