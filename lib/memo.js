const Sequelize = require('sequelize')
const sequelize = new Squelize(process.env.DATABASE_URL)
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
    type:Sequelize.STRING(1),
    allowNull:false
  },
  charge:{
    type:Sequelize.ENUM('K', 'P', 'T', 'C')
  }
})

module.exports = Memo