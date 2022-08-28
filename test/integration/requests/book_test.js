var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../../app')
var helpers = require('../../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../../models')
const passport = require('../../../config/passport')

describe('# book requests', () => {

  context('# POST ', () => {

    describe('POST /api/v1/books', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // User login
        const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...user1 }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 })
      })

      // Add a book - POST /books
      it(' - successfully', (done) => {
        request(app)
          .post('/api/v1/books')
          .send('name=The+A.B.C.+Murders&isbn=9781579126247&introduction=introduction&image=image')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // Check DB data
            db.Book.findOne({ where: { name: 'The A.B.C. Murders'}}).then(book => {
              book.isbn.should.equal('9781579126247');
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
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

    describe('POST /api/v1/books/:id', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.LikedBook.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // User login
        const user1 = await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...user1 }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 })
        // Add a mock up book
        await db.Book.create({ name: 'Book Name', isbn: '9781579126247', introduction:'introduction', image:'image' })
      })

      // Like a book - POST /api/v1/books/:id
      it(' - successfully', (done) => {
        request(app)
          .post('/api/v1/books/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // Check for user
            db.LikedBook.findByPk(1).then(like => {
              like.userId.should.equal(1);
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
        await db.LikedBook.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    });

  });

  context('# GET ', () => {

    describe('GET /api/v1/books', () => {
      before(async () => {
        // Clear DB testing datas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
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
        await db.Book.create({ name: 'Book Name1', isbn: '9766679126241', introduction: 'introduction1', image: 'image1' })
        await db.Book.create({ name: 'Book Name2', isbn: '9766679126242', introduction: 'introduction2', image: 'image2' })
        await db.Book.create({ name: 'Book Name3', isbn: '9766679126243', introduction: 'introduction3', image: 'image3' })
        await db.Book.create({ name: 'Book Name4', isbn: '9766679126244', introduction: 'introduction4', image: 'image4' })
        await db.Book.create({ name: 'Book Name5', isbn: '9766679126245', introduction: 'introduction5', image: 'image5' })
        await db.Book.create({ name: 'Book Name6', isbn: '9766679126246', introduction: 'introduction6', image: 'image6' })
        await db.Book.create({ name: 'Book Name7', isbn: '9766679126247', introduction: 'introduction7', image: 'image7' })
        await db.Book.create({ name: 'Book Name8', isbn: '9766679126248', introduction: 'introduction8', image: 'image8' })
        await db.Book.create({ name: 'Book Name9', isbn: '9766679126249', introduction: 'introduction9', image: 'image9' })
        await db.Book.create({ name: 'Book Name10', isbn: '9766679126240', introduction: 'introduction0', image: 'image0' })
        await db.LikedBook.create({ bookId: 1, userId: 1 })
        await db.LikedBook.create({ bookId: 2, userId: 1 })
      })

      // GET /api/v1/books - all books
      it(' - successfully', (done) => {
        request(app)
          .get('/api/v1/books')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            // check isbn
            res.body[0].isbn.should.equal('9766679126241')
            res.body[1].isbn.should.equal('9766679126242')
            return done();
          })
      });

      // GET /books/:bookId - a book
      it(' - successfully', (done) => {
        request(app)
          .get('/api/v1/books/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            // check isbn
            res.body.isbn.should.equal('9766679126241');
            return done();
          })
      });

      // GET /books/top10 - top 10 books
      it(' - successfully', (done) => {
        request(app)
          .get('/api/v1/books/top10')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            // check isbn
            res.body[0].isbn.should.equal('9766679126241')
            res.body[1].isbn.should.equal('9766679126242')
            res.body[2].isbn.should.equal('9766679126243')
            res.body[3].isbn.should.equal('9766679126244')
            res.body[4].isbn.should.equal('9766679126245')
            res.body[5].isbn.should.equal('9766679126246')
            res.body[6].isbn.should.equal('9766679126247')
            res.body[7].isbn.should.equal('9766679126248')
            res.body[8].isbn.should.equal('9766679126249')
            res.body[9].isbn.should.equal('9766679126240')
            return done();
          })
      });

      // GET /books/user/:userId - user's liked books
      it(' - successfully', (done) => {
        request(app)
          .get('/api/v1/books/user/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array')
            // check isbn
            res.body[0].Book.isbn.should.equal('9766679126241')
            res.body[1].Book.isbn.should.equal('9766679126242')
            return done();
          })
      });

      after(async () => {
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.Book.destroy({ where: {}, truncate: true, force: true })
        await db.LikedBook.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });

  context('# PUT ', () => {
    before(async() => {
      // Clear DB testing datas
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
      await db.User.destroy({ where: {}, truncate: true, force: true })
      await db.Book.destroy({ where: {}, truncate: true, force: true })
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
      await db.Book.create({ name: 'Book Name1', isbn: '9766679126241', introduction: 'introduction1', image: 'image1' })
    })

    // PUT /books/:id - edit a book
    it(' - successfully', (done) => {
      request(app)
        .put('/api/v1/books/1')
        .send('introduction=New+introduction')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          console.log(00000000000, res.body)
          expect(res.body).to.be.an('object')
          // check introduction
          res.body.introduction.should.equal('New introduction')
          return done();
        })
    });

    after(async () => {
      this.authenticate.restore();
      this.getUser.restore();
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
      await db.User.destroy({ where: {}, truncate: true, force: true })
      await db.Book.destroy({ where: {}, truncate: true, force: true })
      await db.LikedBook.destroy({ where: {}, truncate: true, force: true })
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
    })

  })

});
