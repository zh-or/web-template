<!--

<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="1">处理中心</el-menu-item>
  <el-submenu index="2">
    <template slot="title">我的工作台</template>
    <el-menu-item index="2-1">选项1</el-menu-item>
    <el-menu-item index="2-2">选项2</el-menu-item>
    <el-menu-item index="2-3">选项3</el-menu-item>
    <el-submenu index="2-4">
      <template slot="title">选项4</template>
      <el-menu-item index="2-4-1">选项1</el-menu-item>
      <el-menu-item index="2-4-2">选项2</el-menu-item>
      <el-menu-item index="2-4-3">选项3</el-menu-item>
    </el-submenu>
  </el-submenu>
  <el-menu-item index="3" disabled>消息中心</el-menu-item>
  <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
</el-menu>

-->

<script>
    import {
        Menu, MenuItem, MenuItemGroup, Submenu
    } from 'element-ui';

    export default {
        name: "AdminMenu",
        props: {
            menu: {
                type: Array,
                default: () => []
            },
            indexPath: {
                type: String,
                default: '/index',
            }
        },
        data() {
            return {}
        },
        render(h) {

            function createMenu(parentPath, arr) {
                let ms = [];
                arr.forEach(m => {
                    m.meta = m.meta || {};
                    let path = parentPath + '/' + m.path;
                    path = path.replace(/\/\/+/g, '/');

                    if (m.hasOwnProperty('children')) {

                        if(m.meta.hide) {
                            ms.push(...createMenu(path, m.children));
                        } else {
                            ms.push(h(Submenu,
                                {
                                    props: { index: path,}
                                },
                                [
                                    h('template', { slot: 'title' }, m.meta.title),
                                    ...createMenu(path, m.children)
                                ]
                            ));
                        }

                    } else if(m.meta.hide !== true) {
                        ms.push(h(MenuItem,
                            {
                                props: { index: path,}
                            },
                            m.meta.title
                        ));
                    }
                });
                return ms;
            }

            //console.log('routes:', this.menu);
            let childs = createMenu('/', this.menu);

            return h(Menu,
                {
                    props: {
                        defaultActive: this.indexPath,
                        mode: 'vertical',
                        router: true,
                    }
                },
                childs);
        },
        methods: {}
    }
</script>

<style lang="less">

</style>
