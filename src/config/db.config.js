const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

pool.on('connect', () => {
    console.log('connected to database');
});

pool.on('error', (err)=> {
    console.error('error : ', err.message)
    process.exit(1)
})

module.exports = pool;