import L from '@/config/axios'


export const dictionaryCity = data => L('/dictionaryCity', data);

/**
 * 登录
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const login = data => L('/smart_investigation/login', data, "LOGIN");


/**
 * 添加区域
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const insertCustomRegion = data => L('/smart_investigation/insertCustomRegion', data, "post");
/**
 * 删除区域
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const deleteCustomRegion = data => L('/smart_investigation/deleteCustomRegionById', data, "post");
/**
 * 获取所有的添加区域
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const getCustomRegion = data => L('/smart_investigation/queryCustomRegionByUserIdAndStatus', data, "post");
/*
 * 根据所选条件进行号码查询
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const filtrationCondition = data => L('/smart_investigation/filtrationCondition', data, "post");


export const logout = data => L('/logout', data,'POST');

/*电子围栏-添加圆形围栏*/
export const insertOrUpdateFence =data =>L('/smart_investigation/insertOrUpdateFence',data,'POST')

/*电子围栏-添加圆形围栏*/
export const eFenceListByUserId =data =>L('/smart_investigation/eFenceListByUserId',data,)

/*
* 电子围栏-删除围栏
* */
export const deleFence =data =>L('/smart_investigation/deleteEFenceListByFenceId',data,'POST')
/*
* 电子围栏-查询单个围栏
* */
export const searchFence =data =>L('/smart_investigation/eFenceListByUserIdAndFenceId',data,'POST')

/************************************************************************************************************************/
// 案情关联号码筛查
/************************************************************************************************************************/
/**
 * 新建任务
 */
export const insertTaskDefine =data =>L('/smart_investigation/task/insertTaskDefine',data,'POST')
/**
 * 修改任务
 * @param data
 */
export const updateTaskDefine =data =>L('/smart_investigation/task/updateTaskDefine',data,'POST')


/**
 * 查询所有任务
 */
export const selectAllTaskDefines =data =>L('/smart_investigation/task/selectAllTaskDefines',data,'POST')

/**
 * 删除任务
 */
export const deleteTaskDefineById =data =>L('/smart_investigation/task/deleteTaskDefineById',data,'POST')

/**
 * 添加区域
 */
export const insertTaskDetail =data =>L('/smart_investigation/task/insertTaskDetail',data,'POST')
/**
 * 区域详情
 */
export const selectAllTaskDetailsByTaskId =data =>L('/smart_investigation/task/selectAllTaskDetailsByTaskId',data,'POST')
/**
 * 删除区域信息
 */
export const delectTaskDetailById =data =>L('/smart_investigation/task/delectTaskDetailById',data,'POST')
/**
 * 以案找号查询操作
 */
export const selectTaskResultByTaskId =data =>L('/smart_investigation/taskResult/selectTaskResultByTaskId',data,'POST')
/**
 * 任务创建结束
 */
export const taskSendFinishCode =data =>L('/smart_investigation/task/taskCreateFinish',data,'POST')
/**
 * 批量 导入人员库
 */
export const insertKeyPersonnelDataByTaskIdAndKeyType =data =>L('/smart_investigation/keyPersonnelData/insertKeyPersonnelDataByTaskIdAndKeyType',data,'POST')
export const insertSpecialUserByGroupIdOrSpecialCode =data =>L('/smart_investigation/specialUser/insertSpecialUserByGroupIdOrSpecialCode',data,'POST')
/************************************************************************************************************************/
// 重点人员管理
/************************************************************************************************************************/
/*
* 获取重点人员类型列表
* */
export const selectAllKeyPersonnelType =data =>L('/smart_investigation/specialGroup/selectAllSpecialUserGroup',data,'POST')

/*
* 添加重点人员类型
* */
export const insertKeyPersonnelType =data =>L('/smart_investigation/specialGroup/inserSpecailUserGroup',data,'POST')

/*
* 修改重点人员类型
* */
export const updateKeyPersonnelType =data =>L('/smart_investigation/specialGroup/updateSpecailUserGroup',data,'POST')

/*
* 删除重点人员类型
* */
export const delectKeyPersonnelTypeBykeyTypeId =data =>L('/smart_investigation/specialGroup/deleteSpecailUserGroupByGroupId',data,'POST')

/*
* 根据人群类型查询人员
* */
export const queryKeyPersonnelDataBykeyType =data =>L('/smart_investigation/specialUser/selectSpecialUserByGroupId',data,'POST')

/*
* 添加人员
* */

export const insertKeyPersonnelData =data =>L('/smart_investigation/specialUser/insertSpecialUserByGroupIdOrSpecialCode',data,'POST')

/*
* 修改人员
* */
export const updateKeyPersonneData =data =>L('/smart_investigation/specialUser/updateSpecialUser',data,'POST')

/*
 * 删除人员
 * */

export const delectKeyPersonnelDataBykeyId =data =>L('/smart_investigation/specialUser/delectSpecialUserByGroupId',data,'POST')

/*
 * 查询点坐标
 * */

export const searchGisBySpecialCode =data =>L('/smart_investigation/specialUser/selectSpecialUserGisBySpecialCode',data,'POST')

/*
 * 选择区域
 * */

export const queryAllChannelInfo =data =>L('/smart_investigation/queryAllChannelInfo',data,'POST')
/*
 * 选择区域及区域街道
 * */

export const selectChannelCityOrStreetInfoByParentId =data =>L('/smart_investigation/selectChannelCityOrStreetInfoByParentId',data,'POST')
/*
 * 报警信息
 * */

export const selectAllWarn =data =>L('/smart_investigation/warn/selectAllWarn',data,'POST')
/*
 * 查询区域
 * */
export const queryChannelInfoByChannelId =data =>L('/smart_investigation/queryChannelInfoByChannelId',data,'POST')
