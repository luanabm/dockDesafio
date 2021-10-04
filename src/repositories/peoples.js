const knex = require('../config/knex');

class PeoplesRepository {

    save(data) {
        return knex('peoples').insert(data);
    }

    findByCpf(cpf) {
        return knex('peoples').where('cpf', cpf).first();
    }

}

module.exports = new PeoplesRepository();