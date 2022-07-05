const { Friendship, User } = require('../models')

const friendshipController = {
  sendRequest: (req, res, next) => {
    const requesterId = Number(req.user.id)
    const receiverId = Number(req.params.userId) // 要追蹤的人的 id （在form上）
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
        if (!requester) throw new Error("User doesn't exist!")
        if (receiver) throw new Error('Friend request already sent!')
        return Friendship.create({
          requesterId,
          receiverId,
          status: 'pending'
        })
      })
      .then(friendship => res.json(friendship))
      .catch(err => next(err))

  },
  cancelRequest: (req, res, next) => {
    const requesterId = req.user.id
    const receiverId = Number(req.params.userId)
    if (requesterId === receiverId) throw new Error('You cannot unfriend yourself!')
    Friendship.findOne({
      where: {
        requesterId,
        receiverId,
        status:"pending"
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
    Friendship.findOne({
      where: {
        requesterId: req.params.userId,
        receiverId: Number(req.user.id),
        status: 'pending'
      }
    })
      .then(friendship => {
        if (!friendship) throw new Error("You haven't friended this user!")
        return friendship.update({
          status: req.body.respond // accepted or denied
        })
      })
      .then(friendship => res.json(friendship))
      .catch(err => next(err))
  },
  getRequests: (req, res, next) => {
    Friendship.findAndCountAll({
      where: {
        receiverId:req.user.id,
        status: 'pending'
      }
    })
      .then(friendships => {
        res.json(friendships)
      })
      .catch(err => next(err))
  }
}

module.exports = friendshipController