const knex = require("knex")(require("./knex-config").development);

module.exports = knex;
