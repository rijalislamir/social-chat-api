const { v4: uuidv4 } = require('uuid');
const conn = require('../database')

const getUserConversations = async (req, res) => {
  try {
    if (req.params.userId !== req.user.id) return res.status(403).send({
      success: false,
      message: 'Forbidden!'
    })

    conn.query(`
        SELECT * FROM users_conversations 
        JOIN conversations
        ON users_conversations.conversationId = conversations.id
        WHERE ?
      `,
      req.params,
      (err, result) => {
        if (err) {  
          return res.status(400).send({
            success: false,
            message: err
          })
        }

        return res.status(201).send({
          success: true,
          conversations: result
        })
      }
    )
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
}

const createConversation = async (req, res) => {
  try {  
    const { name } = req.body
    const conversation = {
      id: uuidv4(),
      name
    }

    conn.query(`INSERT INTO conversations SET ?`, conversation, (err) => {
      if (err) {  
        return res.status(400).send({
          success: false,
          message: err
        })
      }
      
      return res.status(201).send({
        success: true,
        conversation
      })
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
}

const createUserConversation = (req, res) => {
  try {
    if (req.params.userId !== req.user.id) return res.status(403).send({
      success: false,
      message: 'Forbidden!'
    })

    conn.query(`INSERT INTO users_conversations SET ?`, req.params, (err) => {
      if (err && err.code !== 'ER_DUP_ENTRY') {
        return res.status(400).send({
          success: false,
          message: err
        })
      }

      return res.status(201).send({
        success: true,
        data: req.params
      })
    })

  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
}

const deleteUserConversations = (req, res) => {
  conn.query(`DELETE FROM users_conversations WHERE ?`, req.params, (err, result) => {
    if (err) {
      return res.status(400).send({
        succes: false,
        message: err
      })
    }

    return res.send({
      success: true,
      ids: result
    })
  })
}

const deleteConversation = (req, res) => {
  const { id } = req.params

  // TODO: create if guard to authorize the handler

  conn.query('DELETE FROM conversations WHERE ?', { id }, (err, result) => {
    if (err) {
      return res.status(400).send({
        success: false,
        message: err
      })
    }

    if (!result.affectedRows) {
      return res.status(404).send({
        success: false,
        message: 'Conversation not found!'
      })
    }

    return res.send({
      success: true,
      id
    })
  })
}

module.exports = {
  getUserConversations,
  createConversation,
  createUserConversation,
  deleteUserConversations,
  deleteConversation
}
