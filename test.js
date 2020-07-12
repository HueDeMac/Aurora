const mysql = require('mysql')

let con = mysql.createConnection({
    user: 'root',
    password: '',
    port: 3306,
    host: 'localhost'
})

con.connect()

con.query('show databases', (error, results) => {
    console.log(results)
})