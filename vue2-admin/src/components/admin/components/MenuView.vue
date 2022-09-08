<script>
    import {Menu, MenuItem, Submenu, MenuItemGroup} from 'element-ui';

    export default {
        name: "MenuView",
        computed: {
            menuList() {
                return this.$store.getters.menuList;
            },
            collapse() {
                return this.$store.getters.isCollapse;
            }
        },
        render(h) {
            let list = this.menuList;
            let menu = h(Menu, {
                props: {
                    router: true,
                    collapse: !this.collapse,
                    uniqueOpened: true,
                    defaultActive: this.$route.fullPath,
                }
            }, this.buildChild(h, list, []));

            return h('div', {staticClass: 'menu-view'}, [
                menu
            ]);
        },
        methods: {
            getPathString(paths) {
                let str = paths.join('/');
                return str.replaceAll('//', '/');
            },
            buildChild(h, arr, path) {
                let subs = [];
                arr.forEach(item => {
                    let tPath = [...path, item.path];
                    if(item.children && item.children.length > 1) {
                        subs.push(
                            h(
                                Submenu,
                                {props: {index: this.getPathString(tPath)}, attrs: {p: this.getPathString(tPath)}},
                                [
                                    h('template', {props:{}, slot:'title'}, this.buildTitle(h, item)),
                                    ...this.buildChild(h, item.children, tPath)
                                ]
                            ));
                    } if(item.children && item.children.length === 1) {
                        let child = item.children[0];
                        if(!child.meta.hidden) {
                            tPath.push(child.path)
                            subs.push(
                                h(
                                    MenuItem,
                                    {props: {index: this.getPathString(tPath)}, attrs: {p: this.getPathString(tPath)}},
                                    this.buildTitle(h, child)
                                ));
                        }
                    } else {
                        if(!item.meta.hidden) {
                            subs.push(
                                h(
                                    MenuItem,
                                    {props: {index: this.getPathString(tPath)}, attrs: {p: this.getPathString(tPath)}},
                                    this.buildTitle(h, item)
                                ));
                        }
                    }

                });

                return subs;
            },
            buildTitle(h, item) {
                let res = [];
                if(item.meta.icon) {
                    res.push(h('SvgIcon', {props: {name: item.meta.icon}}));
                }
                res.push(h('span', {staticClass: 'menu-title txt-ellipsis'}, item.meta.title));
                return res;
            }
        }
    }
</script>

<style lang="scss">
.menu-view {

}
</style>
