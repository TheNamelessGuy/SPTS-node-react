const express = require('express');
const mysql = require('mysql');
const readline = require('readline-sync');
const sha512 = require('js-sha512');

const rsg = require('./custom_mods/rsg');

const app = express();
const hostname = '127.0.0.1';
const port = 1313;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'SPTS'
});

db.connect((err) => {
    if (err)
        throw err;
    console.log(`Connected to database SPTS.`);
});

// Get tables
app.get('/', (req, res) => {
    let sql = 'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = \'SPTS\'';
    let query = db.query(sql, (err, qres) => {
        if (err) {
            console.log(err);
            res.send('There\'s been error while fetching tables.');
        } else {
            console.log('Table\'s fetched.');
            res.send(`{ \"response\": ${ JSON.stringify(qres) } }`);
        }
    });
});

// Get table rows
app.get('/:table', (req, res) => {
    let sql = `SELECT * FROM ${req.params.table} ORDER BY id`;
    let query = db.query(sql, (err, qres) => {
        if (err) {
            console.log(err);
            res.send('{ \"response\": \"false\" }');
        } else {
            console.log(`${req.params.table} table\'s rows fetched`);
            res.send(`{ \"response\": ${ JSON.stringify(qres) } }`);
        }
    });
});

// Create row
app.get('/:table/add/:value', (req, res) => {
    let values = JSON.parse(req.params.value);
    let sql_val = '';
    let sql_params = '';

    if (req.params.table === 'spts_user') {
        let h_pass = sha512(`${ values.password }`);
        let h_salt = sha512(rsg.generate(64));
        let salt_index = Math.floor(Math.random() * (h_pass.length - 0) + 0);
        let h_salted_pass = sha512(`${ h_pass.slice(0, salt_index) }${ h_salt }${ h_pass.slice(salt_index) }`);
    
        sql_params += 'enabled, password, salt, salt_index, ';
        sql_val += `\'1\', \'${ h_salted_pass }\', \'${ h_salt }\', \'${ salt_index }\', `;        
    }

    for (let [key, val] of Object.entries(values)) {
        if (key != 'password') {
            sql_params += `${ key }, `;
            sql_val += `\'${ val }\', `;
        }
    }
    let sql = `INSERT INTO ${ req.params.table } (${ sql_params }) VALUES (${ sql_val })`;
    sql = sql.replace(', )', ')');
    sql = sql.replace(', )', ')');

    let query = db.query(sql, (err, qres) => {
        if (err) {
            console.log(err);
            res.send('{ \"response\": \"false\" }');
        } else {
            console.log(`Successfully added a row to ${req.params.table} table`);
            res.send('{ \"response\": \"true\" }');
        }
    });
});

// Get filtered row
app.get('/:table/get/:filters', (req, res) => {
    let filters = JSON.parse(req.params.filters);
    let sql = 'SELECT';

    if (filters.hasOwnProperty('fetch') && filters.fetch == 'filtered') {
        delete filters.fetch;
        for (let [key, val] of Object.entries(filters)) {
            sql += `, ${ key }`;
        }
    } else if (filters.hasOwnProperty('fetch') && typeof filters.fetch == 'object') {
        for (let val of Object.entries(filters.fetch)) {
            if (val == Object.keys(filters.fetch)[0])
                sql += ` ${ val[1] }`;
            else
                sql += `, ${ val[1] }`;
        }
        delete filters.fetch;
    } else {
        if (filters.hasOwnProperty('fetch'))
            delete filters.fetch;
            
        sql += ' *';
    }

    sql += ` FROM ${ req.params.table } WHERE`;
    sql = sql.replace('T, ', 'T ');

    if (Object.keys(filters).length > 1) {
        let first = true;

        for (let [key, val] of Object.entries(filters)) {
            if (val.and_or == 'or') {
                if (typeof val.value == 'object') {
                    for (let value of Object.entries(val.value)) {
                        if (value[1] == 'not_null') {
                            if (first) {
                                first = false;
                                sql += ` (${ key } IS NOT NULL`;
                            } else
                                sql += ` OR ${ key } IS NOT NULL`;
                        } else if (value[1] == 'is_null') {
                            if (first) {
                                first = false;
                                sql += ` (${ key } IS NULL`;
                            } else
                                sql += ` OR ${ key } IS NULL`;
                        } else {
                            if (first) {
                                first = false;
                                sql += ` (${ key } = \'${ value[1] }\'`;
                            } else
                                sql += ` OR ${ key } = \'${ value[1] }\'`;
                        }
                    }
                } else {
                    if (val.value == 'not_null') {
                        if (first) {
                            first = false;
                            sql += ` (${ key } IS NOT NULL`;
                        } else
                            sql += ` OR ${ key } IS NOT NULL`;
                    } else if (val.value == 'is_null') {
                        if (first) {
                            first = false;
                            sql += ` (${ key } IS NULL`;
                        } else
                            sql += ` OR ${ key } IS NULL`;
                    } else {
                        if (first) {
                            first = false;
                            sql += ` (${ key } = \'${ val.value }\'`;
                        } else
                            sql += ` OR ${ key } = \'${ val.value }\'`;
                    }
                }
            }
        }
        sql += ')';
        first = true;

        for (let [key, val] of Object.entries(filters)) {
            if (val.and_or == 'and') {
                if (val.value == 'not_null') {
                    if (first) {
                        first = false;
                        sql += ` AND (${key} IS NOT NULL`;
                    }
                    else
                        sql += ` AND ${key} IS NOT NULL`;
                } else if (val.value == 'is_null') {
                    if (first) {
                        first = false;
                        sql += ` AND (${key} IS NULL`;
                    }
                    else
                        sql += ` AND ${key} IS NULL`;
                } else {
                    if (first) {
                        first = false;
                        sql += ` AND (${key} = \'${ val.value }\'`;
                    }
                    else
                        sql += ` AND ${key} = \'${ val.value }\'`;
                }
            }
        }
        sql += ')';
        sql = sql.replace('))', ')');
    } else {
        for (let [key, val] of Object.entries(filters))
            sql += ` ${ key } = \'${ val }\'`;
    }

    let query = db.query(sql, (err, qres) => {
        if (err) {
            console.log(err);
            res.send('{ \"response\": \"false\" }');
        } else {
            console.log(`${req.params.table} filtered row fetched.`);
            if (Object.keys(qres).length === 0)
                res.send('{ \"response\": \"null\" }');
            else
                res.send(`{ \"response\": ${ JSON.stringify(qres) } }`);
        }
    });
});

app.get('/:table/check/:attr', (req, res) => {
    if (req.params.table == 'spts_user') {
        let query = db.query(`SELECT salt, salt_index, password FROM spts_user WHERE email = \'${ JSON.parse(req.params.attr).email }\'`, (err, qres) => {
            if (err) {
                console.log(err);
                res.send('{ \"response\": \"false\" }');
            } else {
                let pass = JSON.parse(req.params.attr).password;
                let h_pass = sha512(`${ pass }`);
                let h_salted_pass = sha512(`${ h_pass.slice(0, qres[0].salt_index) }${ qres[0].salt }${ h_pass.slice(qres[0].salt_index) }`);
                
                if (h_salted_pass == qres[0].password)
                    res.send('{ \"response\": \"true\" }');
                else
                    res.send('{ \"response\": \"null\" }');
            }
        });
    }
});

app.listen(port, hostname, () => console.log(`Server started on port ${port}.`));