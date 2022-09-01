// Testing items: 1. attributes 2. associations 3. CRUD
var chai = require('chai')
var proxyquire = require('proxyquire');
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  Sequelize
} = require('sequelize-test-helpers')

const db = require('../../models')

describe('# Review Model', () => {
  // Get DataTypes from Sequelize
  const { DataTypes } = Sequelize
  // Replace the sequelize in models/review with the Sequelize here
  const ReviewFactory = proxyquire('../../models/review', {
    sequelize: Sequelize
  })

  // Declare Review
  let Review

  before(() => {
    // Assign value to Review(Review Model instance)
    Review = ReviewFactory(sequelize, DataTypes)
  })

  // Clear init data
  after(() => {
    Review.init.resetHistory()
  })

  // 1. Test attributes 
  context('properties', () => {
    it('called Review.init with the correct parameters', () => {
      expect(Review.init).to.have.been.calledWithMatch(
        {
          title: DataTypes.STRING,
          content: DataTypes.TEXT,
          user_id: DataTypes.NUMBER,
          book_id: DataTypes.NUMBER
        }
      )
    })
  })

  // 2. Test associations
  context('associations', () => {
    const User = 'User'
    const Book = 'Book'
    before(() => {
      // Associate Review model with Book, User (call assocaite)
      Review.associate({ Book })
      Review.associate({ User })
    })

    it('should have many reviews', (done) => {
      // Test if belongsTo(Review) is called
      expect(Review.belongsTo).to.have.been.calledWith(Book)
      done()
    })
    it('should have many reviews', (done) => {
      // Test if belongsTo(Review) is called
      expect(Review.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should have many reviews', (done) => {
      // Test if belongsToMany(Review) is called
      expect(Review.belongsToMany).to.have.been.calledWith(User)
      done()
    })
  })

  // 3. Test CRUD
  context('action', () => {
    let data = null
    //  Test create
    it('create', (done) => {
      db.Review.create({
        title: 'title',
        content: 'content',
        user_id: 1,
        book_id: 1
      }).then((review) => {
        data = review
        done()
      })
    })
    //  Test read
    it('read', (done) => {
      db.Review.findByPk(data.id).then((review) => {
        expect(data.id).to.be.equal(review.id)
        done()
      })
    })
    //  Test update
    it('update', (done) => {
      db.Review.update({}, { where: { id: data.id } }).then(() => {
        db.Review.findByPk(data.id).then((review) => {
          expect(data.updatedAt).to.be.not.equal(review.updatedAt)
          done()
        })
      })
    })
    //  Test delete
    it('delete', (done) => {
      db.Review.destroy({ where: { id: data.id } }).then(() => {
        db.Review.findByPk(data.id).then((review) => {
          expect(review).to.be.equal(null)
          done()
        })
      })
    })
  })
})
