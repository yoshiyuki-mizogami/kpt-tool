const ex = require('express')
const PORT = process.env.PORT || 5000
const {join} = require('path')
const {readFileSync} = require('fs')
ex()
  .use(ex.static(join(__dirname, 'statics')))
  .get('/',(req, res)=>{
    res.end(readFileSync(join(__dirname, 'statics', 'app', 'index.html'), 'utf8'))
  })
  .listen(PORT, ()=>{
    console.log('start kpt tool server')
  })