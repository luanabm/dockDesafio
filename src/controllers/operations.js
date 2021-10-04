
const debug = require('debug')('app:dock');
const operationsRepository = require('../repositories/operations');

const extract = async (req, res, next) => {
    try {
        const { idAccount } = req.params;

        const extract = await findByIdAccount(idAccount);
        if (!extract.length)
            return res.status(400).json({ message: 'No transactions in this account' });

        return res.status(200).json(extract);
    } catch (e) {
        debug(e);
        return res.status(500).json({ message: e.message });
    }
};

const extractPeriod = async (req, res, next) => {
    try {
        const { idAccount } = req.params;
        const { initialDate, finalDate } = req.body;

        const extract = await findByIdAccountPeriod(idAccount, [initialDate, finalDate]);
        if (!extract.length)
            return res.status(400).json({ message: 'No transactions in this account in this period' });

        return res.status(200).json(extract);
    } catch (e) {
        debug(e);
        return res.status(500).json({ message: e.message });
    }
};

module.exports = {
    extract,
    extractPeriod
}
