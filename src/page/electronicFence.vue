<template>
    <div class="eleMap">
        <el-col class="warnInfo">
            <img class="warnImg" src="../assets/img/red_leftbg.png" alt="">
            <img class="warnbg" src="../assets/img/warn_background.png" alt="">
            <span class="warnGrade">一级警报</span>
            <div class="redbg">
                <vue-seamless-scroll :data="tableData" :class-option="optionLeft" class="seamless-warp2">
                    <div class="scrollWarnText" v-for="item in tableData">8月8日14:21xxxx区域进入了号码为xxxxxxx8533人员</div>
                </vue-seamless-scroll>
            </div>
            <div class="bluebg"></div>
        </el-col>
        <l-map class="mini-map" ref="map" :zoom="zoom" :minZoom="3" :center="center" :crs="crs">
            <l-tile-layer :url="url" :tms="true"></l-tile-layer>
            <l-circle v-if='singleRegionVisible'  :latLng="[singleRegion.lng,singleRegion.lat]"    :radius="singleRegion.radius">  </l-circle>

           <l-circle-marker v-for="h in warnData" :lat-lng="[h.lat,h.lng]"  :radius="h.radius" :fill-color="'#f00'" :color="'#fff'" :weight="1" :opacity="1" :fill-opacity=".8" :stroke="false">
                <l-popup>
                    <strong>
                        imsi：{{h.imsi}}<br/>
                    </strong>
                </l-popup>
            </l-circle-marker>
        </l-map>
        <!--预警列表-->
        <el-row class="warnTable">

            <el-row>
                <el-col :span="5" class="list_head">时间</el-col>
                <el-col :span="5" class="list_head">围栏</el-col>
                <el-col :span="4" class="list_head">进出方向</el-col>
                <el-col :span="5" class="list_head">是否发送短信</el-col>
                <el-col :span="5" class="list_head">号码</el-col>

            </el-row>
            <vue-seamless-scroll :data="tableData" :class-option="optionSingleHeight" class="seamless-warp">
                <el-row v-for="v in tableData" class="list_item">
                    <el-col :span="5" class="item_col item_date">
                        {{formatTimePost(v.warnTime)}}</el-col>
                    <el-col :span="5" class="item_col">{{v.fenceName}}</el-col>
                    <el-col :span="4" class="item_col">{{v.direction== 1 ? "进" : "出"}}</el-col>
                    <el-col :span="5" class="item_col">{{v.isSend==1?"发送":"未发送"}}</el-col>
                    <el-col :span="5" class="item_col">{{v.imsi.substring(0, 10)}}</el-col>

                </el-row>
            </vue-seamless-scroll>

        </el-row>

        <!--搜索区域-->
        <el-row class="search">
            <el-form :inline="true" size="mini">
                <el-form-item>
                    <el-input v-model="searchName" placeholder="请输入围栏名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="searchList()">搜索</el-button>
                </el-form-item>

            </el-form>
        </el-row>


        <!--电子围栏区域-->
        <el-row class="lbs_footer">
            <el-col class="footer_container">
                <el-row :gutter="12" style="height:120px">
                    <el-col :span="3">
                        <el-row class="addArea">
                            <i @click="isEditing ? '' : openRegionDialog()"
                               :class="{'el-icon-edit-outline' : isEditing,'el-icon-circle-plus-outline' : !isEditing}">{{isEditing ? '正在编辑...' : '添加区域'}}</i>
                        </el-row>
                    </el-col>
                    <!-- swiper start-->
                    <swiper :options="swiperOption" ref="regionSwiper" >
                        <swiper-slide v-for="(item,index) in warnData"  :class="{'swiperSlideActive' : swiperIndex == index}" >

                            <el-row class="item"  >
                                <el-row style="" >
                                    <el-col :span="14" class="itemtitle"  style="color: #404a80;font-size: 14px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                                        <span @click="showCircle(item)">{{item.fenceName}}</span>
                                    </el-col>
                                    <el-col v-if="!warnSwitch" :span="10" style="font-size: 12px;color: #FF9900;">
                                        预警未开启
                                    </el-col>
                                </el-row>
                                <el-row > {{formatTimePost(item.createTime)}}  </el-row>
                                <el-row> 预警：{{warnState[index]}} </el-row>
                                <el-row> {{warnWay[index]}}  </el-row>
                                <el-row>
                                    <i class="el-icon-setting" @click="setting(item,item.fenceId)"></i>
                                    <i class="el-icon-delete" @click="dele(item.fenceId)"></i>
                                </el-row>

                            </el-row>
                        </swiper-slide>

                        <div v-show="regionData.length>4" class="swiper-button-prev" slot="button-prev"></div>
                        <div v-show="regionData.length>4" class="swiper-button-next" slot="button-next"></div>
                    </swiper>

                    <!-- swiper end-->
                </el-row>
            </el-col>
        </el-row>


        <!--添加区域-->
        <el-card class="box-card dialog" v-if="dialogAddAreaVisible">
            <template>
                <el-row>

                    <el-row>

                        <el-select v-model="channelInfoModel" placeholder="省级地区" >
                            <el-option v-for="item in channelInfos" :key="item.id"  :label="item.channelName" :value="item.id" @click="getChannelId(item.id)"/>
                        </el-select>

                        <el-select   v-model="channelCityModel"  v-if="chooseProvinceCity"    placeholder="市级地区" >
                            <el-option v-for="item in channelCityInfos"  :key="item.id" :label="item.channelName" :value="item.id" @click="getChannelId(item.id)"/>
                        </el-select>
                        <el-select v-model="channelStreetModel"  v-if="chooseProvinceStreet"   placeholder="区级地区" >
                            <el-option v-for="item in channelStreetInfos" :key="item.id" :label="item.channelName"  :value="item.id"  @click="getChannelId(item.id)"/>
                        </el-select>
                    </el-row>
                    <el-button-group>
                        <!--   选择区域-->
                       <!-- <el-button  icon="el-icon-edit" @click="circle">圆形</el-button>-->
                        <el-button icon="el-icon-check" @click="addRegion">确认</el-button>
                        <el-button icon="el-icon-close" @click="closeRegionDialog">取消</el-button>
                    </el-button-group>
                </el-row>
            </template>
        </el-card>

        <!--报警设置-->
        <el-row class="warnboxCard" v-show="warndialogVisible" ref="warnCard">

            <div class="header ">
                <el-col :span="2" :offset="1">
                    名称：
                </el-col>
                <el-col :span="6">
                    <el-input size="mini" v-model="form.regionNames"></el-input>
                </el-col>
                <i class="icon el-icon-close" @click="warndialogVisible=false"></i>
            </div>
            <div class="boxContent">
                <el-form ref="resetForm" :model="form" label-width="90px" size="mini">
                    <el-form-item label="报警设置" class="warnset" prop="warnGrade">
                        <el-col :span="7">
                            <el-checkbox v-model="form.warningSettingEnter" @change="enterCheck">进入</el-checkbox>
                            <el-checkbox v-model="form.warningSettingLeave" @change="leaveCheck">离开</el-checkbox>
                        </el-col>
                        <el-col :span="5" v-if="switchs" class="warnSwichs">  预警开关：  <el-switch v-model="warnSwitch"  v-if="switchs"  />  </el-col>
                        <el-col :span="12">
                            <el-radio-group v-model="form.warnGrade">
                                <el-radio :label="1" border class="level"><img src="../assets/img/firstLevel.png" alt="">一级 </el-radio>
                                <el-radio :label="2" border class="level"><img src="../assets/img/threeLevel.png" alt="">二级 </el-radio>
                                <el-radio :label="3" border class="level"><img src="../assets/img/secondLevel.png" alt="">三级 </el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="选择人群类型" prop="types">
                        <el-col :span="8">
                            <el-select v-model="specialGroupModel" placeholder="请选择人群类型" @changeType="selectpeopleType"  @visible-change="visibleChange">
                                <el-option v-for="item in peopleType"  :key="item.groupId" :label="item.groupName" :value="item.groupId" />
                            </el-select>
                        </el-col>
                        <el-button type="primary" size="mini" @click="addPeopleType">添加</el-button>
                    </el-form-item>
                    <div class="peoplelist">
                        <el-tag  v-for="tag in peopletags"  :key="tag" closable size="mini" @close="closeable(tag)"> {{tag}}  </el-tag>
                    </div>

                    <el-form-item label="屏显提示内容" prop="enterMess">
                        <el-row v-if="enterTextarea">
                            <el-col :span="18">
                                <el-input type="textarea" :rows="2" v-model="form.enterMess"></el-input>

                            </el-col>
                            <el-col :span="3">
                                <el-button class="enterbtn" size="mini" type="primary" round>进</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item prop="leaveMess" class="warnset">
                        <el-row v-if="leaveTextarea">
                            <el-col :span="18">
                                <el-input type="textarea" :rows="2" v-model="form.leaveMess"></el-input>
                            </el-col>
                            <el-col :span="3">
                                <el-button class="leavebtn" size="mini" type="primary" round>出</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>


                    <el-form-item label="短信通知" prop="messageSwitch">
                        <el-row>
                            <el-col :span="23" class="messagePart">
                                <el-switch  v-model="form.messageSwitch"   @change="messageChange" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <div v-if="showMessage">
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="接收人员" prop="receivePhone">
                                    <el-input v-model="form.receivePhone" placeholder="请输入有效的11位电话号码"
                                              auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-button type="primary" size="mini" @click="addPhone">添加</el-button>

                            <div class="peoplelist">
                                <el-tag  v-for="tag in phonetags"    :key="tag"  closable   size="mini"   @close="peocloseable(tag)"    >   {{tag}}  </el-tag>
                            </div>

                        </el-row>
                        <el-form-item label="短息通知内容" prop="smsEnterContent">
                            <el-row v-if="enterTextarea">
                                <el-col :span="18">
                                    <el-input type="textarea" :rows="2" v-model="form.smsEnterContent"></el-input>
                                </el-col>
                                <el-col :span="3">
                                    <el-button class="enterbtn" :rows="2" size="mini" type="primary" round>进</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>

                        <el-form-item prop="smsLeaveContent">
                            <el-row v-if="leaveTextarea">
                                <el-col :span="18">
                                    <el-input type="textarea" :rows="2" v-model="form.smsLeaveContent"></el-input>
                                </el-col>
                                <el-col :span="3">
                                    <el-button class="leavebtn" :rows="2" size="mini" type="primary" round>出</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>

                    </div>


                    <el-form-item style="margin-left: 40%;margin-top: 10px">
                        <el-button type="primary" @click="saveRegion">确定</el-button>
                        <el-button @click="closeWarnset">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>


        </el-row>

    </div>

