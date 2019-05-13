<template>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalPage">
    </el-pagination>
</template>

<script>
  export default{
      props:{
          totalPage:Number,
          pageSize:Number,
      },
      data(){
          return{
              currentPage:1,//当前页数
          }
      },
      methods: {
          handleSizeChange(val) {
              console.log(`每页 ${val} 条`);
          },
          handleCurrentChange(val) {
              this.$emit('currentPage',val)
          }
      },
  }

</script>

<style lang="less" scoped>

</style>
