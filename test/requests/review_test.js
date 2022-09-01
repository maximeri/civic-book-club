var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

describe('# review requests', () => {

  context('# POST ', () => {
    describe('POST /api/v1/events', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Review.destroy({ where: {}, truncate: true, force: true })
        await db.LikedReview.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // User login
        const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...user1 }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 })
        await db.Review.create({ id:1, title: 'title2', content:'content2', userId:2, bookId: 1 })
      })

      // Add a reveiew - POST /reviews/:bookId
      it(' - POST /api/v1/reviews/:bookId successfully', (done) => {
        request(app)
          .post('/api/v1/reviews/1')
          .send('title=title1&content=content1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // Check DB data
            db.Review.findOne({ where: { title: 'title1' } }).then(() => {
              return done();
            })
          })
      });

      // Like a review  - POST /reviews/user/:id
      it(' - POST /api/v1/reviews/user/:id successfully', (done) => {
        request(app)
          .post('/api/v1/reviews/user/1')
          .set('Accept', 'application/json')
          // .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // Check for user
            db.LikedReview.findByPk(1).then(like => {
              like.userId.should.equal(1)
              return done()
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
        await db.Review.destroy({ where: {}, truncate: true, force: true })
        await db.LikedReview.destroy({ where: {}, truncate: true, force: true })
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
      await db.Review.destroy({ where: {}, truncate: true, force: true })
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
      await db.Review.create({ title: 'title1', content: 'content1', userId: 1, bookId:1})
      await db.Review.create({ title: 'title2', content: 'content2', userId: 2, bookId:1 })
      await db.Review.create({ title: 'title3', content: 'content3', userId: 1, bookId:2 })
    })

    // GET /reviews/:bookId - get all reviews of a book
    it(' - GET /api/v1/reviews/:bookId successfully', (done) => {
      request(app)
        .get('/api/v1/reviews/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          // check isbn
          res.body[0].title.should.equal('title1')
          res.body[1].title.should.equal('title2')
          return done();
        })
    });

    // GET /reviews/:id - get all reviews of a user
    it(' - GET api/v1/reviews/user/:userId successfully', (done) => {
      request(app)
        .get('/api/v1/reviews/user/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          console.log(res.body)
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          // check topic
          res.body[0].title.should.equal('title1')
          res.body[1].title.should.equal('title3')
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
      await db.Review.destroy({ where: {}, truncate: true, force: true })
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
    })
  });


  context('# PUT ', () => {
    describe('PUT /api/v1/reviews/user/:userId', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Review.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // Login
        const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...user1 }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 })
        // Add a mock up reivew
        await db.Review.create({ title: 'title1', content: 'content1', userId: 1, bookId: 1 })
      })

      // PUT /reviews/:id - edit a review content
      it(' - PUT api/v1/reviews/:id successfully', (done) => {
        request(app)
          .put('/api/v1/reviews/1')
          .send('content=new+content')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            // check title and content
            res.body.title.should.equal('title1')
            res.body.content.should.equal('new content')
            return done();
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.Review.destroy({ where: {}, truncate: true, force: true })
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
      await db.Review.destroy({ where: {}, truncate: true, force: true })
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      // Login
      const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...user1 }, null);
        return (req, res, next) => { };
      });
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({ id: 1 })
      // Add a mock up review
      await db.Review.create({ title: 'title1', content: 'content1', userId: 1, bookId: 1 })
    })

    // DELETE /reviews/:id - delete a review
    it(' - DELETE /reviews/1 successfully', (done) => {
      request(app)
        .delete('/api/v1/reviews/1')
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
      await db.Review.destroy({ where: {}, truncate: true, force: true })
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
    })
  })
})