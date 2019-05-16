<template>
	<div id="searchPage">
		<el-col :span="6" class="section filter_section">
			<el-row class="filter_title">
                <el-button  type="" icon="el-icon-arrow-left" @click="openSearch">返回</el-button>
                过滤条件
            </el-row>
            <!-- 添加地标 -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="filter_item">案发区域</span>
                    <el-button class="filter_add" type="text" icon="el-icon-circle-plus-outline" @click="openAddRegionDialog" v-if="!isSearching">添加</el-button>
                </div>
                <el-card class="region_item" v-if="regions.length" style="position: relative;" shadow="hover" v-for="(r,i) in regions" :key="r.id" @click.native.prevent="showRegion(r)">
                        <p>{{r.detailName}}</p>
                        <p style="font-size: 14px;">{{formatTimePost(r.startTime)}}~{{formatTimePost(r.endTime)}}</p>
                        <i v-if="!isSearching" class="el-icon-circle-close-outline remove_region" @click.stop="removeRegion(r.id)" style="position: absolute;right: 5px;top: 5px;font-size: 20px;"></i>
                </el-card>
                <el-row v-if="regions.length">
                    <el-input placeholder="请输入数字" v-model="regionCount">
                        <template slot="prepend">所出现案发区域数</template>
                        <template slot="append">个</template>
                    </el-input>
                    <span class="card_span">请选择目标人群存在过的区域，默认包含全部区域</span>
                </el-row>
                <el-row v-if="!regions.length" class="filter_empty">
                    暂无添加任何区域
                </el-row>
            </el-card>
			<el-card class="box-card">
                <el-row class="form_submit" style="text-align: right;">
                    <el-button type="primary" @click="scanResult" v-if="isResulted">查看结果</el-button>
                    <el-button type="primary" @click="search" :disabled="isSearching">{{isSearching ? "查询中" : "查询"}}</el-button>
                    <el-button @click="reset" disabled>重置</el-button>
                </el-row>
            </el-card>
		</el-col>
        <!-- 右侧地图 -->
		<el-col :span="18" class="section map_section">
			<l-map class="mini-map" ref="map" :zoom="zoom" :minZoom="3" :center="center" :crs="crs">
	            <l-tile-layer :url="url" :tms="true"></l-tile-layer>
                <l-circle v-if='LayerGroup' v-for="v in regions" :latLng="[v.lat,v.lng]" :radius="v.radius">
                    <l-tooltip :content="v.detailName+'<br />'+formatTimePost(v.startTime)+'~'+formatTimePost(v.endTime)" :options="tooltipOptions"></l-tooltip>
                </l-circle>

                <l-circle v-if='singleRegionVisible' :latLng="[singleRegion.lat,singleRegion.lng]" :radius="singleRegion.radius">
                    <l-tooltip :content="singleRegion.detailName+'<br />'+formatTimePost(singleRegion.startTime)+'~'+formatTimePost(singleRegion.endTime)" :options="tooltipOptions"></l-tooltip>
                </l-circle>
	        </l-map>
            <!-- 查询结果 -->
            <el-row class="box-card filter_result" v-if="resultVisiable">
                <el-row class="clearfix filter_result_count">
                    <span class="">总人数：{{totalCount}}人</span>
                    <!-- <el-button type="text" class="save_filter_result">导入重点人员库</el-button> -->
                    <i class="el-icon-circle-close-outline remove_region" @click.stop="closeResultList" style="position: absolute;right: 5px;top: 10px;font-size: 20px;"></i>
                </el-row>
                <el-table :data="result" stripe height="300">
                    <el-table-column align="center" type="index"  label="ID" width="180px"></el-table-column>
                    <el-table-column align="center" prop="telno"  label="号码标识" width="180px"></el-table-column>
                    <el-table-column align="center" prop="detailName"  label="案发区域" width="180px"></el-table-column>
                </el-table>
                <el-button type="primary" class="save_filter_result" @click="openRepoDialog" :disabled="isInrepo == 1">{{isInrepo == 1 ? "已导入重点人员库" : "导入重点人员库"}}</el-button>
            </el-row>
        </el-col>
        <!--添加区域弹框-->
        <el-card class="box-card dialog" v-if="dialogAddRegionVisible">
            <template>
                <el-form :model="regionInfo" ref="regionForm" label-width="80px" :rules="rules">
                    <el-form-item label="区域名称" prop="regionName">
                        <el-input v-model="regionInfo.regionName"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startTime">
                        <el-date-picker type="datetime" placeholder="选择日期" v-model="regionInfo.startTime" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerBeginDateAfter"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <!-- <el-date-picker type="datetime" placeholder="选择日期" v-model="regionInfo.endTime" style="width: 100%;" value-format="yyyyMMddHHmmss"></el-date-picker> -->
                        <el-radio-group v-model="timeRange" size="mini">
                          <el-radio label=".25" border>1/4小时</el-radio>
                          <el-radio label=".5" border>1/2小时</el-radio>
                          <el-radio label="1" border>1小时</el-radio>
                          <el-radio label="2" border>2小时</el-radio>
                          <el-radio label="3" border>3小时</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <el-row style="text-align: center;">
                    <el-button @click="drawCircle(center,radius,true)" icon="el-icon-edit">绘制</el-button>
                    <el-button @click="clearCircle" icon="el-icon-delete">清除</el-button>
                    <el-button @click="saveRegion" icon="el-icon-circle-check-outline">保存</el-button>
                </el-row>
            </template>
        </el-card>
        <!-- 选择加入的人员库 -->
        <el-row class="box-card repo-card" v-if="repoVisiable">
            <el-row class="clearfix filter_result_count">
                <span>请选择加入的人员库</span>
            </el-row>
            <el-radio-group v-model="repoID" class="repo-body">
                <el-radio v-for="(v,i) in personRepoes" :label="i" border>{{v.groupName}}</el-radio>
            </el-radio-group>
            <el-row class="repo-foot">
                <el-button type="primary" @click="insertRepo">确认</el-button>
                <el-button @click="cancelRepo">取消</el-button>
            </el-row>
        </el-row>
	</div>