</template>

<script>
    import { bd_decrypt } from '@/controller/utils'
    import L from 'leaflet'
    import Vue from 'vue';
    import {LMap, LTileLayer, LMarker, LCircle, LGeoJson, LPopup, LCircleMarker} from 'vue2-leaflet'
    import 'leaflet.pm';
    import 'leaflet.pm/dist/leaflet.pm.css';
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import {
        insertOrUpdateFence,
        queryAllChannelInfo,
        eFenceListByUserId,
        deleFence,
        searchFence,
        selectAllKeyPersonnelType,
        selectChannelCityOrStreetInfoByParentId,queryChannelInfoByChannelId,
        selectAllWarn
    } from '@/controller/api'
    import {MessageBox} from 'element-ui';
    import ElRow from "element-ui/packages/row/src/row";
    import '../../static/proj4-compressed.js';
    import '../../static/proj4leaflet.js';
    import '../../static/leaflet-heat.js';
    import {tileURL,crs,centerPoint,mapZoom} from '../../static/crs-script.js';

    export default {
        data() {
            return {
                zoom: mapZoom,
                center: centerPoint,
                url: tileURL,
                crs:crs,
                isEditing: false,//是否编辑区域
                radio3: '',
                //tableTitle:[{}],
                radio2: '',
                tableData: [],
                dialogAddAreaVisible: false,//添加区域
                chooseProvinceCity:false,//选择省区域
                chooseProvinceStreet:false,//选择区域街道
                singleRegion: null,//单个区域信息
                regionType: 'circle',
                regionName: '',//区域名称
                currTime: '2018-08-08 14:12:12',//时间
                warnState: [],//预警状态
                warnWay: [],//预警方式
                isWarn: false,//是否预警
                swiperIndex: 0,
                swiperOption: {
                    slidesPerView: 6,
                    spaceBetween: 31,
                    slidesPerGroup: 1,
                    loop: false,
                    loopFillGroupWithBlank: true,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    },
                },
                searchName: '',//搜索区域名
                regionData: [],//区域数据
                region: null,//图形区域
                options: [],
                editOptions: {
                    draggable: true,
                    snappable: true,
                    snapDistance: 30,
                    allowSelfIntersection: true,
                    preventMarkerRemoval: false,
                    preventVertexEdit: false,
                },
                isSetting: false,//设置状态
                warndialogVisible: false,//报警设置
                switchs: true,//报警开关
                warnSwitch: true,//预警开关
                showMessage: false,//短信区域显示
                enterTextarea: true,//进入报警内容
                leaveTextarea: false,//离开报警内容
                form: {
                    regionNames: '',
                    types: '',
                    channelId: '',
                    warnGrade: '',//预警等级
                    warnValueEnd: '',//结束
                    warningSettingEnter: true,//进入
                    warningSettingLeave: false,//离开
                    enterMess: '',//进入提示内容
                    leaveMess: '',//离开提示内容
                    messageSwitch: false,
                    receivePhone: null,//接收人员
                    smsWarningEnter: '',//进入
                    smsWarningLeave: '',//离开
                    smsEnterContent: '',//短信通知内容
                    smsLeaveContent: '',//短信离开内容

                },
                formLabelWidth: '80px',
                phonetags: [],
                peopletags: [],//已添加人群类型
                warnData: [],//围栏预警设置
                peopleType: [],//人员类型
                channelInfos: [],//区域列表
                channelInfo: '',//区域列表
                channelCityInfos:[],
                channelStreetInfos:[],
                channelInfoModel: '',
                channelCityModel:'',
                channelStreetModel:'',
                specialGroupModel:'',
                regions: [],//地标区域数组
                singleRegionVisible: false,//单个区域是否展示1
                channelId:'',
                groupIds:[],
                specialCodes:[]
            }
        },
        watch: {
            channelInfoModel: function (val) {
                var channelId = val
                var channelInfos = this.channelInfos
                for (var i = 0;i<channelInfos.length;i++){
                    if(channelInfos[i].id == channelId ){
                        var channelInfo = channelInfos[i]
                        this.circle(channelInfo)
                        this.selectChannelCityInfo(channelId)
                        var channelCityInfos = this.channelCityInfos
                        this.chooseProvinceCity = true
                        this.channelId = channelId
                    }
                }

            },
            channelCityModel:function (val) {
                var channelId = val
                var channelInfos = this.channelCityInfos
                for (var i = 0;i<channelInfos.length;i++){
                    if(channelInfos[i].id == channelId ){
                        var channelInfo = channelInfos[i]
                        this.circle(channelInfo)
                        this.selectChannelStreetInfo(channelId)
                        var channelStreetInfos = this.channelStreetInfos
                        this.chooseProvinceStreet = true
                        this.channelId = channelId
                    }
                }
            },
            channelStreetModel:function (val) {
                var channelId = val
                var channelInfos = this.channelStreetInfos
                for (var i = 0;i<channelInfos.length;i++){
                    if(channelInfos[i].id == channelId ){
                        var channelInfo = channelInfos[i]
                        this.circle(channelInfo)
                        this.channelId = channelId
                    }
                }
            }

        },
        components: {
            ElRow,
            LMap,
            LTileLayer,
            LMarker,
            LCircle,
            LCircleMarker,
            LPopup,
            swiper,
            swiperSlide,

        },
        computed: {
            optionLeft() {
                return {
                    direction: 2,
                    limitMoveNum: 2
                }
            },
            optionSingleHeight() {
                return {
                    singleHeight: 30,
                    waitTime: 2500
                }
            },


        },
        getChannelId(channelId){
            this.channelId = channelId

        },
        mounted() {
            this.getRegionList()
            this.getAllWarnInfo()
        },
        methods: {


            formatTimePost(row) {
                if (row) {
                    let date = new Date(row);
                    let Y = date.getFullYear() + '-';
                    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
                    let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
                    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
                    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
                    return Y + M + D + h + m + s;
                }
                return null;
            },
            getRowClass({row, column, rowIndex, columnIndex}) {
                if (rowIndex === 0) {
                    let obj = {
                        background: '#3C7AB7',
                        color: '#fff'
                    }
                    return obj
                } else {
                    return ''
                }
            },
            openRegionDialog() {
                this.dialogAddAreaVisible = true
                this.selectChannelInfo()

            },
            //选择省区域
            selectChannelInfo() {
                queryAllChannelInfo({}).then(res => {
                    res = res.data
                    if (!res.code) {
                        this.channelInfos = res.data
                    }
                })

            },
            //选择区域
            selectChannelInfoByChannelId(val) {
                queryChannelInfoByChannelId({
                    id:val
                }).then(res => {
                    res = res.data
                    if (!res.code) {
                        console.log(res.data)
                        this.circle(res.data)
                    }
                })

            },
            //选择区域
            selectChannelCityInfo(val) {
                selectChannelCityOrStreetInfoByParentId({
                    parentChannelId:val
                }).then(res => {
                    res = res.data
                    if (!res.code) {
                        this.channelCityInfos = res.data
                    }
                })

            },
            //选择街道
            selectChannelStreetInfo(val) {
                selectChannelCityOrStreetInfoByParentId({
                    parentChannelId:val
                }).then(res => {
                    res = res.data
                    if (!res.code) {
                        this.channelStreetInfos = res.data
                    }
                })

            },
            showCircle(data) {
                this.singleRegion = data
                this.singleRegionVisible = true
                console.log(data)
                this.selectChannelInfoByChannelId(data.channelId)
            },

            //圆形
            circle(channelInfo) {
                let tmp = bd_decrypt(channelInfo.lng,channelInfo.lat)

                let lng = tmp.lng
                let lat = tmp.lat
                let zoom = channelInfo.zoom
                this.singleRegionVisible=false
                this.region ? this.$refs.map.mapObject.removeLayer(this.region) : ''
                this.region=L.circle([lat,lng],zoom).addTo(this.$refs.map.mapObject)
                this.$refs.map.mapObject.setView([lat,lng],zoom)
                //可调半径
                //this.region.pm.enable(this.editOptions)
                this.type='circle'
            },
            clearCircle() {
                this.region ? this.$refs.map.mapObject.removeLayer(this.region) : ''

            },
            //关闭
            closeRegionDialog() {
                this.dialogAddAreaVisible = false
                this.chooseProvinceCity = false
                this.chooseProvinceStreet = false
                this.channelInfoModel =''
                this.clearCircle()
            },
            addRegion() {
                this.warndialogVisible = true
                this.$refs.resetForm.resetFields()
                this.form.regionNames = ''
                this.phonetags = [],//清空
                    this.peopletags = [],
                    this.groupIds=[],
                    this.specialCodes=[]
                this.form.warningSettingLeave = false
                this.leaveTextarea = false
                this.isSetting = false
                this.showMessage = false

            },

            //删除标签
            closeable(val) {
                this.peopletags.splice(this.peopletags.indexOf(val), 1)
                this.specialCodes.splice(this.specialCodes.indexOf(val), 1)
                this.groupIds.splice(this.groupIds.indexOf(val), 1)
            },
            peocloseable(val) {
                this.phonetags.splice(this.phonetags.indexOf(val), 1)
            },
            closeWarnset() {
                this.warndialogVisible = false
                this.clearCircle()
            },
            //添加电话号码
            addPhone() {
                this.phonetags.push(this.form.receivePhone)
                this.form.receivePhone = null

            },
            //进入
            enterCheck(val) {

                if (val) {
                    this.enterTextarea = true

                } else if (!val) {
                    this.enterTextarea = false
                }

            },
            //离开
            leaveCheck(val) {
                if (val) {
                    this.leaveTextarea = true
                } else if (!val) {
                    this.leaveTextarea = false
                }
            },
            //切换短信开关
            messageChange(val) {
                if (this.form.messageSwitch) {
                    this.showMessage = true
                } else if (!this.form.messageSwitch) {
                    this.showMessage = false
                }
            },
            addPeopleType() {
                var specialUser = this.peopleType
                console.log(specialUser)
                for(var i = 0;i<specialUser.length;i++){
                    if(this.specialGroupModel == specialUser[i].groupId){
                        this.peopletags.push(specialUser[i].groupName)
                        this.specialCodes.push(specialUser[i].specialCode)
                    }
                }

                this.groupIds.push(this.specialGroupModel)
            },

            visibleChange(isVisible) {
                if (isVisible) {
                    this.selectpeopleType()
                }
            },
            visibleChannelInfoChange(isVisible, channelInfo) {
                if (isVisible) {
                    this.selectChannelInfo()
                }
            },
            //选择人群类型
            selectpeopleType() {
                selectAllKeyPersonnelType({}).then(res => {
                    res = res.data
                    if (!res.code) {
                        this.peopleType = res.data
                    }

                })

            },
            //保存区域
            saveRegion() {
//                if (this.isSetting) {
//                    //修改操作直接返回
//                    this.warndialogVisible = false
//                    return
//                }
                //信息验证
                if (!this.form.regionNames) {
                    this.$message.warning('名称不能为空！')
                    return
                }
                if (!this.form.warnGrade) {
                    this.$message.warning('请选择预警等级！')
                    return
                }
                if (!this.peopletags) {
                    this.$message.warning('请选择人群类型！')
                    return
                }
                if (this.form.warningSettingEnter) {
                    if (!this.form.enterMess) {
                        this.$message.warning('请填写进入屏幕显示信息！')
                        return
                    }
                }
                if (this.form.warningSettingLeave) {
                    if (!this.form.leaveMess) {
                        this.$message.warning('请填写离开屏幕显示信息！')
                        return
                    }
                }
                if (this.form.messageSwitch) {
                    if (!this.phonetags.length) {
                        this.$message.warning('请添加接收短信人员号码！')
                        return
                    }
                    if (!this.form.smsEnterContent) {
                        this.$message.warning('请添加进入短信通知内容！')
                        return
                    }
                    if (this.form.warningSettingLeave) {
                        if (!this.form.smsLeaveContent) {
                            this.$message.warning('请添加离开短信通知内容！')
                            return
                        }
                    }
                }
                let regionCenter = this.region.toGeoJSON().geometry.coordinates
                // 获取圆形区域半径
                let regionRadius = this.region.getRadius()
                insertOrUpdateFence({
                    fenceId: this.fenceId,
                    warningSwitch: this.warnSwitch ? 1 : '',
                    warningLevel: this.form.warnGrade,
                    specialCodes:this.specialCodes,
                    groupIds:this.groupIds,
                    fenceName: this.form.regionNames,//围栏名称
                    warningSettingEnter: this.form.warningSettingEnter ? 1 : '',
                    warningSettingLeave: this.form.warningSettingLeave ? 1 : '',
                    enterContent: this.form.enterMess,//屏幕进入内容
                    leaveContent: this.form.leaveMess,//离开内容
                    crowdId: 1,//人群类型
                    smsSwitch: this.form.messageSwitch ? 1 : '',//是否短信通知
                    lng: regionCenter[1],
                    lat: regionCenter[0],
                    radius: regionRadius,
                    channelId:this.channelId,
                    recievePhones: this.phonetags,
                    smsWarningEnter: this.form.smsWarningEnter ? 1 : '',
                    smsWarningLeave: this.form.smsWarningLeave ? 1 : '',
                    smsEnterContent: this.form.smsEnterContent,
                    smsLeaveContent: this.form.smsLeaveContent,
                }).then(res => {

                    res = res.data
                    if (!res.code) {
                        this.warndialogVisible = false
                        this.dialogAddAreaVisible = false
                        this.channelInfoModel =''
                        this.getRegionList()
                    } else {
                        _this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }

                })

            },
            //获取报警信息
            getAllWarnInfo(){
                selectAllWarn({}).then(res => {
                    res = res.data
                    if (!res.code) {
                        this.tableData = res.data
                    }
                })
            },
            //获取围栏列表
            getRegionList() {
                eFenceListByUserId({}).then(res => {
                    res = res.data
                    if (!res.code) {
                        this.warnData = res.data
                        this.warnData.map((item, index) => {
                            if (item.warningSettingEnter && item.warningSettingLeave) {
                                this.warnState.push('进入+离开')
                            } else if (item.warningSettingEnter && !item.warningSettingLeave) {
                                this.warnState.push('进入')
                            } else if (item.warningSettingLeave && !item.warningSettingEnter) {
                                this.warnState.push('离开')
                            } else {
                                this.warnState.push('无')
                            }
                            if (item.warningSettingEnter || item.warningSettingLeave) {
                                if (item.smsSwitch) {
                                    this.warnWay.push('屏幕+短信')
                                } else if (!item.smsSwitch) {
                                    this.warnWay.push('屏幕')
                                }
                            } else if (item.smsSwitch) {
                                this.warnWay.push('短信')
                            } else {
                                this.warnWay.push('无')
                            }
                            this.circleArea(item)

                        })



                    } else {
                        _this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }

                })


            },
            circleArea(item){
//                let lng = item.lng
//                let lat = item.lat
//                let zoom = 50
                this.singleRegion = item
                this.singleRegionVisible = true
//                this.region ? this.$refs.map.mapObject.removeLayer(this.region) : ''
//                this.region=L.circle([lat,lng],zoom).addTo(this.$refs.map.mapObject)
//                this.$refs.map.mapObject.setView([lat,lng],zoom)
//                //可调半径
//                //this.region.pm.enable(this.editOptions)
//                this.type='circle'
            },
            //设置
            setting(data, id) {
                this.$refs.resetForm.resetFields()
                this.warnSwitch = true
                this.warndialogVisible = true
                this.isSetting = true
                this.fenceId = id
                searchFence({
                    fenceId: id
                }).then(res => {
                    let data = res.data.data
                    this.form.regionNames = data.fenceName
                    this.form.type = '类型一'
                    this.form.warningSettingEnter = data.warningSettingEnter ? true : false
                    this.form.warningSettingLeave = data.warningSettingLeave ? true : false
                    this.form.enterMess = data.enterContent
                    this.form.leaveMess = data.leaveContent
                    this.form.smsSwitch = data.messageSwitch
                    this.form.receivePhone = data.recievePhone
                    this.form.smsWarningEnter = data.smsWarningEnter ? true : false
                    this.form.smsWarningLeave = data.smsWarningLeave ? true : false
                    this.form.smsEnterContent = data.smsEnterContent
                    this.form.smsLeaveContent = data.smsLeaveContent
                    this.phonetags = data.groupNames
                    this.peopletags = data.groupNames
                    this.form.warnGrade =data.warningLevel
                    //进入离开内容显示
                    this.form.warningSettingEnter ? this.enterTextarea = true : this.enterTextarea = false
                    this.form.warningSettingLeave ? this.leaveTextarea = true : this.leaveTextarea = false
                    //短信内容显示
                    this.form.smsSwitch ? this.showMessage = true : this.showMessage = false
                    this.selectChannelInfoByChannelId(data.channelId)
                })


            },
            dele(id) {
                MessageBox.confirm('确定删除该区域', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleFence({
                        fenceId: id
                    }).then(res => {
                        res = res.data
                        if (!res.code) {
                            this.$message({
                                type: 'success',
                                message: "删除成功"
                            })
                            this.getRegionList()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                })


            }

        }
    }


</script>

<style lang="less">
    @import "~leaflet/dist/leaflet.css";

    .eleMap {
        position: relative;
        height: 90%;
        .warnInfo {
            position: relative;
            width: 100%;
            height: 40px;
            .warnbg {
                position: absolute;
                top: -1px;
                height: 35px;
            }
            .warnImg {
                position: absolute;
                top: -11px;
                height: 50px;
            }
            .warnGrade {
                position: absolute;
                left: 10px;
                top: 7px;
                color: white;
            }
            .redbg {
                /*width: 100%;*/
                height: 26px;
                background-color: #F71C3A;
                text-align: center;
                line-height: 26px;
                padding-left: 60px;

                .seamless-warp2 {
                    overflow: hidden;
                    height: 26px;
                    margin-left: 100px;
                    .scrollWarnText {
                        float: left;
                        color: white;
                        margin-left: 100px;

                    }
                }

            }
            .bluebg {
                width: 100%;
                height: 8px;
                background-color: #325FA3;
            }
        }
        .mini-map {
            height: 90%;
        }
        .warnTable {
            position: absolute;
            bottom: 190px;
            z-index: 1000;
            width: 700px;
            overflow: hidden;
            .list_head {
                background-color: #3190e8;
                color: white;
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-size: 14px;
            }
            .seamless-warp {
                height: 144px;
                overflow: hidden;
                font-size: 14px;
                color: #818181;
                .list_item {
                    height: 30px;
                    background-color: #EFEFEF;
                    text-align: center;
                    line-height: 30px;

                }
                .list_item:nth-child(odd) {
                    background-color: #C9C9C9;

                }
            }

        }
        .search {
            position: absolute;
            bottom: 143px;
            z-index: 1000;
            width: 400px;
        }

        .lbs_footer {
            position: absolute;
            bottom: 0;
            z-index: 1000;
            width: 100%;
            .footer_container {
                display: block;
                height: 140px;
                background-color: rgba(140, 144, 145, 0.8);
                padding: 20px;
                .addArea {
                    height: 100px;
                    border-radius: 4px;
                    color: #535762;
                    font-family: '微软雅黑';
                    text-align: center;
                    line-height: 100px;
                    cursor: pointer;
                    background-color: #199ED7;
                }
                .item {
                    border-radius: 4px;
                    color: #404a80;
                    padding: 5px;
                    background-color: #fff;
                    font-family: '微软雅黑';
                    font-size: 14px;
                    height: 100px;
                    cursor: pointer;

                }

            }

        }
        .box-card {
            position: fixed;
            bottom: 140px;
            right: 20px;
            width: 660px;
            background-color: #ffffff;
            z-index: 999;
            border-radius: 4px;
            box-shadow: 0px 0px 8px 2px #cfd2e5;
        }
        .el-card__header {
            background-color: #3190e8;
        }
        .warnboxCard {
            width: 650px;
            background-color: #ffffff;
            position: absolute;
            top: 10%;
            right: 10px;
            z-index: 1000;
            font-size: 14px;

            .header {
                position: relative;
                height: 40px;
                background-color: #3C7AB7;
                color: #fff;
                font-size: 12px;
                line-height: 40px;
                .switchMess {
                    margin-left: 25%;
                    margin-right: 10px;

                }
                .icon {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    cursor: pointer;
                    transform: translateY(-50%);
                }
            }
            .boxContent {
                height: 340px;
                overflow: auto;
                .warnset {
                    padding-bottom: 5px;
                    border-bottom: 1px solid #467AB9;
                }
                .peoplelist {
                    width: 80%;
                    height: 50px;
                    margin: 12px 0px 5px 90px;
                    border: 1px solid #D7DDE8;
                }
                .warnSwichs {
                    font-size: 12px;
                    color: #467AB9;
                }
                .line {
                    position: absolute;
                }
                .level {
                    font-size: 12px;
                    color: #828282;
                    margin-right: 5px;
                    cursor: pointer;
                    img {
                        vertical-align: middle;
                    }
                }
                .screenText {
                    font-size: 12px;
                    color: #467AB9;
                    /* margin-left: 20px;*/
                }
                .enterbtn {
                    margin-left: 63%;

                }
                .leavebtn {
                    margin-left: 63%;
                }
                .messagePart {
                    border-bottom: 1px solid #467AB9;
                    padding-bottom: 5px;

                }

                .el-form-item {
                    margin-bottom: 3px;
                }
                .el-form-item > .el-form-item__label {
                    font-size: 12px;
                    color: #467AB9;
                }
                .el-button--mini {
                    padding: 3px 11px
                }
                .el-radio.is-bordered + .el-radio.is-bordered {
                    margin-left: 0;
                }
            }

        }
    }

</style>
