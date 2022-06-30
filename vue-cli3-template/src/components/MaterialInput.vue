<template>
    <div class="material-input" :class="{'mi-focus': isFocus}" @click="getFocus">
        <input ref="input" :type="type || 'text'" v-model="val" @input="$emit('input', val)">
        <span class="border"></span>
        <span class="placeholder" >{{placeholder}}</span>
    </div>
</template>

<script>
    export default {
        name: "MaterialInput",
        props: ['value', 'placeholder', 'type', 'focus', 'blur'],
        data(){
           return {
               isFocus: false,
               val: '',
           }
        },
        watch: {
            value: function(){
                this.val = this.value;
            },
        },
        updated(){
            this.init();
        },
        mounted(){
            this.val = this.value;
            this.init();
        },
        methods: {
            init(){
                var self = this;
                this.$refs.input.onfocus = function(){
                    self.isFocus = true;
                    self.$emit('focus');
                }
                this.$refs.input.onblur  = function(){
                    self.isFocus = self.val.length > 0 ? true : false;
                    self.$emit('blur');
                }
                if(self.val.length > 0){
                    self.isFocus = true;
                }
            },
            getFocus(){
                this.$refs.input.focus();
            }
        }
    }
</script>

<style lang="less">

    .material-input{
        position: relative;
        padding: 15px 10px 0 10px;
        margin-bottom: 10px;

        *{
            display: block;
            transition: all 200ms;
        }

        input{
            width: 100%;
            border: 0;
            margin: 0;
            height: 100%;
            padding: 5px 0;
            border-bottom: 2px solid #f2f2f2;
            font-size: 14px;
        }

        input:focus + .border{
            left: 10px;
            right: 10px;
        }

        .placeholder{
            color: #909399;
            z-index: 3;
            top: 50%;
            margin-top: -.5em;
            position: absolute;
            font-size: 14px;
        }

        .border{
            position: absolute;
            bottom: 0;
            height: 2px;
            left: 50%;
            right: 50%;
            z-index: 2;
            background-color: #0b79b0;
        }

        &.mi-focus{

            .placeholder{
                top: 0;
                font-size: 12px;
            }
        }

    }

</style>
