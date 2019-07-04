const ex = require('express')
const PORT = process.env.PORT || 5000
const {join} = require('path')
ex()
  .use(ex.static(path.join(__dirname, 'statics')))
  .listen(PORT, ()=>{
    
  })