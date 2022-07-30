const { User, Book, Event, Participation } = require('../models')
const { Op } = require("sequelize")

const eventController = {
  addEvent: (req, res, next) => {
    const { topic, start, end, memberCount, meetingLink, isPrivate, isPublished, isbn } = req.body
    if (!topic || !start || !end || !memberCount || !isbn || !meetingLink) throw new Error('Field required!')
    if (memberCount < 2) throw new Error('Member count should be at least 2!')
    if (new Date(start) < new Date() || new Date(start) > new Date(end)) throw new Error('Event date should be later than now or ending time')
    return Book.findOne({ where: { isbn } })
      .then(book => {
        if (!book) throw new Error('The book has not been created!')
        return Event.create({
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
        return res.json(event)
      })
      .catch(err => next(err))
  },
  editEvent: (req, res, next) => {
    // published event: only meetingLink can be edited
    const { meetingLink } = req.body
    return Event.findByPk(req.params.id)
      .then(event => {
        if (!event) throw new Error('Event does not exist')
        return event.update({
          meetingLink: meetingLink || null,
        })
      })
      .then(event => {
        event = event.toJSON()
        return res.json(event)
      })
      .catch(err => next(err))
  },
  editEventDraft: (req, res, next) => {
    const { topic, start, end, memberCount, meetingLink, isPrivate, isPublished, isbn } = req.body
    if (new Date(start) < new Date() || new Date(start) > new Date(end)) throw new Error('Event date should be later than now or ending time')
    if (!topic || !start || !end || !memberCount || !isbn) throw new Error('Field required!')
    return Promise.all([Event.findByPk(req.params.id), Book.findOne({ where: { isbn } })])
      .then(([event, book]) => {
        if (!event) throw new Error('Event does not exist')
        if (event.isPublished) throw new Error('You can only edit meeting link for published events!')
        return event.update({
          isbn,
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
    try {
    const eventId = req.params.id
    const event = await Event.findByPk(eventId)

    if (!event) throw new Error("Event doesn't exist or you don't have permission to edit!")
    if (event.currentMemberCount > 1) throw new Error("Can't delete the event as someone has already joined it!")
      const destroyedEvent = await event.destroy()
      res.json(destroyedEvent)
    } catch (err) {
      next(err)
    }
  },
  joinEvent: async (req, res, next) => {
    try { 
      const event = await Event.findByPk(req.params.id)
      const participated = await Participation.findOne({ where: { eventId: req.params.id, memberId: req.user.id } })
      const hosted = await Event.findOne({ where: { id: req.params.id, hostId: req.user.id } })
      if (!event || event.isPublished === false) throw new Error("Event doesn't exist!")
      // if (participated || hosted) throw new Error("You already joined the event!")
      if (participated || hosted || (event.memberCount === event.currentMemberCount)) return res.json({"canJoin": false})
      // if (event.memberCount === event.currentMemberCount) throw new Error("The event is fully booked!")
      return Participation.create({
        eventId: event.id,
        memberId: req.user.id
      })
        .then(participation => {
          event.update({ currentMemberCount: event.currentMemberCount + 1})
          res.json(participation)
        })
    }
     catch (err) {
      next(err)
    }
  },
  unjoinEvent: async (req, res, next) => {
    try {
      const event = await Event.findByPk(req.params.id)
      if (!event) throw new Error("Event doesn't exist!")
      if ((new Date(event.start) - new Date()) < 2.592e+8) throw new Error("Cannot unjoin the event. Cancellations are only available 3 days ahead!")
      if (event.hostId === req.user.id) throw new Error("You cannot unjoin your own event!")
      const participation = await Participation.findOne({ where: { eventId: req.params.id, memberId: req.user.id } })
      if (!participation) throw new Error("You haven't joined this event!")
      return participation.destroy()
      .then(participation => {
        event.update({ currentMemberCount: event.currentMemberCount - 1 })
        res.json(participation)
      })
    }
    catch (err) {
      next(err)
    }

  },
  getEvents: (req, res, next) => {
    const bookId = req.params.bookId
    return Event.findAndCountAll({
      include: [{ model: User, as: 'ParticipatedUsers', attributes: ['id'] }],
      where: { bookId },
      order: [['createdAt', 'DESC']]
    })
      .then(events => {
        const resultEvents = events.rows.map(r => ({
          ...r.toJSON(),
          currentMemberCount: r.ParticipatedUsers.length
        }))
        return res.json(resultEvents)
      })
      .catch(err => next(err))
  },
  getEvent: (req, res, next) => {
    return Event.findByPk(req.params.id)
      .then(event => 
        {
          return res.json(event)
        }
      )
      .catch(err => next(err))
  },
  getMemberEvents: (req, res, next) => {
    return Participation.findAndCountAll({
      include: [{ model: Event, as: 'Event' }],
      attributes: ['id'],
      where: {memberId: req.params.userId},
      order: [['createdAt', 'DESC']]
    })
      .then(events => {
        const resultEvents = events.rows.map(r => ({
          ...r.toJSON(),
          currentMemberCount: r.Event.length
        }))
        return res.json(resultEvents)
      })
      .catch(err => next(err))
  },
  getHostEvents: (req, res, next) => {
    const bookId = req.params.bookId
    return Event.findAndCountAll({
      include: [{ model: User, as: 'ParticipatedUsers', attributes: ['id'] }],
      where: { hostId:req.params.userId },
      order: [['createdAt', 'DESC']]
    })
      .then(events => {
        const resultEvents = events.rows.map(r => ({
          ...r.toJSON(),
          currentMemberCount: r.ParticipatedUsers.length
        }))
        return res.json(resultEvents)
      })
      .catch(err => next(err))
  }
}


module.exports = eventController