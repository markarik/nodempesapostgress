const {Pool} = require('pg')


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mpesa_data',
    password: 'markarik1',
    port: 5432,
});

module.exports = pool;

