const {Model} = require('objection')

const knex = require('../setting/db')

Model.knex(knex)

class Chat extends Model {
    static get tableName(){
        return 'chat'
    }
}

module.exports = Chat
