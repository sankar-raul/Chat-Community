const mysql = require('mysql2')
require('dotenv').config()
const {USER, HOST, PASSWORD, DB} = process.env
const pull = mysql.createConnection({
    host: HOST,
    database: DB,
    user: USER,
    password: PASSWORD
})
pull.connect((error) => {
    error ? console.log(error) : console.log("Database connection created")
})
export default pull