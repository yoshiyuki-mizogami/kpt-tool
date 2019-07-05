const ex = require('express')
const PORT = process.env.PORT || 5000
const {join} = require('path')
const {readFileSync} = require('fs')
const Memo = require('./lib/memo')
ex()
  .use(ex.static(join(__dirname, 'statics')))
  .get('/',(req, res)=>{
    res.end(readFileSync(join(__dirname, 'statics', 'app', 'index.html'), 'utf8'))
  })
  .get('/api/memos', async (req, res)=>{
    const allMemos = await Memo.findAll()
    res.json(allMemos)
  })
  .post('/api/memos',async (req, res)=>{
    try{
      const data = JSON.parse(req.body)
      const newMemo = await Memo.create(data)
      res.json(newMemo)
    }catch(e){
      res.json({
        error:e.toString()
      })
    }
    
  })
  .put('/api/memos/:memoId', (req,res)=>{

  })
  .delete('/api/memos/:memoId', (req, res)=>{

  })
  .listen(PORT, ()=>{
    console.log('start kpt tool server')
  })