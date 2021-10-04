const knex = require('../config/knex');

class AccountsRepository {

    save(data) {
        return knex('accounts').insert(data);
    }

    getAll(idAccount) {
        return knex('accounts')
            .join('peoples', 'accounts.idPeople', '=', 'peoples.idPeople')
            .where('idAccount', idAccount);
    }

    updateBalance(idAccount, balance) {
        return knex('accounts')
            .where('idAccount', idAccount)
            .update({
                balance
            });
    }

    updateFlag(idAccount, flagActive) {
        return knex('accounts')
            .where('idAccount', idAccount)
            .update({
                flagActive
            });
    }

    findById(idAccount) {
        return knex('accounts').where('idAccount', idAccount).first();
    }

}

module.exports = new AccountsRepository();