<template>
    <div style="width: 100% ;height: 100%">
        <headline :userInfo="userInfo"></headline>
        <router-view ></router-view>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  components: {
      headline: () => import('../components/head/head'),
  },
  data () {
    return {

    }
  },
  mounted(){
    // this.$router.push({path:'teleScreening'})
  } ,
  computed: {
    ...mapState({
      userInfo:state => state.userInfo
    })
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>

