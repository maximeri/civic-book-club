// Testing items: 1. attributes 2. associations 3. CRUD
var chai = require('chai') // assertion library
var sinon = require('sinon') // test spies, stubs and mocks for js
var proxyquire = require('proxyquire') // stubs nodeJS require dependencies with minimalistic module
chai.use(require('sinon-chai')) // custom assertions for using the Sinon.JS  framework with the Chai assertion library

const { expect } = require('chai')
const {
  sequelize,
  Sequelize
} = require('sequelize-test-helpers')

const db = require('../../models')

describe('# Book Model', () => {
  // Get DataTypes from Sequelize
  const { DataTypes } = Sequelize
  // Replace the sequelize in models/book with the Sequelize here
  const BookFactory = proxyquire('../../models/book', {
    sequelize: Sequelize
  })

  // Declare Book
  let Book

  before(() => {
    // Assign value to Book(Book Model instance)
    Book = BookFactory(sequelize, DataTypes)
  })

  // Clear init data
  after(() => {
    Book.init.resetHistory()
  })

  // 1. Test attributes 
  context('properties', () => {
    it('called Book.init with the correct parameters', () => {
      expect(Book.init).to.have.been.calledWithMatch(
        {
          name: DataTypes.STRING,
          isbn: DataTypes.STRING,
          introduction: DataTypes.TEXT,
          image: DataTypes.STRING
        }
      )
    })
  })

  // 2. Test associations
  context('associations', () => {
    const User = 'User'
    const Event = 'Event'
    const Review = 'Review'
    before(() => {
      // Associate Book model with User, Event, Review (call assocaite)
      Book.associate({ Event })
      Book.associate({ User })
      Book.associate({ Review })
    })

    it('should have many events', (done) => {
      // Test if hasMany(Event) is called
      expect(Book.hasMany).to.have.been.calledWith(Event)
      done()
    })
    it('should have many reviews', (done) => {
      // Test if hasMany(Review) is called
      expect(Book.hasMany).to.have.been.calledWith(Review)
      done()
    })
    it('should have many books', (done) => {
      // Test if belongsToMany(Book) is called
      expect(Book.belongsToMany).to.have.been.calledWith(User)
      done()
    })
  })

  // 3. Test CRUD
  context('action', () => {
    let data = null
    //  Test create
    it('create', (done) => {
      db.Book.create({
        name: 'Book Name',
        isbn: '1234567890123',
        introduction: 'introduction',
        image: 'image'
      }).then((book) => {
        data = book
        done()
      })
    })
    //  Test read
    it('read', (done) => {
      db.Book.findByPk(data.id).then((book) => {
        expect(data.id).to.be.equal(book.id)
        done()
      })
    })
    //  Test update
    it('update', (done) => {
      db.Book.update({}, { where: { id: data.id } }).then(() => {
        db.Book.findByPk(data.id).then((book) => {
          expect(data.updatedAt).to.be.not.equal(book.updatedAt)
          done()
        })
      })
    })
    //  Test delete
    it('delete', (done) => {
      db.Book.destroy({ where: { id: data.id } }).then(() => {
        db.Book.findByPk(data.id).then((book) => {
          expect(book).to.be.equal(null)
          done()
        })
      })
    })
  })
})
