const operationsController = require('../controllers/operations');
const { body } = require('express-validator');
const middleware = require('../validations/middlewares');
const validateDate = require('../validations/date');

const validateExtractPeriod = [
  body('initialDate', 'Initial Date is required').exists(),
  body('initialDate', 'Initial Date invalid, format to be used yyyy-mm-dd').custom(validateDate),
  body('finalDate', 'Final Date is required').exists(),
  body('finalDate', 'Final Date invalid, format to be used yyyy-mm-dd').custom(validateDate)
];


module.exports = (app) => {

  app.get(
    `/api/v1/operations/extract/:idAccount`,
    middleware.verifyAccount,
    operationsController.extract,
  );

  app.post(
    `/api/v1/operations/extract-period/:idAccount`,
    validateExtractPeriod,
    middleware.validateMiddleware,
    middleware.verifyAccount,
    operationsController.extractPeriod
  );

}