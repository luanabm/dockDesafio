const accountController = require('../controllers/accounts');
const middleware = require('../validations/middlewares');
const { body } = require('express-validator');
const validateCpf = require('../validations/cpf');
const validateDate = require('../validations/date');

const validateCreate = [ 
    body('name', 'name is required').exists(), 
    body('cpf', 'cpf is required').exists(),
    body('cpf', 'cpf invalid').custom(validateCpf),
    body('birthDate', 'birthDate is required').exists(),
    body('birthDate', 'birthDate invalid, format to be used yyyy-mm-dd').custom(validateDate)
];

const validateDepositGrab = [
    body('idAccount', 'idAccount is required').exists(),
    body('idAccount', 'idAccount is integer').isInt(),
    body('value', 'value is required').exists(),
    body('value', 'value is numeric').isNumeric(),
    body('value', 'required vakue greater than zero').isFloat({min: 1})
]
  
const validateBlock = [
    body('idAccount', 'idAccount is required').exists(),
    body('idAccount', 'idAccount is integer').isInt(),
]
module.exports = (app) => {

    app.post(
      `/api/v1/accounts`,
      validateCreate,
      middleware.validateMiddleware,
      accountController.create
    );
  
    app.put(
      `/api/v1/accounts/deposit`,
      validateDepositGrab,
      middleware.validateMiddleware,
      middleware.verifyAccount,
      accountController.deposit
    );
  
    app.get(
      `/api/v1/accounts/:idAccount`,
      middleware.verifyAccount,
      accountController.consult
    );
  
    app.put(
      `/api/v1/accounts/grab`,
      validateDepositGrab,
      middleware.validateMiddleware,
      middleware.verifyAccount,
      accountController.grab
    );
  
    app.put(
      `/api/v1/accounts/block`,
      validateBlock,
      middleware.validateMiddleware,
      middleware.verifyAccount,
      accountController.block
    );
  
}