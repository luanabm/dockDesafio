
const { validationResult } = require('express-validator');
const accountsRepository = require('../repositories/accounts');

const verifyAccount = async (req, res, next) => {
    const idAccount = req.body.idAccount ? req.body.idAccount : req.params.idAccount;

    const account = await accountsRepository.findById(idAccount);
    if (!account)
        return res.status(400).json({ message: 'account not exist' });

    if (account.flagActive)
        return res.status(400).json({ message: 'blocked account' });

    next();

}

const validateMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 400, 
            data: { errors: errors.array() } 
        })
    }
    next();
};

module.exports = {
    validateMiddleware,
    verifyAccount
}