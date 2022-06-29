const express = require('express')
const router = express.Router()
const friendshipController = require('../../controllers/friendship-controller')
router.post('/:userId', friendshipController.sendRequest) // 送出交友邀請
router.delete('/:userId', friendshipController.cancelRequest) // 收回交友邀請
router.post('/:id', friendshipController.respondRequest) // 回覆交友邀請

module.exports = router