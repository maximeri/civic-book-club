const { Friendship, User } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const friendshipController = {
  sendRequest: (req, res, next) => {
    const requesterId = Number(getUser(req).id)
    const receiverId = Number(req.body.userId) // 要追蹤的人的 id （在form上）
      Promise.all([
        User.findByPk(requesterId),
        Friendship.findOne({
          where: {
            requesterId,
            receiverId
          }
        })
      ])
        .then(([requester, receiver]) => {
          if (!requester) throw new Error("User didn't exist!")
          if (receiver) throw new Error('Friend request already sent!')
          return Friendship.create({
            requesterId,
            receiverId,
            status:'invited'
          })
        })
        .then(friendship => res.json(friendship))
        .catch(err => next(err))
  
  },
  cancelRequest: (req, res, next) => {
    const requesterId = Number(getUser(req).id)
    const receiverId = Number(req.body.userId)
    if (requesterId === receiverId) throw new Error('You cannot unfriend yourself!')
    Friendship.findOne({
      where: {
        requesterId,
        receiverId
      }
    })
      .then(friendship => {
        if (!friendship) throw new Error("You haven't friended this user!")
        return friendship.destroy()
      })
      .then(friendship => res.json(friendship))
      .catch(err => next(err))
  },
  respondRequest: (req, res, next) => {
    const requesterId = Number(getUser(req).id)
    const receiverId = Number(req.body.userId)
    Friendship.findOne({
      where: {
        requesterId,
        receiverId,
        status: 'invited'
      }
    })
      .then(friendship => {
        if (!friendship) throw new Error("You haven't friended this user!")
        return Friendship.create({
          requesterId,
          receiverId,
          status: req.body.response // accepted 及 denied 在form上
        })
      })
      .then(friendship => res.json(friendship))
      .catch(err => next(err))
  }
}

module.exports = friendshipController