const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.status(401).send({
      success: false,
      message: 'Unauthorized!'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({
        success: false,
        message: err.message
      })
    }

    req.user = user
    next()
  })
}

module.exports = {
  authenticateToken
}
