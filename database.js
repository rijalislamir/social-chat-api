require('dotenv').config()

const mysql = require('mysql2')

const connectDb = () => {
  const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  return connection
}

module.exports = connectDb;