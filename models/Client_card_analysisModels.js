const {Model} = require('objection')

const knex = require('../setting/db')

Model.knex(knex)

class Client_card_analysis extends Model {
    static get tableName(){
        return 'Client_card_analysis'
    }
}

module.exports = Client_card_analysis