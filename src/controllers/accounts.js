
const debug = require('debug')('app:dock');
const accountsRepository = require('../repositories/accounts');
const peoplesRepository = require('../repositories/peoples');
const operationsRepository = require('../repositories/operations');

const create = async (req, res, next) => {
    try {
        let { name, cpf, birthDate } = req.body;
        cpf = cpf.replace(/\D+/g, '');

        const cpfRegistered = await findByCpf(cpf);
        if (cpfRegistered
)
            return res.status(400).json({ message: 'Cpf already registered' });

        const peoples = await save({ name, cpf, birthDate });
        const accounts = await save({ idPeople: peoples[0] });
        const data = await getAll(accounts[0]);

        return res.status(200).json(data[0]);
    } catch (e) {
        debug(e);
        return res.status(500).json({ message: e.message });
    }
};

const deposit = async (req, res, next) => {
    try {
        const { idAccount, value } = req.body;

        const account = await findById(idAccount);

        const total = parseFloat(account.balance + value);
        const accountUpdated = await updateBalance(idAccount, total);
        if (!accountUpdated)
            return res.status(400).json({ message: 'Deposit error' })

        await __save({ idAccount: account.idAccount, value });

        return res.status(200).json({ message: 'Deposit successful' });
    } catch (e) {
        debug(e);
        return res.status(500).json({ message: e.message });
    }
};

const consult = async (req, res, next) => {
    try {
        const { idAccount } = req.params;

        const account = await findById(idAccount);

        return res.status(200).json({ balance: account.balance })
    } catch (e) {
        debug(e);
        return res.status(500).json({ message: e.message });
    }
};

const grab = async (req, res, next) => {
    try {
        const { idAccount, value } = req.body;

        const account = await findById(idAccount);

        if (!(value <= account.balance))
            return res.status(400).json({ message: 'balance insufficient.' });
        
        const total = parseFloat(account.balance - value);
        const accountUpdated = await updateBalance(idAccount, total);
        if (!accountUpdated)
            return res.status(400).json({ message: 'Deposit error' })

        const valueNeg = value * -1;
        await __save({ idAccount: account.idAccount, value: valueNeg });

        return res.status(200).json({ message: 'Grab successful' });
    } catch (e) {
        debug(e);
        return res.status(500).json({ message: e.message });
    }
};


const block = async (req, res, next) => {
    try {
        const { idAccount } = req.body;

        const account = await findById(idAccount);
        if (!account)
            return res.status(400).json({ message: 'account inexistente.' });
        
        const accountUpdated = await updateFlag(idAccount, true);
        if (!accountUpdated)
            return res.status(400).json({ message: 'Erro account blocking.' })

        return res.status(200).json({ message: 'account blocked successfully.' });
    } catch (e) {
        debug(e);
        return res.status(500).json({ message: e.message });
    }
};

module.exports = {
    create,
    deposit,
    consult,
    grab,
    block
}