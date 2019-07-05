const MEMO_LIMIT = 18
const TRY_LIMIT = MEMO_LIMIT * 2
const JSONHEADER = {'Content-Type':'application/json'}
const ENDPOINT = '/api/memos/'
const evHub = new Vue()
new Vue({
  el: '#app',
  data: {
    kMemos: [],
    pMemos: [],
    tMemos: [],
    cMemos: [],
    message: '',
    notificationVisible: false,
    MEMO_LIMIT,
    TRY_LIMIT,
    ev:null
  },
  async created() {
    const memoNames = {
      K:'kMemos',
      P:'pMemos',
      T:'tMemos',
      C:'cMemos'
    }
    const response = await fetch('/api/memos')
      .then(r => r.json())
    response.forEach(m=>{
      const memoName = memoNames[m.belong]
      if(!memoName){
        console.error('Unknown memo belong type', m)
        return
      }
      this[memoName].push(m)
    })
    evHub.$emit('uncover')
  },
  components: {
    MyArea: Area
  },
  methods:{
    notify(m) {
      clearTimeout(this.ev)
      this.notificationVisible = true
      this.message = m
      this.ev = setTimeout(() => {
        this.notificationVisible = false
        this.message = ''
      }, 2000)
    },
    async addMemo(baseObj){
      return fetch(ENDPOINT, {
        method:'POST',
        headers:JSONHEADER,
        body:JSON.stringify(baseObj)
      }).then(r=>r.json())
    },
    async getMemo(memoId){
      return fetch(`${ENDPOINT}${memoId}`,{
        method:'GET'
      }).then(r=>r.json())
    },
    async saveMemo(m){
      const updated = await fetch(`${ENDPOINT}${m.id}`,{
        method:'PUT',
        headers:JSONHEADER,
        body:JSON.stringify(m)
      }).then(r=>r.json())
      Object.assign(m, updated)
      this.notify(`Saved. ${m.title}`)
    },
    async removeMemo(m){
      const res = await fetch(`${ENDPOINT}${m.id}`, {
        method:'DELETE'
      }).then(r=>r.json())
      this.notify('Removed ' + m.title)
    }
  }
})