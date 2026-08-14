<script >
    import {h} from 'vue';

    export default {
        name: 'SvgIcon',
        props: {
            name: String
        },
        setup(props) {
            return () => h(
                'svg',
                { class: 'icon svg-icon'},
                [
                    h('use', {'xlink:href': '#' + props.name})
                ]
            );
        }
    }
</script>

<style lang="less">
.svg-icon {
    margin: 0;
    width: 1em;
}
</style>
