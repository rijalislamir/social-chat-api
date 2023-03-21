require('dotenv').config()

const mysql = require('mysql2')

const connectDb = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
  
  connection.connect((err) => {
    if (err) throw err

    console.log('MySQL database is connected!')
  })

  return connection
}

module.exports = connectDb;