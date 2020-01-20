/**
 * 分页查询Mixins
 */
export default {
  components: {},
  mounted() {
  },
  data() {
    return {
      //分页查询数据对象
      table: {
        key: 0,
        listLoading: false,
        list: [],
        total: null,
        pageNum: 0,
        pageSize: 10,
        pages: null
      },
      //表单查询对象，根据业务补充
      queryForm: {},
    }
  },
  beforeDestroy() {
  },
  computed: {},
  methods: {
    /**
     * 列表查询方法
     * 提供参考，复制到自己的业务组件中
     * 主要更换后端API：PageDataReq
     */
/*
    getTableData() {
      this.table.listLoading = true
      PageDataReq(this.getTableDataParam()).then(res => {
        this.table.list = res.records || res.list || res.data
        this.table.total = res.total
      }).catch(err => console.log(err)).finally(() => {
        this.table.listLoading = false
      })
    },
    //其他参数
    getTableDataParam() {
      //根据业务修改补充
      let otherParam = {}
      return Object.assign({
        pageNum: this.table.pageNum,
        pageSize: this.table.pageSize
      }, this.queryForm, otherParam)
    },
*/
    /**
     * 每页数量
     * @param pageSize
     */
    handleSizeChange(pageSize) {
      this.table.pageSize = pageSize
      this.getTableData()
    },
    /**
     * 第几页
     * @param pageNum
     */
    handleCurrentChange(pageNum) {
      this.table.pageNum = pageNum
      this.getTableData()
    },
    /**
     * 表单重置
     * @param formName
     */
    handleFormReset(formName) {
      this.$refs[formName].resetFields()
      this.getTableData()
    },
  }
}
