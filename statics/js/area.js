let targetMemo = null
let targetMemoList = null
const AreaMixIn = {
  props: ['memos', 'className', 'char'],
  data(){
    return {
      editorVisible: false,
      orgData:'',
      covered:true
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
  methods:{
    uncover(){
      this.covered = false
    },
    cover(){
      this.covered = true
    },
    showEditor(memo) {
      this.$refs.editor.showEditor(memo)
    },
    dragStart(dragMemo) {
      targetMemo = dragMemo
      targetMemoList = this.memos
    }
  }
}
const Area = {
  template: '#areaTemplate',
  props: ['limit'],
  mixins:[AreaMixIn],
  methods: {
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
    dropMemo() {
      if(this.memos === targetMemoList){
        return
      }
      if(this.limit <= this.memos.length){
        return this.$root.notify('これ以上追加できません')
      }
      const ind = targetMemoList.indexOf(targetMemo)
      targetMemoList.splice(ind, 1)
      this.memos.push(targetMemo)
      targetMemo.belong = this.char
      this.$root.saveMemo(targetMemo)
    },
    sendComplete(m){
      const ind = this.memos.indexOf(m)
      this.memos.splice(ind, 1)
      evHub.$emit('send-complete', m)
    }
  }
}
Vue.component('my-area', Area)

const CompleteArea = {
  template:'#completeAreaTemplate',
  mixins:[AreaMixIn],
  data(){
    return {
      drawn:false
    }
  },
  created(){
    evHub.$on('send-complete', this.receiveComplete)
  },
  methods:{
    receiveComplete(m){
      m.belong = this.char
      this.memos.push(m)
      this.$root.saveMemo(m)
    },
    toggleDraw(){
      this.drawn = !this.drawn
    },
    confirmRemoveMemo(memo) {
      const ok = confirm( (memo.title || 'タイトルなし')+ 'を削除しますか？')
      if (!ok) {
        return
      }
      const ind = this.memos.indexOf(memo)
      this.memos.splice(ind, 1)
      this.$root.removeMemo(memo)
    },
  }
}
Vue.component('complete-area', CompleteArea)
