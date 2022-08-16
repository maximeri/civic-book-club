const express = require('express')
const router = express.Router()
const socketController = require('../../controllers/socket-controller')

router.post('/rooms/:userId/:user2Id', socketController.postMessage) // post message
router.get('/rooms/:userId', socketController.getRooms) // get all the rooms
router.get('/:roomId', socketController.getRoom) // get the room

module.exports = router