const isValid = require('date-fns/isValid');

const dateReg = /^\d{4}-\d{2}-\d{2}$/;

const validateDate = (date) => {
   if (date.match(dateReg) && isValid(new Date(date))) {
       return true;
   } else {
       return false;
   }
}

module.exports = (value) => { return value ? validateDate(value) : true };
