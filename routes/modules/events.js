const express = require('express')
const router = express.Router()
const eventController = require('../../controllers/event-controller')

router.delete('/host/:id', eventController.deleteEvent) // delete an event
router.post('/member/:id', eventController.joinEvent) // join an event
router.delete('/member/:id', eventController.unjoinEvent) // unjoin an event
router.post('/host', eventController.addEvent) // Create an event
router.put('/:id', eventController.editEvent) // edit an event
router.get('/:bookId', eventController.getEvents) // view all events of a book

module.exports = router