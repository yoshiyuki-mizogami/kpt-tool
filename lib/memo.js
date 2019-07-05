const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL,{
  pool:{
    idle:1000 * 60 * 10
  },
  dialectOptions:{
    ssl:true
  }
})

const Model = Sequelize.Model
class Memo extends Model{}

Memo.init({
  title:{
    type:Sequelize.STRING
  },
  body:{
    type:Sequelize.TEXT
  },
  belong:{
    type:Sequelize.ENUM('K', 'P', 'T', 'C'),
    allowNull:false
  },
  charge:{
    type:Sequelize.STRING
  }
},{
  sequelize,
  modelName:'memos'
})

sequelize.sync()
module.exports = Memo