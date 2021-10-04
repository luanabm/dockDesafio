const knex = require('../config/knex');

class OperationsRepository {

    save(data) {
        return knex('operations').insert(data);
    }

    findByIdAccount(idAccount) {
        return knex('operations')
            .select('value', 'dateOperations')
            .where('idAccount', idAccount);
    }

    findByIdAccountPeriod(idAccount, dates) {
        return knex('operations')
            .select('value', 'dateOperations')
            .where('idAccount', idAccount)
            .whereBetween('dateOperations', dates);
    }

}

module.exports = new OperationsRepository();