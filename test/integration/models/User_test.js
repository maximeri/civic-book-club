// Testing items: 1. attributes 2. associations 3. CRUD
var chai = require('chai')
var sinon = require('sinon')
var proxyquire = require('proxyquire');
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  Sequelize
} = require('sequelize-test-helpers')

const db = require('../../../models')

describe('# User Model', () => {
  // Get DataTypes from Sequelize
  const { DataTypes } = Sequelize
  // Replace the sequelize in models/user with the Sequelize here
  const UserFactory = proxyquire('../../../models/user', {
    sequelize: Sequelize
  })

  // Declare User
  let User

  before(() => {
    // Assign value to User(User Model instance)
    User = UserFactory(sequelize, DataTypes)
  })

  // Clear init data
  after(() => {
    User.init.resetHistory()
  })

  // 1. Test attributes 
  context('properties', () => {
    it('called User.init with the correct parameters', () => {
      expect(User.init).to.have.been.calledWithMatch(
        {
          name: DataTypes.STRING,
          email: DataTypes.STRING,
          password: DataTypes.STRING,
          account: DataTypes.STRING,
          preference: DataTypes.STRING,
          job: DataTypes.STRING,
          goal: DataTypes.STRING,
          avatar: DataTypes.STRING
        }
      )
    })
  })

  // 2. Test associations
  context('associations', () => {
    const Book = 'Book'
    const Event = 'Event'
    const Review = 'Review'
    before(() => {
      // Associate User model with User, Book, Event, Review (call assocaite)
      User.associate({ Book })
      User.associate({ Event })
      User.associate({ Review })
      User.associate({ User })
    })

    it('should have many events', (done) => {
      // Test if hasMany(Event) is called
      expect(User.hasMany).to.have.been.calledWith(Event)
      done()
    })
    it('should have many reviews', (done) => {
      // Test if hasMany(Review) is called
      expect(User.hasMany).to.have.been.calledWith(Review)
      done()
    })
    it('should have many books', (done) => {
      // Test if hasMany(Book) is called
      expect(User.belongsToMany).to.have.been.calledWith(Book)
      done()
    })
    it('should have many users', (done) => {
      // Test if hasMany(User) is called
      expect(User.belongsToMany).to.have.been.calledWith(User)
      done()
    })
  })

  // 3. Test CRUD
  context('action', () => {
    let data = null
    //  Test create
    it('create', (done) => {
      db.User.create({
        id:0,
        name: 'helen',
        email: 'helen@gmail.com',
        password: '123',
        account: 'helen',
        preference: 'slow reading',
        job: 'backend engineer',
        goal: 'make friends who enjoy reading',
        avatar: 'handsome_tom.png'
      }).then((user) => {
        data = user
        done()
      })
    })
    //  Test read
    it('read', (done) => {
      db.User.findByPk(data.id).then((user) => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    //  Test update
    it('update', (done) => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    //  Test delete
    it('delete', (done) => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })
})
