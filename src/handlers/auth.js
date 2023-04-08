const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const conn = require('../database')

const login = (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Required both email and password!'
      })
    }

    conn.query('SELECT * FROM users WHERE ?', { email }, async (err, result) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: err
        })
      }

      if (!result.length) {
        return res.status(400).send({
          success: false,
          error: { type: 'unregistered.email' },
          message: 'Email not registered!'
        })
      }

      const user = result[0]

      if (await bcrypt.compare(password, user.password)) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        }

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

        return res.send({
          success: true,
          accessToken
        })
      }
  
      return res.status(400).send({
        success: false,
        message: 'Invalid credentials!',
        error: {
          type:'invalid.credential'
        }
      })
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
}

module.exports = {
  login
}
