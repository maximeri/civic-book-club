const { User, Message, Room } = require('../models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')

const socketController = {
  getRooms: async (req, res, next) => {
    const {userId} = req.params
    return Room.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      },
      include: [
        {
          model: Message,
          as: 'Messages',
          limit: 1,
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id']
            }
          ],
          order: [['createdAt', 'desc']]
        },
        {
          model: User,
          as: 'User1',
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: User,
          as: 'User2',
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ],
      attributes: {
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt']
      }
    })
    .then(rooms => {
      return res.json(rooms)
    })
  },
  getRoom: async (req, res, next) => {
    const { roomId } = req.params
    return Room.findByPk(roomId,{
      include: [
        {
          model: Message,
          as: 'Messages',
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id','avatar', 'name']
            }
          ],
          order: [['createdAt', 'desc']]
        },
        {
          model: User,
          as: 'User1',
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: User,
          as: 'User2',
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ],
      attributes: {
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt']
      }
    })
      .then(room => {
        return res.json(room)
      })
  },
  postMessage: async (req, res, next) => {
    const userId = Number(req.params.userId)
    const user2Id = Number(req.params.user2Id)
    const {content}= req.body
    let roomId = ''
    const room = await Room.findOne({
      where: {
        [Op.or]: [
          { User1Id: userId, User2Id:user2Id },
          { User1Id: user2Id, User2Id: userId }
        ]
      }
    }) 
    if (!room) {
        const createRoom = await Room.create({
          User1Id: userId, 
          User2Id: user2Id
        })
         roomId = createRoom.id
      }
      return Message.create({
      room_id: room?.id || roomId,
      user_id: userId,
      content
    }) 
    .then(message => {
     return res.json(message)
  })
  }
}

module.exports = socketController