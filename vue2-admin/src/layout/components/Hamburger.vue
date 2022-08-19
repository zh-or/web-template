<template>
    <div style="padding: 0 15px;" @click="toggleClick">

    </div>
</template>

<script setup>

    defineProps({
        isActive: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits()
    const toggleClick = () => {
        emit('toggleClick');
    }
</script>

<style scoped>
    .hamburger {
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 20px;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;
    }

    .hamburger:hover {
         background: rgba(0, 0, 0, 0.025);
     }

    .hamburger.is-active {
        transform: rotate(180deg);
    }
</style>
