<template>
    <div class="empty-wrap" :style="styles">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M882.509 540.86a1.113 1.113 0 0 1-0.154-0.18l-63.155-49.1V204.8c0-20.787 3.31-37.751-8.533-53.333C796.8 127.974 763.162 128.05 742.45 128H358.4L204.774 274.133V491.58l-63.13 49.1c-0.05 0.052-0.127 0.129-0.178 0.18-23.783 18.765-39.066 47.846-39.066 80.46v257.613c0 28.263 22.938 51.2 51.2 51.2h716.8c28.262 0 51.2-22.937 51.2-51.2V621.321c0-32.615-15.309-61.696-39.091-80.461zM256 484.668V300.8l118.374-113.067H742.4c14.157 0 25.6 11.495 25.6 25.626v332.774h-76.8c-14.157 0-42.718 11.495-42.743 25.626V665.6c0 14.157-11.392 25.6-25.55 25.6H401.042c-14.157 0-25.574-11.443-25.574-25.6v-93.841c0-14.131-28.536-25.626-42.667-25.626H256v-61.465z m614.4 368.665c0 14.157-11.443 25.6-25.651 25.6H179.2c-14.131 0-25.6-11.443-25.6-25.6v-230.4c0-14.13 11.469-25.574 25.6-25.574H332.8V691.2c0 28.314 22.938 51.251 51.2 51.251h256c28.262 0 51.2-22.963 51.2-51.251V597.359h153.549c14.208 0 25.651 11.418 25.651 25.574v230.4z"></path>
        </svg>
        <div class="hint-str">{{props.hint}}</div>
    </div>
</template>

<script setup>
    import {computed} from 'vue';

    let props = defineProps({
        hint: String,
        height: {
            type: [Number, String],
            default: 100
        }
    })

    let styles = computed(() => {
        if(Number(props.height) > 0) {
            return `min-height: ${props.height}px;`;
        } else {
            return `min-height: ${props.height};`;
        }
    })

</script>

<style lang="less">
.empty-wrap {
    text-align: center;
    color: @colorTxt2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .icon {
        height: 50px;
        width: 50px;
    }

    .hint-str {
        font-size: 15px;
        margin-top: 20px;
    }
}
</style>
