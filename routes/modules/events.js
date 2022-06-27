const express = require('express')
const router = express.Router()
const eventController = require('../../controllers/event-controller')

router.post('/', eventController.addEvent) // 創建讀書會
router.put('/:id', eventController.editEvent) // 編輯讀書會
router.delete('/:id', eventController.deleteEvent) // 刪除讀書會
router.post('/:id', eventController.joinEvent) // 加入讀書會
router.delete('/:id/userId', eventController.leaveEvent) // 取消加入讀書會
router.get('/:bookId', eventController.getEvents) // 查看該書所有讀書會
router.get('/:id', eventController.getEvent) // 查看個別讀書會資訊

module.exports = router