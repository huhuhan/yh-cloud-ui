/**
 * 分页查询Mixins
 */
export default {
  components: {},
  inject: ['reload'],
  mounted() {
  },
  data() {
    return {
      // 分页查询数据对象
      table: {
        listLoading: false,
        list: [],
        total: null,
        pageNum: 1,
        pageSize: 10,
        pages: null
      },
      // 表单查询对象，根据业务补充
      queryForm: {},
      // 当前所选行
      currentRow: null
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
    getTableData(param) {
      this.table.listLoading = true
      PageDataReq(undefined === param ? this.getTableDataParam() : param).then(res => {
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
    handleCurrentPage(pageNum) {
      this.table.pageNum = pageNum
      this.getTableData()
    },
    /**
     * 表单重置
     * @param formName
     */
    handleFormReset(formName) {
      // this.table.pageSize = 10
      // this.table.pageNum = 1
      // 表单要求添加prop属性
      // this.$refs[formName].resetFields()
      // this.getTableData()
      this.reload()
    },
    /**
     * 当前所选行
     * @param row
     */
    handleCurrentRow(row) {
      this.currentRow = row
      this.$log.default('选择当前行')
    },
    /* *
     * 刷新表单
     */
    handleRefreshTable() {
      this.getTableData()
    },
    /**
     * 列排序
     * el-table的@sort-change
     * el-table-column的sortable="custom" prop="后端排序字段"
     * @param sort
     */
    handleSortChange(sort) {
      if (sort.order) {
        let param = Object.assign(this.getTableDataParam(), {
          // 排序
          sort: sort.column.property,
          order: sort.order === 'ascending' ? 'asc' : 'desc'
        })
        this.getTableData(param)
      }
    },
  }
}
