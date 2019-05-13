<template>
    <el-container class="task_list">
        <el-header class="task_head">
            <el-col :span="18">
                <span>案情关联号码筛查记录</span>
                <el-button type="primary" @click="createNewTask">新建任务</el-button>
            </el-col>
            <el-col :span="6">
                <el-input placeholder="请输入任务名称" v-model="taskName" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="selectAllTaskDefines"></el-button>
                </el-input>
            </el-col>
        </el-header>
        <el-main>
            <el-table :data="taskData" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="taskName" label="任务名称"></el-table-column>
                <el-table-column prop="operator" label="操作人"></el-table-column>
               <!-- <el-table-column prop="detailNames" label="案发区域"></el-table-column>-->
                <el-table-column label="创建时间">
                  <template slot-scope="scope">
                      {{formatTime(scope.row.opTime)}}
                  </template>
                </el-table-column>
                <el-table-column prop="taskResultCount" label="筛查结果（条数）"></el-table-column>
                <el-table-column label="是否加入库">
                  <template slot-scope="scope">
                      {{scope.row.groupStatus == 1 ? "是" : "否"}}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="openSearch(scope.row)">{{scope.row.taskStatus === "A" ? "添加详情" : (scope.row.taskStatus === "D" ? "查看详情" : "正在查询")}}</el-button>
                        <el-button size="mini"  @click="updateTask(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" @click="deleteTask(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>

        <!-- 新建任务弹出框 -->
        <el-dialog :title="isEdit ? '修改任务' : '添加任务'" :visible.sync="taskDialogVisible" :show-close="false" width="30%" :close-on-click-modal="false">
          <el-form :model="taskForm" label-width="80px" ref="taskForm" :rules="taskRules">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="taskForm.name"></el-input>
            </el-form-item>
            <el-form-item label="操作员">
              <el-input v-model="taskForm.handler" disabled></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="taskCancel">取 消</el-button>
            <el-button type="primary" @click="taskConfirm">确 定</el-button>
          </div>
        </el-dialog>


        <el-pagination class="pager" background @current-change="currentChange" :current-page="CurrentPage" :page-size="size" layout="total, prev, pager, next" :total="totalCount"></el-pagination>
    </el-container>
</template>

<script>
import { insertTaskDefine,selectAllTaskDefines,deleteTaskDefineById,updateTaskDefine } from "@/controller/api"
export default {
  components: {
      // headline: () => import('../components/head/head'),
  },
  data () {
    return {
        taskData: [],
        isEdit:false,
        taskName:null,
        taskDialogVisible:false,//新建任务弹出框状态
        taskForm:{
            name:null,
            handler:this.$store.state.userInfo.userName
        },
        taskRules: {
            name: [
                { required: true, message: '请输入任务名称', trigger: 'blur' },
            ]
        },
        size:10,
        CurrentPage:1,
        totalCount:0
    }
  },
  mounted(){
    this.selectAllTaskDefines()
  },
  methods: {
    createNewTask(){
        this.taskDialogVisible = true
    },
      updateTask(row){
          this.taskDialogVisible = true
          this.taskForm ={
              id:row.id,
              name: row.taskName
          }
      },
    deleteTask(row){
        this.$confirm('删除后数据无法恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTaskDefineById({
            id:row.id
          }).then(res => {
            res = res.data
            if(!res.code){
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.selectAllTaskDefines()
            }else{
              this.$message({
                  type: 'error',
                  message: res.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 查询所有任务
    selectAllTaskDefines(){
      selectAllTaskDefines({
        taskName:this.taskName ? this.taskName : null,
        pageNum:this.CurrentPage,
        pageSize:this.size
      }).then(res => {
        res = res.data
        if(!res.code){
          this.taskData = res.data ? res.data : []
          this.totalCount = res.total ? res.total : 0
        }
      })
    },
    taskConfirm(){
        this.$refs["taskForm"].validate(async (valid) => {
            if (valid) {
                if (this.isEdit) {
                    updateTaskDefine({
                        taskName: this.taskForm.name
                    }).then(res => {
                        res = res.data
                        if (!res.code) {
                            this.selectAllTaskDefines()
                            this.taskDialogVisible = false
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })

                }else {

                    insertTaskDefine({
                        taskName: this.taskForm.name
                    }).then(res => {
                        res = res.data
                        if (!res.code) {
                            this.selectAllTaskDefines()
                            this.taskDialogVisible = false
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })
                }

            }
        })
    },
    taskCancel(){
        this.taskDialogVisible = false
        this.taskForm.name = null
    },
    openSearch(val){
        this.$emit('openSearch',true)
        this.$store.state.taskId=val.id
        this.$store.state.taskName=val.taskName
        this.$store.state.isGrouped=val.groupStatus
    },
    currentChange(val){
      this.CurrentPage = val
      this.selectAllTaskDefines()
    },
    formatTime(row) {
        if(row) {
            let date = `${row.substr(0,4)}-${row.substr(4,2)}-${row.substr(6,2)} ${row.substr(8,2)}:${row.substr(10,2)}:${row.substr(12,2)}`
            return date
        }
        return null;
    },
  }
}
</script>

<style lang="less" scoped>
    .task_list{
        width: 100%;
        .task_head{
            line-height: 60px;
        }
    }
    .pager{
      text-align:right;
      padding: 0 20px;
    }
</style>

