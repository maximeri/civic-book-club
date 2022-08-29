var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../../app')
var helpers = require('../../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../../models')
const passport = require('../../../config/passport')

describe('# event requests', () => {

  context('# POST ', () => {
    describe('POST /api/v1/events', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Event.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // User login
        const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...user1 }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 })
        await db.Book.create({ name: 'Book Name1', isbn: '9781579126247', introduction: 'introduction1', image: 'image1' })
        await db.Event.create({ isbn: '9781579126247', topic: 'Event1', startAt: '2022-08-30T06:34:09.000Z', endAt: '2022-08-31T06:34:09.000Z', memberCount: '4', meetingLink: 'meetingLink', hostId: 2, bookId:1})
      })

      // Create an event - POST /events/host
      it(' - POST /events/host successfully', (done) => {
        request(app)
          .post('/api/v1/events/host')
          .send('isbn=9781579126247&topic=Event2&start=2022-08-30T06:34:09.000Z&end=2022-08-31T06:34:09.000Z&memberCount=3&meetingLink=meetingLink')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // Check DB data
            db.Event.findOne({ where: { topic: 'Event2' } }).then(() => {
              return done();
            })
          })
      });

      // Join an event - POST /api/v1/events/member/:id
      it(' - POST /api/v1/events/member/:id successfully', (done) => {
        request(app)
          .post('/api/v1/events/member/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // Check for user
            db.Participation.findByPk(1).then(participation => {
              participation.memberId.should.equal(1);
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
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Event.destroy({ where: {}, truncate: true, force: true })
        await db.Participation.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });

  context('# GET ', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Event.destroy({ where: {}, truncate: true, force: true })
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
        await db.Event.create({ topic: 'topic1', startAt: '2022-09-15 00:00:00', endAt: '2022-09-30 00:00:00', memberCount: 3, meetingLink: 'googlemeet.com', currentMemberCount: 1, hostId: 1, bookId: 1 })
        await db.Event.create({ topic: 'topic2', startAt: '2022-09-15 00:00:00', endAt: '2022-09-30 00:00:00', memberCount: 3, meetingLink: 'googlemeet.com', currentMemberCount: 1, hostId: 1, bookId: 1 })
        await db.Event.create({ topic: 'topic3', startAt: '2022-09-15 00:00:00', endAt: '2022-09-30 00:00:00', memberCount: 3, meetingLink: 'googlemeet.com', currentMemberCount: 1, hostId: 1, bookId: 1 })
        await db.Event.create({ topic: 'topic4', startAt: '2022-09-15 00:00:00', endAt: '2022-09-30 00:00:00', memberCount: 3, meetingLink: 'googlemeet.com', currentMemberCount: 1, hostId: 2, bookId: 1 })
        await db.Event.create({ topic: 'topic5', startAt: '2022-09-15 00:00:00', endAt: '2022-09-30 00:00:00', memberCount: 3, meetingLink: 'googlemeet.com', currentMemberCount: 1, hostId: 3, bookId: 1 })
        await db.Participation.create({ eventId:4, memberId: 1 })
        await db.Participation.create({ eventId: 5, memberId: 1 })
      })

      // GET /events - get all events
      it(' - GET /events - get all events successfully', (done) => {
        request(app)
          .get('/api/v1/events/book/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            // check isbn
            res.body[0].topic.should.equal('topic1')
            res.body[1].topic.should.equal('topic2')
            return done();
          })
      });

      // GET /events/:id - get an event
    it(' - GET /events/:id successfully', (done) => {
        request(app)
          .get('/api/v1/events/3')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            // check topic
            res.body.topic.should.equal('topic3');
            return done();
          })
      });

      // GET /events/user/host/userId - user hosted events
    it(' - GET /events/user/host/userId successfully', (done) => {
        request(app)
          .get('/api/v1/events/user/host/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            // check topics
            res.body[0].topic.should.equal('topic1')
            res.body[1].topic.should.equal('topic2')
            res.body[2].topic.should.equal('topic3')
            return done();
          })
      });

      // GET /events/user/member/userId - user joined events(excluding self-hosting events)
    it(' - GET /events/user/member/userId successfully', (done) => {
        request(app)
          .get('/api/v1/events/user/member/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            // check topics
            res.body[0].Event.topic.should.equal('topic4')
            res.body[1].Event.topic.should.equal('topic5')
            return done();
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Event.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
  });


  context('# PUT ', () => {
    describe('PUT /api/v1/events/:id', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Event.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // Login
        const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...user1 }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 })
        // Add a mock up event
        await db.Event.create({ topic: 'topic1', startAt: '2022-09-15 00:00:00', endAt: '2022-09-30 00:00:00', memberCount: 3, meetingLink: 'googleMeet.com', currentMemberCount: 1, hostId: 1, bookId: 1 })
      })

      // PUT /events/:id - edit an event meeting link
      it(' - PUT /events/:id successfully', (done) => {
        request(app)
          .put('/api/v1/events/1')
          .send('meetingLink=zoomMeet.com')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            // check topic
            res.body.meetingLink.should.equal('zoomMeet.com')
            return done();
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Event.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })

 
  context('# DELETE ', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Event.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // Login
        const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...user1 }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 })
        // Add a mock up book
        await db.Event.create({ topic: 'topic1', startAt: '2022-09-15 00:00:00', endAt: '2022-09-30 00:00:00', memberCount: 3, meetingLink: 'googlemeet.com', currentMemberCount: 2, hostId: 2, bookId: 1 })
        await db.Participation.create({ eventId: 1, memberId: 1 })
      })

    // DELETE /events/member/:id - unjoin an event
    it(' - DELETE /events/member/:id successfully', (done) => {
      request(app)
        .delete('/api/v1/events/member/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done();
        })
    });

      // DELETE /events/host/:id - delete an event
    it(' - DELETE /events/host/:id successfully', (done) => {
        request(app)
          .delete('/api/v1/events/host/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            return done();
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Event.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
})
