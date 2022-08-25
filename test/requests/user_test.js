var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should()
var expect = chai.expect;
const db = require('../../models')
const passport = require('../../config/passport')

describe('# user requests', () => {

  context('# POST ', () => {

    describe('POST /api/v1/users', () => {
      before(async () => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

      // 註冊自己的帳號 POST /users
      it(' - successfully', (done) => {
        request(app)
          .post('/api/v1/users')
          .send('account=Helen&name=Helen&email=Helen@example.com&password=123&checkPassword=123')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // 檢查是否有成功新增資料到資料庫裡
            db.User.findByPk(1).then(user => {
              user.account.should.equal('Helen');
              user.email.should.equal('Helen@example.com');
              return done();
            })
          })
      });

      after(async () => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });


  context('# GET ', () => {

    describe('GET api/v1/users/:id', () => {
      before(async () => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // 模擬登入資料
        const rootUser = await db.User.create({ account: 'root', name: 'root', email:'root@example.com', password:'123' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 });
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({ account: 'User1', name: 'User1', email: 'User1@example.com', password: 'User1' })
        await db.User.create({ account: 'User2', name: 'User2', email: 'User2@example.com', password: 'User2' })
      })


      // GET /users/:id
      it(' - successfully', (done) => {
        request(app)
          .get('/api/v1/users/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            // 檢查是否回傳資料裡有 root 的資料
            res.body.name.should.equal('root');

            return done();
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    });
    
  });


  context('# PUT ', () => {

    describe('PUT /api/v1/users/:id', () => {
      before(async () => {
        // 清除 User, Tweet table 的測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // 模擬登入資料
        const rootUser = await db.User.create({ account: 'root', name: 'root', email: 'root@example.com', password: '123' }); this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1 });
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({ account: 'User1', name: 'User1', email: 'User1', password: 'User1', introduction: 'User1' })
      })

      // 編輯自己所有的資料 PUT /users/:id
      it(' - successfully', (done) => {
        request(app)
          .put('/api/v1/users/1')
          .send('name=User11&account=User11')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            db.User.findByPk(1).then(user => {
              // 檢查資料是否有變更
              user.name.should.equal('User11');
              user.account.should.equal('User11');
              return done();
            })
          })
      });

      after(async () => {
        // 清除登入及測試資料庫資料
        this.authenticate.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({ where: {}, truncate: true, force: true })
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });

  });

});