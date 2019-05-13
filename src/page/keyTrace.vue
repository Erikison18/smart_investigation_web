<template>
    <div class="keyMap" id="map">
        <l-map class="mini-map" ref="map" :zoom="zoom" :minZoom="3" :center="center" :crs="crs">
            <l-tile-layer :url="url" :tms="true"></l-tile-layer>
            <l-marker v-for="m in marker" :lat-lng="[m.lat,m.long]">
                <l-popup>
                    <strong>
                        最近活跃时间：{{formatTime(m.userActiveTime.toString())}}
                    </strong>
                </l-popup>
            </l-marker>
        </l-map>
        <el-button class="btn" type="primary" @click="dialogFormVisible = true">重点人员监控追踪</el-button>

        <el-dialog :visible.sync="dialogFormVisible" title="人群选择" :close-on-click-modal="false" :show-close="false" width="60%">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="人群类型">
                <el-select v-model="form.type" placeholder="请选择人群类型">
                    <el-option v-for="v in repoTypes" :label="v.groupName" :value="v.groupId"></el-option>
                </el-select>
            </el-form-item>
           <!-- <el-form-item label="选择时间">
                <el-date-picker v-model="form.time" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="" border :data="tableData" max-height="400" tooltip-effect="dark" @selection-change="selectionChange">
            <el-table-column type="selection" width="200" v-model="multipleSelection"></el-table-column>
            <el-table-column type="index" width="200"></el-table-column>
            <el-table-column prop="telno" label="号码"></el-table-column>
              <el-table-column prop="imsi" label="IMSI"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="positionConfirm">确 定</el-button>
              <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
    import { bd_decrypt } from '@/controller/utils'
    import L from 'leaflet'
    import {LMap, LTileLayer, LMarker, LGeoJson, LPopup,LCircleMarker} from 'vue2-leaflet'
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.imagePath = ''
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('../assets/img/marker-icon-2x.png'),
        iconUrl: require('../assets/img/marker-icon.png'),
        shadowUrl: require('../assets/img/marker-shadow.png')
    })
    import {selectAllKeyPersonnelType,queryKeyPersonnelDataBykeyType,searchGisBySpecialCode} from "@/controller/api"
    import '../../static/proj4-compressed.js';
    import '../../static/proj4leaflet.js';
    import '../../static/leaflet-heat.js';
    import {tileURL,crs,centerPoint,mapZoom} from '../../static/crs-script.js';
    
  export default{
      data(){
        return{
            zoom: mapZoom,
            center: centerPoint,
            crs:crs,
            url:tileURL,
           // marker: L.latLng(39.926055,116.298168),longitude latitude
            marker:[],
            text:'haha',
            dialogFormVisible: false,
            form: {
                type: null,
                time:null
            },
            tableData: [],
            repoTypes:[],
            multipleSelection:[],
        }
      },
      components: {
          LMap,
          LTileLayer,
          LMarker,
          LCircleMarker,
          LPopup,
      },
      mounted(){
        this.selectAllKeyPersonnelType()
      },
      methods:{
          formatTime(row) {
              if(row) {
                  console.log(row)
                  let date = `${row.substr(0,4)}-${row.substr(4,2)}-${row.substr(6,2)} ${row.substr(8,2)}:${row.substr(10,2)}:${row.substr(12,2)}`
                  return date
              }
              return null;
          },
          selectionChange(val){
              this.multipleSelection =val;
          },
          /*
           * 随机生成11位数字
           * */
          rand(min,max) {
              return Math.floor(Math.random()*(max-min))+min;
          },

          search(){
          queryKeyPersonnelDataBykeyType({
            groupId:this.form.type
          }).then(res => {
            res = res.data
            if(!res.code){
                let resultdata=res.data
                this.tableData=resultdata.map(item=>{
                  if(item.createType==2){
                      item.telno=this.rand(10000000000,99999999999)
                  }else if(item.createType==1){
                     item.telno.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                  }
                    return item
                })
            }
          })
        },
        positionConfirm(){
          if(this.multipleSelection.length < 15){
            this.$message({
                type: 'error',
                message: "选择人员不能少于15人"
            })
          }else{
            this.getLatLngdata()
            /*this.marker=[{lat:39.742611,long:116.153738},{lat:39.731786,long:116.166613},
              {lat:39.761351,long:116.170389},{lat:39.741027,long:116.16215},{lat:39.740631,long:116.16112},
              {lat:39.77072,long:116.180689},{lat:39.725317,long:116.16009},{lat:39.737463,long:116.171763},
              {lat:39.73007,long:116.115801},{lat:39.731786,long:116.166613},{lat:39.778636,long:116.142237},
              {lat:39.782857,long:116.238367},{lat:39.75119,long:116.047823},{lat:39.74855,long:116.077349},
              {lat:39.788397,long:116.264117},{lat:39.790508,long:116.079066},{lat:39.776789,long:116.2624}
              ]*/
            this.dialogFormVisible=false
          }
        },

        getLatLngdata(){

          let specialCode=this.repoTypes.filter(item=>{
            return this.form.type==item.groupId
          })[0].specialCode

            let imsisArray = [];
            this.multipleSelection.forEach( (item) => {
                let imsi = item.imsi
                if ( imsi != null) {
                    console.log(imsi)
                    imsisArray.push(imsi)
                }
            })

            searchGisBySpecialCode({
                imsis:imsisArray,
                specialCode:specialCode
            }).then(res=>{
                res=res.data
                if(!res.code){
                    let data=res.data
                    this.marker = data.map(v => {

                      let tmp = bd_decrypt(v.lng,v.lat)
                      return {
                          userActiveTime:v.userActiveTime,
                        lat:tmp.lat,
                        long:tmp.lng
                      }
                    })
                }else {
                 this.$message.error(res.msg)
                }

            })
        } ,
        selectAllKeyPersonnelType(){
          selectAllKeyPersonnelType({}).then(res => {
              res = res.data
              if(!res.code){
                this.repoTypes = res.data ? res.data : []
              }
          })
        }
      }
  }

</script>

<style lang="less" scoped>
    @import "~leaflet/dist/leaflet.css";
    .keyMap{
        position: relative;
        height: calc(~"(90% - 10px)");
        .btn{
            position: absolute;
            top: 10%;
            left: 10%;
            z-index: 1000;
        }
    }
</style>
