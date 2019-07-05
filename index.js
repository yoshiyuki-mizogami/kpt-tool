const ex = require('express')
const PORT = process.env.PORT || 5000
const {join} = require('path')
const {readFileSync} = require('fs')
const Memo = require('./lib/memo')
ex()
  .use(ex.json())
  .use(ex.urlencoded({extended:false}))
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
      const newMemo = await Memo.create(req.body)
      res.json(newMemo)
    }catch(e){
      res.json({
        error:e.toString()
      })
    }
    
  })
  .put('/api/memos/:memoId', async (req,res)=>{
    const targetId = req.params.memoId
    const rdata = req.body
    const targetMemo = await Memo.findByPk(targetId)
    if(!targetMemo){
      return res.json({
        error:'target memo id not found',
        data:rdata
      })
    }
    targetMemo.title = rdata.title
    targetMemo.body = rdata.body
    targetMemo.charge = rdata.charge
    targetMemo.belong = rdata.belong
    await targetMemo.save()
    res.json(targetMemo)
  })
  .delete('/api/memos/:memoId', (req, res)=>{

  })
  .listen(PORT, ()=>{
    console.log('start kpt tool server')
  })