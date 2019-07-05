const MEMO_LIMIT = 18
const TRY_LIMIT = MEMO_LIMIT * 2

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

    }
  }
})