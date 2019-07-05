const MemoEditor = {
  template: '#editorTemplate',
  props: ['memos','char', 'complete'],
  data() {
    return {
      cursor:0,
      editTarget: null,
      orgData:'',
      movePrevent:false,
      draw:false
    }
  },
  filters: {
    formatDatetime(v) {
      return new Date(v).toLocaleString()
    }
  },
  methods: {
    cover(){
      this.movePrevent = true
      this.$parent.cover()
    },
    uncover(){
      this.movePrevent = false
      this.$parent.uncover()
    },
    moveNextMemo(){
      if(this.movePrevent){
        return
      }
      let ind = this.memos.indexOf(this.editTarget) + 1
      if(!this.memos[ind]){
        return this.$root.notify('最後のメモです')
      }
      this.checkUpdate()
      this.showEditor(this.memos[ind])
    },
    movePreviousMemo(){
      if(this.movePrevent){
        return
      }
      let ind = this.memos.indexOf(this.editTarget) + -1
      if(!this.memos[ind]){
        return this.$root.notify('最初のメモです')
      }
      this.checkUpdate()
      this.showEditor(this.memos[ind]) 
    },
    checkUpdate(){
      const current = JSON.stringify(this.editTarget)
      if(current !== this.orgData){
        this.update()
      }
    },
    escape(ev){
      this.checkUpdate()
      this.hideEditor()
    },
    async showEditor(memo) {
      this.cover()
      this.editTarget = memo
      this.orgData = JSON.stringify(this.editTarget)
      const latestMemo = await this.$root.getMemo(memo.id)
      Object.assign(this.editTarget, latestMemo)
      this.orgData = JSON.stringify(latestMemo)
      this.uncover()
      this.$nextTick(()=>{
        let focusTarget = this.$refs.editor
        if(!this.editTarget.title){
          focusTarget = this.$refs.title
        }
        focusTarget.focus()
      })
    },
    hideEditor() {
      this.editTarget = null
    },
    async update() {
      await this.$root.saveMemo(this.editTarget)
      this.orgData = JSON.stringify(this.editTarget)
    }
  }
}

Vue.component('memo-editor', MemoEditor)