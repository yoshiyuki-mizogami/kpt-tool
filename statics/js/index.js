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
  methods: {
    async saveMemos() {
      const response = await fetch('https://test-new.anicom-sompo.co.jp/__tools/json-store/?key=taguchi', {
        method: 'POST',
        body: JSON.stringify({
          kMemos: this.kMemos,
          pMemos: this.pMemos,
          tMemos: this.tMemos,
          cMemos: this.cMemos
        })
      }).then(r => r.json())
      this.notify('save')
    },
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