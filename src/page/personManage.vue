<template>
    <el-container style="height: calc(90% - 10px);">
        <el-aside width="18%" style="background-color: white;padding: 10px">
            <el-row class="typeTitle">重点人员类型</el-row>
            <el-row>
                <el-col :span="20">
                    <el-input v-model="peopleType" size="mini" placeholder="请输入人群类型"></el-input>
                </el-col>
                <el-col :span="3" :offset="1">
                    <img class="searchIcon" @click="searchType" src="../assets/img/search.png" alt="">
                </el-col>
            </el-row>
            <el-row class="typeList">
               <!-- <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose">

                    <el-menu-item  v-for="(item,index)in listData" :index="index.toString()">
                        <span slot="title">{{item.typeName}}</span>
                    </el-menu-item>
                </el-menu>-->
                <div class="listItem" v-for="(item,index) in listData" @click="getPersonal(item.groupId,index,item.specialCode)">
                        <el-col :span="16" ref="titleItem">{{item.groupName}}</el-col>
                        <el-col :span="2" :offset="2" style="cursor: pointer">
                           <img style="width: 20px;" @click.stop="setting(item.groupId,item.groupName,item.specialCode)" src="../assets/img/setting.png" alt="">
                        </el-col>
                        <el-col :span="2" :offset="1">
                            <img style="width: 20px;cursor: pointer" @click="deleType(item.groupId)" src="../assets/img/dele.png" alt="">
                        </el-col>

                        <el-col style="font-size: 12px">人数：{{item.userCount?item.userCount:0}}</el-col>


                </div>

            </el-row>
            <el-row class="btn">
                <el-button type="primary" size="mini" @click="addType">添加重点人员库</el-button>
            </el-row>

        </el-aside>
        <el-container style="height: 100%">
            <el-header>

                <el-form :inline="true" size="mini" v-model="searchForm">
                    <el-form-item>
                        <el-button type="primary" @click="addPeople">添加人员</el-button>
                    </el-form-item>

                   <!-- <el-form-item label="添加方式">
                        <el-select v-model="searchForm.addWay" @change="selectChange" placeholder="请选择">
                            <el-option value="全部" label="全部"></el-option>
                            <el-option value="1" label="手动添加"></el-option>
                            <el-option value="2" label="筛选导入"></el-option>
                        </el-select>
                    </el-form-item>-->
                    <!--<el-form-item label="添加时间">
                        <el-date-picker
                            v-model="searchForm.searchTime"
                            type="datetimerange"
                            size="mini"
                            range-separator="-"
                            value-format="yyyy-MM-dd hh:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>-->

                    <el-form-item>

                            <el-input v-model="searchForm.searchPhone" size="mini" placeholder="请输入电话号码查询">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchByphone"></i>
                            </el-input>

                    </el-form-item>

                    <!--<el-form-item>
                        <el-button type="primary" @click="searchPersonal">筛选</el-button>
                    </el-form-item>-->

                </el-form>


            </el-header>
            <el-main >
                <el-table
                    :data="tableData"
                    stripe
                    ref="tablec"
                    :header-cell-class-name="headerStyle"
                    style="width: 100%;height: 90%">
                    <el-table-column
                        type="index"
                        label="序号"
                       >
                    </el-table-column>

                    <el-table-column
                        prop="telno"
                        label="手机号"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="imsi"
                        label="IMSI">
                    </el-table-column>

                  <!--  <el-table-column
                        prop="createTime"
                        label="添加时间">
                    </el-table-column>-->
                    <!--<el-table-column-->
                        <!--prop="createType"-->
                        <!--label="添加方式">-->
                    <!--</el-table-column>-->
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button @click="editTable(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="deleTable(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-col :offset="16">
                    <pagination @currentPage="currentPage" :totalPage="totalPage" :pageSize="pageSize"/>
                </el-col>

            </el-main>
        </el-container>

        <el-dialog
            title="编辑重点人员库"
            :visible.sync="setDialogVisible"
            width="30%"
            >
            <el-row>
                <el-col :span="4">名称</el-col>
                <el-col :span="18">
                    <el-input v-model="typeform.groupName" size="mini" placeholder="请输入类型名称"></el-input>
                </el-col>
            </el-row>
           <!-- <el-row>
                <el-col :span="4">编码</el-col>
                <el-col :span="18">
                    <el-input :disabled="isEdit" v-model="typeform.specialCode" size="mini" placeholder="请输入类型编码"></el-input>
                </el-col>
            </el-row>-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSettype">保存</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="添加重点人员库"
            :visible.sync="addDialogVisible"
            width="30%"
        >
            <el-row>
                <el-col :span="4">名称</el-col>
                <el-col :span="18">
                    <el-input v-model="typeform.groupName" size="mini" placeholder="请输入类型名称"></el-input>
                </el-col>
            </el-row>
           <!-- <el-row>
                <el-col :span="4">编码</el-col>
                <el-col :span="18">
                    <el-input :disabled="isEdit" v-model="typeform.specialCode" size="mini" placeholder="编码为英文字母或数字且小于8位"></el-input>
                </el-col>
            </el-row>-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddtype">保存</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="添加人员"
            :visible.sync="addpeoVisible"
            width="40%"
        >
            <el-row>
                <el-col :span="4">名称</el-col>
                <el-col :span="18">
                    <el-input v-model="personalForm.addPersonalphone" type="textarea" rows="4" size="mini" placeholder="多个号码请用逗号隔开"></el-input>
                </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addpeoVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveperson">保存</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="编辑人员"
            :visible.sync="editpeoVisible"
            width="40%"
        >
            <el-row>
                <el-form :inline="true">
                    <el-form-item label="电话号码">
                        <el-input v-model="personalForm.currentPhone" size="mini" placeholder="请输入类型名称"></el-input>
                    </el-form-item>
                 <!--   <el-form-item label="性别">
                        <el-col :span="6">
                            {{gender}}
                        </el-col>
                    </el-form-item>-->
                 <!--   <el-form-item label="地区">
                        <el-col :span="12">
                            <el-select v-model="formProvenance.province" placeholder="请选择" @change="addProvenance">
                                <el-option  v-for="item in provinces"  :key="item.cityId"  :label="item.name"  :value="item.cityId">
                                </el-option>
                            </el-select>
                            省
                        </el-col>
                        <el-col :span="12">
                            <el-select v-model="formProvenance.city" placeholder="请选择" @change="addProvenance">
                                <el-option  v-for="item in cities"  :key="item.cityId"  :label="item.name"  :value="item.cityId">
                                </el-option>
                            </el-select>
                            市
                        </el-col>
                    </el-form-item>-->

                </el-form>


            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editpeoVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditpersonal">保存</el-button>
            </span>
        </el-dialog>


    </el-container>

</template>

<script>
    import {selectAllKeyPersonnelType,insertKeyPersonnelType, updateKeyPersonnelType,delectKeyPersonnelTypeBykeyTypeId,
        queryKeyPersonnelDataBykeyType,insertKeyPersonnelData,updateKeyPersonneData,delectKeyPersonnelDataBykeyId,
        dictionaryCity,
    } from '@/controller/api'
    import {getStyle} from '@/controller/utils'
  export default{
    data(){
      return{
          peopleCount:1111,
          listData:[],
          peopleType:'',//人群类型
          edittypeName:'',//编辑
          typeform:{
              groupId:null,
              specialCode:'',
              groupName:'',
          },
          setDialogVisible:false,//类型库设置
          deleDialogVisible:false,//删除
          addDialogVisible:false,//添加库

          personalForm:{
              addPersonalphone:'',//添加人员
              personalId:null,


          },
          isEdit:false,//是否可编辑
          groupName:'',
          specialCode:null,
          addpeoVisible:false,//添加
          editpeoVisible:false,//编辑
          searchForm:{
              addWay:'',//添加方式
              searchTime:'',//查询时间范围
              searchPhone:'',//电话号码
          },
          formProvenance:{
              province:null,//来源地 省
              city:null,//来源地 市
          },
          currentPhone:'123456789012',//当前编辑的电话号码
          gender:'女',//性别
          province:'',//省
          city:'',//市
          totalPage:0,
          pageSize:null,
          pageNum:null,
          tableData:[],
          provinces:[],
          cities:[],
          type:0,//来源地级别
          defaultTime:[],//默认起始时间
          typeIndex:'',//类型


      }
    },


    components:{
      pagination:require('@/components/pagination')
    },
    mounted(){
        this.getTypeList()
        //设置起始时间["2018-10-31 12:00:00", "2018-11-18 12:00:00"]
       /* var ds=new Date()
        let current=this.formatTime(ds)
        var nowTime = new Date();
        var y= nowTime.getFullYear();
        var initStartMonth = new Date(y, nowTime.getMonth()-1, 0);
        this.searchForm.searchTime=[initStartMonth,nowTime]*/
        //计算列表条数
        let tableEle=this.$refs.tablec.$el
        let style=getStyle(tableEle,'height')
        this.pageSize=parseInt((style-60)/49)
        console.log(this.pageSize)


    } ,
    methods:{
        headerStyle({row,rowIndex}){
            return 'header-th'

        },
        getTypeList(){
            selectAllKeyPersonnelType({

            }).then(res=>{
              res=res.data
              if(!res.code){
                this.listData=res.data
              }
            })
        },
        //查询类型
        searchType(){
            selectAllKeyPersonnelType({
                groupName:this.peopleType,
            }).then(res=>{
              res=res.data
              if(!res.code){
                  this.listData=res.data
              }  else {
                this.$message.error(res.msg)
              }

            })
        },
        setting(groupId,groupName,specialCode){
          this.setDialogVisible=true
          this.typeform.groupId=groupId
          this.typeform.groupName=groupName
          this.typeform.specialCode=specialCode
          this.isEdit=true

        },
        //新增人员类型
        saveAddtype(){

            insertKeyPersonnelType({
                groupName:this.typeform.groupName
            }).then(res=>{
              res=res.data
              if(!res.code){
                this.$message.success('添加成功')
                this.getTypeList()
                this.addDialogVisible=false
              }else {
                  this.$message.error(res.msg)
              }
            })

        },
        //编辑人员类型
        saveSettype(){
            updateKeyPersonnelType({
                groupId:this.typeform.groupId,
                groupName:this.typeform.groupName
            }).then(res=>{
              res=res.data
              if(!res.code){
                this.getTypeList()
                this.setDialogVisible=false
              }else {
                this.$message.error(res.msg)
              }
            })
        },

        //删除人员类型库
        deleType(groupId){
         // this.deleDialogVisible=true
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                //执行删除
                delectKeyPersonnelTypeBykeyTypeId({
                    groupId:groupId
                }).then(res=>{
                    res=res.data
                    if(!res.code){
                        this.getTypeList()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });

                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //添加人群类型
        addType(){
          this.typeform.groupName=''
          this.typeform.specialCode=''
          this.addDialogVisible=true
          this.isEdit=false
        },
        currentPage(val){
            this.pageNum=val
            this.searchPersonal(this.pageNum,this.pageSize)
        },
        formatTime(d){
            let date = d.getFullYear()+"-"+((d.getMonth()+1)>=10?+(d.getMonth()+1):"0"+(d.getMonth()+1))
                +"-"+((d.getDate())>=10?d.getDate():'0'+d.getDate())+' '
            let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
            let minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
            let s = (d.getSeconds() < 10 ? '0' + (d.getSeconds()) : d.getSeconds());
            return date+''+hour+':'+minute+':'+s
        },

        selectChange(val){
          console.log(val)
            if(!this.typeform.groupId){
                this.$message.warning('请先选择人群类型')
                return
            }
            queryKeyPersonnelDataBykeyType({
                groupId:this.typeform.groupId,
                createType:val=='全部'?'':val,
                /*startTime:'',
                 endTime:this.formatTime(this.searchForm.searchTime[1]),*/
                pageNum:1,
                pageSize:this.pageSize
            }).then(res=>{
                res=res.data
                if(!res.code){
                    res.data=res.data.map((item,index)=>{
                        var d=new Date(item.createTime)
                        item.createTime=this.formatTime(d)
                        if(item.createType===1){
                            item.createType="手动添加"
                        }else if(item.createType==2){
                            item.createType="筛选导入"
                        }
                        return item
                    })
                    this.tableData=res.data
                    this.totalPage=res.total
                }else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            })
        },

        searchByphone(){
            if(!this.typeform.groupId){
                this.$message.warning('请先选择人群类型')
                return
            }
            queryKeyPersonnelDataBykeyType({
                groupId:this.typeform.groupId,
                createType:'',
                /*startTime:'',
                 endTime:this.formatTime(this.searchForm.searchTime[1]),*/
                pageNum:1,
                pageSize:this.pageSize,
                telno:this.searchForm.searchPhone,
            }).then(res=>{
                res=res.data
                if(!res.code){
                    res.data=res.data.map((item,index)=>{
                        var d=new Date(item.createTime)
                        item.createTime=this.formatTime(d)
                        if(item.createType===1){
                            item.createType="手动添加"
                        }else if(item.createType==2){
                            item.createType="筛选导入"
                        }
                        return item
                    })
                    this.tableData=res.data
                    this.totalPage=res.total
                }else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            })

        },
        //根据人群类型获取人员
        getPersonal(groupId,index,specialCode){
            //修改当前点击的文字验证
            this.typeIndex=index
            let items=this.$refs.titleItem
            items.forEach((item,idex)=>{
              item.$el.style.color='black'
            })

            this.$refs.titleItem[this.typeIndex].$el.style.color='blue'
            this.typeform.groupId=groupId
            this.typeform.specialCode=specialCode
            queryKeyPersonnelDataBykeyType({
                groupId:groupId,
                createType:'',
                pageNum:1,
                pageSize:this.pageSize
            }).then(res=>{
              res=res.data
              if(!res.code){
                res.data=res.data.map((item,index)=>{
                    var d=new Date(item.createTime)
                    item.createTime=this.formatTime(d)
                    if(item.createType===1){
                      item.createType="手动添加"
                    }else if(item.createType==2){
                        item.createType="筛选导入"
                        if(item.telno){
                            item.telno= item.telno.substring(0,7)+'****'
                        }

                    }
                  return item
                })
                this.tableData=res.data
                this.totalPage=res.total
                this.getTypeList()
              }else {
                  this.$message({
                      type: 'error',
                      message: res.msg
                  });
              }
            })

        },
        searchPersonal(pageNum,pageSize){
          console.log(this.searchForm.searchTime)
            queryKeyPersonnelDataBykeyType({
                createType:this.searchForm.addWay,
                /*startTime:this.searchForm.searchTime[0],
                endTime:this.searchForm.searchTime[1],*/
                groupId:this.typeform.groupId,
                pageNum:pageNum,
                pageSize:pageSize

            }).then(res=>{
              res=res.data
              if(!res.code){
                  res.data=res.data.map((item,index)=>{
                      var d=new Date(item.createTime)
                      item.createTime=this.formatTime(d)
                      if(item.createType===1){
                          item.createType="手动添加"
                      }else if(item.createType==2){
                          item.createType="筛选导入"
                      }
                      return item
                  })
                this.tableData=res.data
              }else{
                  this.$message({
                      type: 'error',
                      message: res.msg
                  })
              }
            })

        },
        //添加人员
        addPeople(){
            if(!this.typeform.groupId){
                this.$message.warning('请选择人群类型')
                return
            }
            this.personalForm.addPersonalphone=''
            this.addpeoVisible=true

        },
        saveperson(){
            let pattern = /^((13[0-9])|(14[5-8])|(15([0-3]|[5-9]))|(16[6])|(17[0|2|4|6|7|8])|(18[0-9])|(19[8-9]))\d{8}$/
            let isPassed = true
            this.personalForm.addPersonalphone.split(",").map(v => {
              if(!pattern.test(v)){
                isPassed = false
              }
            })
            if(isPassed){
              insertKeyPersonnelData({
                  telno:this.personalForm.addPersonalphone,
                  groupId:this.typeform.groupId,
                  specialCode:this.typeform.specialCode,
                  addType:1
              }).then(res=>{
                  res=res.data
                  if(!res.code){
                      this.getPersonal(this.typeform.groupId,this.typeIndex,this.typeform.specialCode)
                      this.addpeoVisible=false
                  }
              })
            }else{
              this.$message({
                        type: 'error',
                        message: "请输入正确格式的手机号"
                    })
            }
        },
        editTable(index,row){
          this.personalForm.currentPhone=row.telno
            this.id=row.id
          this.personalForm.personalId=row.keyId
          this.gender=row.gender
          this.editpeoVisible=true
          this.addProvenance()

        },
        //获取省市区域
        addProvenance(val){
            let _this=this
            if(this.provinces.length){
                this.provinces.map(item => {
                    if(item.cityId === val){
                        this.type = item.type
                        this.formProvenance.city = null

                    }
                })
            }

            dictionaryCity({
                superId:typeof(val) === "number" ? val : 0
            }).then(res => {
                res = res.data
                if(!res.code){
                    switch (this.type) {
                        case 0:
                            this.provinces = res.data
                            this.type = res.data[0].type
                            break;
                        case 1:
                            this.cities = res.data
                            this.type = res.data[0].type
                            break;
                        default:
                            break;
                    }
                    console.log(res.data)
                }else{
                    _this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },

        saveEditpersonal(){
          let currentProvince=this.provinces.filter((item,index)=>{
            return item.cityId==this.formProvenance.province
          })
          let currcity  =this.cities.filter((item,index)=>{
                return item.cityId==this.formProvenance.city
            })
            let city
            if(!currentProvince[0]){
                city=''
            }else if(!currcity[0]){
                city=''
            }
            else {
                city=currentProvince[0].name+currcity[0].name
            }

            console.log(currentProvince,city)
                updateKeyPersonneData({
                    id: this.id,
                    telno: this.personalForm.currentPhone
                }).then(res => {
                    res = res.data
                    if (!res.code) {
                        this.getPersonal(this.typeform.groupId, this.typeIndex)
                        this.editpeoVisible = false
                    }
                })
        },


        deleTable(index,row){
          console.log(row.id)
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                //执行删除
                delectKeyPersonnelDataBykeyId({
                    id:row.id,
                    groupId:this.typeform.groupId
                }).then(res=>{
                    res=res.data
                    if(!res.code){
                        this.getPersonal(this.typeform.groupId,this.typeIndex)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });

                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        }
    }

  }

</script>

<style lang="less" scoped>
    .el-container{
        width: 100%;
        background-color: #F2F2F2;
        .typeTitle{
            font-size: 16px;
            font-weight: bold;
            padding-bottom: 5px;
        }
        .searchIcon{
            transform: rotate(-30deg);
            cursor: pointer;
        }
        .typeList{
            border: 1px solid #759BD9;
            height: 80%;
            overflow: auto;
            margin-bottom: 5px;
            .listItem{
                height: 50px;
                border-bottom: 1px solid #797979;
                padding-left: 10px;
                padding-top: 10px;
                cursor: pointer;
            }
            .listItem *{
                vertical-align: middle;
            }


        }

        .el-header{
            height: 10%;
            background-color: #D7D7D7;
            padding: 10px 0 0;
        }
        .header-th{
            background-color: #3190e8;
        }
        .el-main{
            height: calc(~"(100% - 70px)");
            padding:10px
        }
        .el-form-item{
            margin-right: 0px;
        }
    }

</style>
