let targetMemo = null
let targetMemoList = null
const JSONHEADER = {'Content-Type':'application/json'}
const ENDPOINT = '/api/memos/'
const Area = {
  template: '#areaTemplate',
  props: ['memos', 'className', 'limit', 'char', 'complete'],
  data() {
    return {
      editorVisible: false,
      editTarget: null,
      orgData:'',
      draw:false
    }
  },
  filters: {
    formatDatetime(v) {
      return new Date(v).toLocaleString()
    }
  },
  methods: {
    moveNextMemo(){
      let ind = this.memos.indexOf(this.editTarget) + 1
      if(!this.memos[ind]){
        return this.$root.notify('最後のメモです')
      }
      this.checkUpdate()
      this.showEditor(this.memos[ind])
    },
    movePreviousMemo(){
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
    showEditor(memo) {
      this.editorVisible = true
      this.editTarget = memo
      this.orgData = JSON.stringify(this.editTarget)
      this.$nextTick(()=>{
        this.$refs.editor.focus()
      })
    },
    hideEditor() {
      this.editTarget = null
    },
    update() {
      this.saveMemo(this.editTarget)
    },
    async addMemo() {
      if(this.complete){
        this.draw = true
        return
      }
      if (this.limit <= this.memos.length) {
        return
      }
      const title = prompt('タイトルを入力してください', 'タイトル')
      if(!title){
        return
      }
      const newMemo = await fetch(ENDPOINT, {
        method:'POST',
        headers:JSONHEADER,
        body:JSON.stringify({
          title,
          belong:this.char
        })
      }).then(r=>r.json())
      this.memos.push(newMemo)
      this.showEditor(newMemo)
    },
    confirmRemoveMemo(memo) {
      console.log(memo)
      const ok = confirm('削除しますか？')
      if (!ok) {
        return
      }

      const ind = this.memos.indexOf(memo)
      this.memos.splice(ind, 1)
      this.removeMemo(memo)
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
      this.saveMemo(targetMemo)
    },
    async saveMemo(m){
      const updated = await fetch(`${ENDPOINT}${m.id}`,{
        method:'PUT',
        headers:JSONHEADER,
        body:JSON.stringify(m)
      }).then(r=>r.json())
      Object.assign(m, updated)
      this.$parent.notify(`Saved. ${m.title}`)
    },
    async removeMemo(m){
      const res = await fetch(`${ENDPOINT}${m.id}`, {
        method:'DELETE'
      }).then(r=>r.json())
      this.$root.notify('Removed ' + m.title)
    }
  }
}