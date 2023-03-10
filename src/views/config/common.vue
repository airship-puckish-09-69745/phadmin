<script>
export default {
  // 指令
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        address: ''
      }
    }
  },
  created() {
    if (this.isEdit) {
      // 如果是编辑，拉取数据
      this.getData()
    }
  },
  methods: {
    getData() {
      this.form = {
        name: 'name',
        address: 'value'
      }
      console.log('pull data')
    },
    saveData() {
      console.log('submit data', this.form)
    }
  }
}
</script>
