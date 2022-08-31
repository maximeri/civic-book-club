var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../../app')
var helpers = require('../../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../../models')
const passport = require('../../../config/passport')

describe('# socket requests', () => {

  context('# POST ', () => {

    describe('POST /api/v1/sockets', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true }) 
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Room.destroy({ where: {}, truncate: true, force: true })
        await db.Message.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
        // User login
        const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...user1 }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 })
        await db.User.create({ account: 'User2', name: 'User2', email: 'User2@example.com', password: 'User2' }); 
      })

      // Send a message - POST /sockets/rooms/userId/user2Id
      it(' - POST /api/v1/sockets/rooms/userId/user2Id successfully', (done) => {
        request(app)
          .post('/api/v1/sockets/rooms/1/2')
          .send('content=I+love+you!!!')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // Check DB data
            db.Message.findByPk(1)
            .then(message => {
              message.content.should.equal('I love you!!!')
              message.RoomId.should.equal(1)
              return done();
            })
          })
      });

      // Clear DB data
      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Room.destroy({ where: {}, truncate: true, force: true })
        await db.Message.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    })

  });

  context('# GET ', () => {

      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Message.destroy({ where: {}, truncate: true, force: true })
        await db.Room.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // Login
        const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...user1 }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 })
        // Add mock up data
        await db.User.create({ account: 'User2', name: 'User2', email: 'User2@example.com', password: 'User2' }); 
        await db.User.create({ account: 'User3', name: 'User3', email: 'User3@example.com', password: 'User3' }); 
        await db.User.create({ account: 'User4', name: 'User4', email: 'User4@example.com', password: 'User4' }); 
        await db.Room.create({ User1Id: 1, User2Id: 2 })
        await db.Room.create({ User1Id: 1, User2Id: 3 })
        await db.Room.create({ User1Id: 4, User2Id: 1 })
        await db.Message.create({ RoomId: 1, UserId: 1, content:'content1' })
      })

      // GET /api/v1/sockets/rooms/:userId - all rooms
      it(' - successfully', (done) => {
        request(app)
          .get('/api/v1/sockets/rooms/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            // check user1Id
            res.body[0].User1.id.should.equal(1)
            res.body[1].User1.id.should.equal(1)
            res.body[2].User1.id.should.equal(4)
            return done();
          })
      });

      // GET /api/v1/sockets/roomId - all messages from a room
      it(' - successfully', (done) => {
        request(app)
          .get('/api/v1/sockets/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            // check message
            res.body.Messages[0].content.should.equal('content1')
            return done();
          })
      })

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Message.destroy({ where: {}, truncate: true, force: true })
        await db.Room.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })


  })

});