</template>

<script>
	import { LMap, LTileLayer, LCircle, LTooltip } from 'vue2-leaflet'
	import 'leaflet.pm'
    import 'leaflet.pm/dist/leaflet.pm.css'
    import { insertTaskDetail,selectAllTaskDetailsByTaskId,delectTaskDetailById,selectTaskResultByTaskId,selectAllKeyPersonnelType,insertKeyPersonnelDataByTaskIdAndKeyType,taskSendFinishCode,insertSpecialUserByGroupIdOrSpecialCode } from '@/controller/api'
    import {timeFormat} from "@/controller/utils"
    import '../../../static/proj4-compressed.js';
    import '../../../static/proj4leaflet.js';
    import '../../../static/leaflet-heat.js';
    import {tileURL,crs,centerPoint,mapZoom} from '../../../static/crs-script.js';
    
  	export default{
  		components: {
            LMap,
            LTileLayer,
            LCircle,
            LTooltip,
        },
        data() {
            return {
                detailNames:[],
                tooltipOptions:{
                    permanent:true
                },
                zoom: mapZoom,//地图缩放比例
                center: centerPoint,
		            crs:crs,
		            url:tileURL,
                gender:null,//性别
                age:null,//年龄段
                duration:null,//停留时长
                totalCount:0,//查询结果总人数
                result:[],//查询结果
                resultVisiable:false,//查询框展示状态
                region:null,//地标区域
                regions:[],//地标区域数组
                formProvenance:{
                    province:null,//来源地 省
                    city:null,//来源地 市
                    area:null,//来源地 区
                },//来源地信息
                provenance:null,//来源地
                type:0,//来源地级别
                provinces:[],//来源地 省 临时存储数组
                cities:[],//来源地 市 临时存储数组
                areaes:[],//来源地 区 临时存储数组
                provenances:[],//来源地查询数组
                dialogAddRegionVisible:false,//地标添加弹框可视状态
                dialogAddProvenanceVisible:false,//来源地添加弹框可视状态
                timeRange:".25",
                regionInfo:{
                    regionName:null,//地标区域 名称
                    startTime:null,//开始时间
                    // endTime:null,//结束时间
                },//地标区域详细信息
                LayerGroup:false,//区域组
                singleRegionVisible:false,//单个区域是否展示1
                singleRegion:null,//单个区域信息
                regionCount:null,//所出现案发区域数
                repoVisiable:false,//是否导入人员库弹框状态
                repoID:null,
                personRepoes:[],
                rules:{
                    regionName: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                    startTime: [
                        { required: true, message: '请选择开始时间', trigger: 'blur' },
                    ],
                    // endTime: [
                    //     { required: true, message: '请选择结束时间', trigger: 'blur' },
                    // ]
                },
                isCreated:false,//是否创建
                isResulted:false,//是否返回结果
                isInrepo:this.$store.state.isGrouped,//是否入库
                isSearching:false,//是否正在查询
                taskStatus:null,
                pickerBeginDateBefore: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                pickerBeginDateAfter: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                telnoArr:null,
                imsis:null,
                taskResults:[]
            }
        },
        mounted(){
            this.getRegions()
        },
        methods:{
            getParam(val){
                var str = "";
                 for (var i = 0; i < val.length; i++) {
                    str += val[i]+ ",";
                 }
                //去掉最后一个逗号(如果不需要去掉，就不用写)
                if (str.length > 0) {
                  str = str.substr(0, str.length - 1);
                }
                return str;
            },
            formatTimePost(row) {
                if(row) {
                    let date = `${row.substr(0,4)}-${row.substr(4,2)}-${row.substr(6,2)} ${row.substr(8,2)}:${row.substr(10,2)}:${row.substr(12,2)}`
                    return date
                }
                return null;
            },
        	/**
        	 * [重置按钮点击]
        	 */
        	reset(){
        		this.gender = null
        		this.age = null
        		this.duration = null
        	},
            /*
            * 随机生成11位数字
            * */
            rand(min,max) {
                return Math.floor(Math.random()*(max-min))+min;
            },
            /**
             * [查看返回结果]
             * @return {[type]} [description]
             */
            scanResult(){
                selectTaskResultByTaskId({
                    minMatchTimes:this.regionCount,
                    taskId:this.$store.state.taskId
                }).then(res => {
                    res = res.data
                    if(!res.code){
                        this.taskResults = res.data
                        this.resultVisiable = true
                      //  this.result = res.data
                        this.totalCount = res.data.length
                        this.telnoArr = res.data.map(v => v.telno).toString()
                        this.imsis = res.data.map(v => v.imsi).toString()
                        this.result=res.data.map(item=>{
                            item.detailName = this.getParam(item.detailNames)
                            item.telno = item.telno+"****"
                          return item
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            },
            /**
             * [查询按钮点击]
             * @return {[type]} [description]
             */
            search(){
                let _this = this
                let _customIds = this.regions.map(item => {
                    return item.customId
                })
                let _cityIds = this.provenances.map(item => {
                    return item.code
                })
                // 任务创建结束修改后台状态码
                taskSendFinishCode({
                    id:this.$store.state.taskId,
                    minMatchTimes:this.regionCount,
                    taskName:this.$store.state.taskName
                }).then(res => {
                    res = res.data
                    if(!res.code){
                        this.$message({
                            type: 'success',
                            message: "预计查询时间一小时",
                            onClose:function(){
                                _this.openSearch()
                            }
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            },
            /**
             * [打开地标添加弹框]
             */
            openAddRegionDialog(){
                this.region ? this.$refs.map.mapObject.removeLayer(this.region) : ''
                // this.LayerGroup ? this.$refs.map.mapObject.removeLayer(this.LayerGroup) : ''
                this.LayerGroup = false
                this.singleRegionVisible = false
                this.dialogAddRegionVisible = true
            },
        	/**
             * [绘制圆形区域]
             * @param  {[Array]} center [中心点坐标]
             * @param  {[Float]} radius [半径]
             * @param  {[Boolean]} edit   [是否可编辑]
             * @return {[type]}        [null]
             */
        	drawCircle(center,radius,edit){
                center = this.$refs.map.mapObject.getCenter()
        		this.region ? this.$refs.map.mapObject.removeLayer(this.region) : ''
                this.region=L.circle(center,radius).addTo(this.$refs.map.mapObject)
                edit ? this.region.pm.enable() : null
                let _this = this;
                this.region.on('pm:markerdragend', function(e) {
                    if (_this.region.getTooltip() === undefined) {
                         _this.region.bindTooltip('半径：' + _this.region.getRadius().toFixed(1), {
                            permanent : true,
                        });
                    } else {
                         _this.region.setTooltipContent('半径：' + _this.region.getRadius().toFixed(1));
                    }
                });
        	},
            /**
             * [清除绘制的区域]
             */
            clearCircle(){
                this.region ? this.$refs.map.mapObject.removeLayer(this.region) : ''
                this.regionInfo={
                    regionName:null,//地标区域 名称
                    startTime:null,//开始时间
                    endTime:null,//结束时间
                }
            },
            /**
             * [区域组展示]
             * @param  {[type]} data [所有区域信息]
             * @return {[type]}      [description]
             */
            regionGroup(data){
              this.LayerGroup = new L.LayerGroup()
              data.map((v) => {
                let circleRegion=new L.circle([v.lng,v.lat], v.radius);
                this.LayerGroup.addLayer(circleRegion)
              })
              this.LayerGroup.addTo(this.$refs.map.mapObject)
            },
            /**
             * [保存地标区域信息]
             */
            saveRegion(){
                let _this=this
                this.$refs["regionForm"].validate(async (valid) => {
                    if (valid) {
                        if(!this.region){
                            _this.$message({
                                type: 'error',
                                message: "请绘制区域"
                            })
                        }else{
                            // 获取圆形区域中心点
                            let regionCenter = this.region.toGeoJSON().geometry.coordinates
                            // let regionGeoData = {
                            //     lat : regionCenter[1],
                            //     lon : regionCenter[0]
                            // }
                            // 获取圆形区域半径
                            let regionRadius = this.region.getRadius()
                            if(regionRadius > 750){
                                this.$message({
                                    type: 'error',
                                    message: "半径过大，影响查询效率，请重新绘制"
                                })
                            }else{
                                // 区域信息保存至数据库
                                insertTaskDetail({
                                    taskId:this.$store.state.taskId,
                                    detailName: this.regionInfo.regionName,
                                    startTime: timeFormat(this.regionInfo.startTime,"YYYYMMDDhhmmss"),
                                    endTime: timeFormat(new Date(this.regionInfo.startTime).getTime()+60*60*1000*this.timeRange,"YYYYMMDDhhmmss"),
                                    lng: regionCenter[0],
                                    lat: regionCenter[1],
                                    radius: regionRadius,
                                    taskStatus:this.taskStatus,
                                    taskId:this.$store.state.taskId
                                }).then(res => {
                                    console.log(res)
                                    res = res.data
                                    if(!res.code){
                                       // this.regions.push(res.data)
                                       this.getRegions()
                                    }else{
                                        _this.$message({
                                            type: 'error',
                                            message: res.msg
                                        })
                                    }
                                })
                                this.clearCircle()
                                this.dialogAddRegionVisible = false
                            }

                            // 区域详情添加到区域数组中
                            // this.regions.push({
                            //     landmarkName:this.regionInfo.regionName,
                            //     beginTime:this.regionInfo.startTime,
                            //     endTime:this.regionInfo.endTime,
                            //     lonAndLat:Object.assign(regionGeoData,{radius:regionRadius})
                            // })
                        }
                    }
                })
            },
            /**
             * [点击区域，地图展示信息]
             * @param  {[Object]} data [详细区域信息]
             */
            showRegion(data){
                this.LayerGroup = false
                // this.LayerGroup ? this.$refs.map.mapObject.removeLayer(this.LayerGroup) : ''
                // let center = [data.lng,data.lat]
                // let radius = data.radius
                // this.drawCircle(center,radius,false)
                this.singleRegion = data
                this.singleRegionVisible = true
            },
            /**
             * [根据状态获取所有区域信息]
             * @param  {[type]} status [1未完成 2完成 不传默认查所有]
             * @return {[type]}        [description]
             */
            getRegions(){
                let _this=this
                selectAllTaskDetailsByTaskId({
                    taskId:this.$store.state.taskId
                }).then(res => {
                    res = res.data
                    if(!res.code){
                        if(res.data.taskDetails){
                            this.regions = res.data.taskDetails
                            this.regionCount = res.data.taskDetails.length
                            let lng = this.regions[0].lng
                            let lat = this.regions[0].lat
                            this.$refs.map.mapObject.setView([lat,lng],15)
                        }else{
                            this.regions = []
                        }
                        this.LayerGroup = true
                        this.isCreated = res.data.taskStatus === "A" ? false : true
                        this.isResulted = res.data.taskStatus === "D" ? true : false
                        this.isSearching = res.data.taskStatus !== "A" && res.data.taskStatus !== "D"
                        this.taskStatus = res.data.taskStatus
                        // this.LayerGroup ? this.$refs.map.mapObject.removeLayer(this.LayerGroup) : ''
                        // this.regionGroup(this.regions)
                    }else{
                        _this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            },
            /**
             * [根据id删除区域信息]
             * @param  {[type]} index [区域id]
             * @return {[type]}       [description]
             */
            removeRegion(index){
                let _this=this
                // this.regions.splice(index,1)
                delectTaskDetailById({
                    id:index,
                    taskStatus:this.taskStatus,
                    taskId:this.$store.state.taskId
                }).then(res => {
                    res = res.data
                    if(!res.code){
                        _this.$message({
                            type: 'success',
                            message: "删除成功"
                        })
                        this.getRegions()
                    }else{
                        _this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            },
            openRepoDialog(){
                this.repoVisiable = true
                selectAllKeyPersonnelType({}).then(res => {
                    res = res.data
                    if(!res.code){
                        this.personRepoes = res.data
                        console.log(this.personRepoes)
                    }
                })
            },
            openSearch(){
                this.$emit("openSearch",false)
            },
            /**
             * 导入人员库
             */
            insertRepo(){
                insertSpecialUserByGroupIdOrSpecialCode({
                    groupId:this.personRepoes[this.repoID].groupId,
                    specialCode:this.personRepoes[this.repoID].specialCode,
                    //telno:this.telnoArr,
                    taskResults: this.taskResults,
                    imsi:this.imsis,
                    taskId:this.$store.state.taskId,
                    groupStatus:this.$store.state.isGrouped,
                    addType:2 //1:手动   2：批量
                }).then(res => {
                    res = res.data
                    if(!res.code){
                        this.$message({
                            type: 'success',
                            message: "导入成功"
                        })
                        this.openSearch()
                    }else{
                        this.$message({
                            type: 'error',
                            message: "导入失败："+res.msg
                        })
                    }
                })
            },
            cancelRepo(){
                this.repoVisiable = false
                this.repoID = null
            },
            /**
             * 关闭查询结果列表
             */
            closeResultList(){
                this.resultVisiable = false
            },
        },
  	}
</script>

<style lang="less" scoped>
	@import "~leaflet/dist/leaflet.css";
    .el-radio.is-bordered+.el-radio.is-bordered,.el-radio.is-bordered{
        margin: 5px;
    }
	#searchPage{
		height: 100%;
		.section{
			height: 100%;
		}
        .filter_section{
            overflow: auto;
            .filter_title{
                padding: 0 10px;
                color:#fff;
                font-size: 18px;
                line-height: 40px;
                background: #6d9ed6;
            }
            .region_item{
                margin-bottom: 5px;
            }
        }
        .map_section{
            position: relative;
        }
        .dialog{
            position: absolute;
            top: 100px;
            right: 80px;
            z-index: 999;
            max-width: 420px;
            .dialog_item{
                margin-bottom: 8px;
            }
            .dialog_label{
                font-size: 14px;
                color: #909399;
                line-height: 32px;
            }
        }
        .dialogProvenance{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999;
            .provenance_item{
                margin-bottom:5px;
                color:#909399;
            }
        }
        .filter_item{
            color:#1992bd;
            font-size: 18px;
        }
        .filter_empty{
            text-align: center;
            font-size: 12px;
            color: #909399;
        }
        .filter_add{
            float: right;
            padding: 3px 0;
            font-size: 12px;
        }
        .box-card{
            margin-bottom: 10px;
            .card_span{
                font-size: 12px;
                display: block;
                text-align:center;
            }
        }
        .filter_result{
            position: absolute;
            left: 10px;
            bottom: 50px;
            z-index: 999;
            .save_filter_result{
                // position: absolute;
                // right: 5px;
                // line-height: 40px;
                // padding: 0!important;
                width: 100%;
            }
        }
        .filter_result_count{
            background: #45699d;
            color:#fff;
            font-size: 16px;
            line-height: 40px;
            text-align: center;
        }
        .remove_region{
            &:hover{
                color:#f00;
                cursor: pointer;
            }
        }
        .repo-card{
            position: absolute;
            right: 10px;
            bottom: 50px;
            z-index: 999;
            width: 32%;
            background: #fff;
            .repo-body{
                padding: 5px;
            }
            .repo-foot{
                margin: 10px 0;
                text-align: right;
            }
        }
	}
</style>
