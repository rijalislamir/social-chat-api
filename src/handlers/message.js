const { v4: uuidv4 } = require('uuid');
const conn = require('../database')

const getConversationMessages = (req, res) => {
  try {
    const { id } = req.params

    conn.query(`SELECT * FROM messages WHERE ? ORDER BY createdAt ASC`, { conversationId: id }, (err, result) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: err
        })
      }

      return res.send({
        success: true,
        messages: result
      })
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
}

const createMessage = async (req, res) => {
  try {  
    const { conversationId, userId, message } = req.body

    const data = {
      id: uuidv4(),
      conversationId,
      userId,
      message
    }

    conn.query(`INSERT INTO messages SET ?`, data, (err) => {
      if (err) {  
        return res.status(400).send({
          success: false,
          message: err
        })
      }
      
      return res.status(201).send({
        success: true,
        message: data
      })
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
}

const deleteUserMessages = (req, res) => {
  try {
    const { id } = req.params

    conn.query(`DELETE FROM messages WHERE ?`, { userId: id }, (err, result) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: err
        })
      }

      console.log(result)

      return res.send({
        success: true,
        ids: result
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
  getConversationMessages,
  createMessage,
  deleteUserMessages
}
