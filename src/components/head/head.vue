<template>
    <el-row style="height: 10%" class="head">
        <el-col :span='15' style="height:100%;line-height: 60px">
            <img class="logo" src="../../assets/img/logo.png" alt="">
            <span class="head_title">智慧刑侦</span>
            <el-radio-group v-model="menu" @change="radioChange">
                <el-radio-button label="电子防区人员管控"></el-radio-button>
                <el-radio-button label="案件关联号码筛查"></el-radio-button>
                <el-radio-button label="重点人员监控追踪"></el-radio-button>
                <el-radio-button label="重点人员管理"></el-radio-button>
            </el-radio-group>
        </el-col>
        <el-col :span="6"  style="height:100%;">
          <span class="year">{{currentDate}}</span>
          <span class="today">{{today}}</span>
          <span class="time">{{currTime}}</span>
        </el-col>
        <el-col :span="3"  style="height:100%;">
            <el-menu :default-active="activeIndex" router class="el-menu-demo" mode="horizontal">
                <el-submenu index="2" class="el-menu-demo" >
                    <template slot="title">管理员</template>
                    <!--<el-menu-item index="2-1">修改密码</el-menu-item>-->
                    <el-menu-item index="/" @click="logOut">安全退出</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-col>
        <!-- <el-col class="blue"></el-col> -->


    </el-row>

</template>

<script>
    import {logout} from '@/controller/api'
  export default{
      data(){
          return{
              currentDate:'',
              today:'',//星期几
              currTime:'',
              activeIndex:'1',
              menu:'案件关联号码筛查'
          }
    },
      mounted(){
          setInterval(()=>{
              var d = new Date();
              var a = new Array("日", "一", "二", "三", "四", "五", "六");
              var week = d.getDay();
              this.today="星期"+a[week]
              this.currentDate = d.getFullYear()+"年"+((d.getMonth()+1)>=10?+(d.getMonth()+1):"0"+(d.getMonth()+1))
                  +"月"+((d.getDate())>=10?d.getDate():'0'+d.getDate())+"日"
              let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
              let minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
              let second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
              this.currTime=hour+':'+minute+':'+second
          },1000)

      },
      computed:{
          /*...mapState(['adminInfo'])*/
      },
      methods:{
        radioChange(value){
          if(value=='案件关联号码筛查'){
              this.$router.push({path:'teleScreening'})
          }else if(value=='重点人员监控追踪'){
              this.$router.push({path:'keyTrace'})
          }else if(value=='电子防区人员管控'){
              this.$router.push({path:'electronicFence'})
          }else if(value=='重点人员管理'){
              this.$router.push({path:'personManage'})
          }
        },
          logOut(){


          }
      }

  }

</script>

<style lang="less" scoped>
  .head{
    /*padding: 0 10px;*/
    line-height: 60px;
    border-bottom: 1px solid #ccc;
    .logo{
        vertical-align: middle;
        display: inline-block;
        width: 30px;
    }
    .head_title{
        font-size: 24px;
        color:#235790;
    }
    .year{
        font-size: 14px;
    }
    .today{
        font-size: 14px;
        margin-left: 10px;
    }
    .time{
        font-size: 14px;
    }
    .el-menu-demo{
        // height: 100%;
    }
     .blue{
         width: 100%;
         height: 10px;
         background-color: #396AAF;
     }

  }
</style>
