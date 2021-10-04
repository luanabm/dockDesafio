const database = require('../config/database');
const knex = require('knex')(database);

module.exports = knex;