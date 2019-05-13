<template>
	<div id="telePage">
        <transition name="slide-fade" >
            <task-list v-if="!is_search" @openSearch="openSearch"/>
            <search-screen v-if="is_search" @openSearch="openSearch"/>
        </transition>
	</div>
</template>

<script>
  	export default{
  		components: {
            taskList: () => import('@/components/tasks/task'),
            searchScreen: () => import('@/components/tasks/search'),
        },
        data() {
            return {
                is_search:false
            }
        },
        mounted(){
        },
        methods:{
            openSearch(val){
                this.is_search = val
            }
        },
  	}
</script>

<style lang="less" scoped>
	#telePage{
		height: calc(~"(94% - 40px)");
        .slide-fade-enter-active {
          transition: all .3s ease;
        }
        .slide-fade-leave-active {
          transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        }
        .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
          transform: translateX(10px);
          opacity: 0;
        }
	}
</style>
