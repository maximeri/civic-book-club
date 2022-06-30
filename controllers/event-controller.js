const { Book, Event, Participation} = require('../models')

const eventController = {
  addEvent: (req, res, next) => {
    const { topic, start, end, memberCount, meetingLink, isPrivate, isPublished, ISBN } = req.body
    if (!topic || !start || !end || !memberCount || ISBN) throw new Error('Field required!')
    return Book.findOne({where:{ISBN}})
   .then(book => 
    {
      if (!book) throw new Error('The book has not been created!')
      Event.create({
      hostId: req.user.id,
      topic,
      startAt:start,
      endAt: end,
      memberCount,
      meetingLink: meetingLink || null,
      isPrivate,
      isPublished,
      bookId:book.id
    })
  })
      .then(event => {
        return res.json(event)
      })
      .catch(err => next(err))
  },
  editEvent: (req, res, next) => {
    const { topic, start, end, memberCount, meetingLink, isPrivate, isPublished, ISBN } = req.body
    if (!topic || !start || !end || !memberCount || ISBN) throw new Error('Field required!')
    return Promise.all([Event.findByPk(req.params.id), Book.findOne({ where: { ISBN } })])
      .then(([event,book]) => {
        if (!event) throw new Error('Event does not exist')
        if (event.isPublished === true) throw new Error('Cannot edit published event')
        return event.update({
          hostId: req.user.id,
          topic,
          startAt: start,
          endAt: end,
          memberCount,
          meetingLink: meetingLink || null,
          isPrivate,
          isPublished,
          bookId: book.id
        })
      })
      .then(event => {
        event = event.toJSON()
        return res.json(event)
      })
      .catch(err => next(err))
  },
  deleteEvent: async (req, res, next) => {
    const eventId = req.params.id
    const event = await Event.findByPk(eventId)
    const participants = await Participation.findOne({ where: eventId })
    
    if (!event) throw new Error("Event doesn't exist or you don't have permission to edit!")
    if (event.isPublished === true) throw new Error('Cannot edit published event')
    if (participants) throw new Error("Can't delete the event as someone has already joined it.")
    try {
      const destroyedEvent = await event.destroy()
      res.json(destroyedEvent)
    } catch (err) {
      next(err)
    }
  },
  joinEvent: async (req, res, next) => {
    const event = await Event.findByPk(req.params.id)
    const participations = await Participation.findAndCountAll({ where: { eventId: req.params.id } })
    const participated = await Participation.findOne({ where: { eventId: req.params.id, memberId: req.user.id } })
    const hosted = await Event.findOne({ where: { eventId: req.params.id, hostId: req.user.id } })
    if (event.memberCount < participations.count) throw new Error("The event is fully booked!")
    if (participated || hosted) throw new Error("You already joined the event!")
    return Participation.create({
      memberId: req.user.id
    })
      .then(participation => res.json(participation))
      .catch(err => next(err))
  },
  leaveEvent: async (req, res, next) => {
    const event = await Event.findByPk(req.params.id)
    var eventDateParts = event.startAt.split("-")
    var jsDate = new Date(eventDateParts[0], eventDateParts[1] - 1, eventDateParts[2].substr(0, 2))
    const diff = jsDate - Date.now()
    if (diff < 2.592e+8) throw new Error("Cannot cancel the reservation now. Cancellations are only available 3 days ahead of the event!") // 3 days = 2.592e+8 milliseconds
    return Participation.findOne({ where: { eventId: req.params.id, memberId: req.user.id } })
    .then(participation => {
      if (!participation) throw new Error("You haven't joined this event!")
      return participation.destroy()
    })
      .then(participation => res.json(participation))
      .catch(err => next(err))

  },
  getEvents: (req, res, next) => {
    const bookId = req.params.id
    return Event.findAndCountAll({
      include: [{ model: Participation, as: 'participants', attributes: ['id']}],
      where: { bookId },
      order: [['createdAt', 'DESC']]
    })
      .then(events => {
        const resultEvents = events.rows.map(r => ({
          ...r.toJSON(),
          currentMemberCount: r.participants.length + 1 || 1
        }))
        return res.json(resultEvents)
      })
      .catch(err => next(err))
  }
}


module.exports = eventController