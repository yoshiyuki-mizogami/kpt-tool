let targetMemo = null
let targetMemoList = null
const Area = {
  template: '#areaTemplate',
  props: ['memos', 'className', 'limit', 'char', 'complete'],
  data() {
    return {
      editorVisible: false,
      orgData:'',
      covered:true,
      draw:false
    }
  },
  created(){
    evHub.$on('uncover', this.uncover)
  },
  filters: {
    formatDatetime(v) {
      return new Date(v).toLocaleString()
    }
  },
  methods: {
    uncover(){
      this.covered = false
    },
    cover(){
      this.covered = true
    },
    showEditor(memo) {
      this.$refs.editor.showEditor(memo)
    },
    async addMemo() {
      if(this.complete){
        this.draw = true
        return
      }
      if (this.limit <= this.memos.length) {
        return
      }
      const newMemo = await this.$root.addMemo({
        title:'',
        belong:this.char
      })
      this.memos.push(newMemo)
      this.showEditor(newMemo)
    },
    confirmRemoveMemo(memo) {
      console.log(memo)
      const ok = confirm( (memo.title || 'タイトルなし')+ 'を削除しますか？')
      if (!ok) {
        return
      }

      const ind = this.memos.indexOf(memo)
      this.memos.splice(ind, 1)
      this.$root.removeMemo(memo)
    },
    dragStart(dragMemo) {
      targetMemo = dragMemo
      targetMemoList = this.memos
    },
    dropMemo() {
      if(this.memos === targetMemoList){
        return
      }
      const ind = targetMemoList.indexOf(targetMemo)
      targetMemoList.splice(ind, 1)
      this.memos.push(targetMemo)
      targetMemo.belong = this.char
      this.$root.saveMemo(targetMemo)
    }
  }
}