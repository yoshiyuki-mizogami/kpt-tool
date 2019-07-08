const ex = require('express')
const {IpFilter,IpDeniedError} = require('express-ipfilter')
const PORT = process.env.PORT || 5000
const {join} = require('path')
const net = require('net')
const {readFileSync} = require('fs')
const Memo = require('./lib/memo')

const allowIPList = process.env.ALLOW_IP_LIST || ''

const app = ex()

if(allowIPList){
  const ips = allowIPList.split(';')
    .filter(ip=>net.isIPv4(ip))
  if(ips.length){
    app.use(IpFilter(ips, {mode:'allow'}))
      .use((err, req, res, _next)=>{
        if (err instanceof IpDeniedError) {
          res.status(401)
        } else {
          res.status(err.status || 500)
        }
     
        res.end('You shall not pass ' + JSON.stringify(err) + ' ' + req.connection.remoteAddress)
      })
  }
}

app
  .use(ex.json())
  .use(ex.urlencoded({extended:false}))
  .use(ex.static(join(__dirname, 'statics')))
  .get('/',(req, res)=>{
    res.end(readFileSync(join(__dirname, 'statics', 'app', 'index.html'), 'utf8'))
  })
  .get('/api/memos', async (req, res)=>{
    const allMemos = await Memo.findAll({
      order:[['createdAt', 'ASC']]
    })
    res.json(allMemos)
  })
  .get('/api/memos/:memoId', async(req, res)=>{
    const targetId = req.params.memoId
    const targetMemo = await Memo.findByPk(targetId)
    res.json(targetMemo)
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
  .delete('/api/memos/:memoId', async (req, res)=>{
    const id = req.params.memoId
     await Memo.destroy({
       where:{id}
     })
     res.json({
       message:'Removed',
       data:id
     })
  })
  .listen(PORT, ()=>{
    console.log('start kpt tool server')
  })