const express = require('express')
const router = express.Router()
const friendshipController = require('../../../controllers/friendship-controller')
router.put('/:userId', friendshipController.respondRequest) // respond friend request
router.post('/:userId', friendshipController.sendRequest) // send friend request
router.delete('/:userId', friendshipController.cancelRequest) // cancel friend request
router.get('/', friendshipController.getRequests) // view all friend requests
module.exports = router