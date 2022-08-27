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

const db = require('../../models')

describe('# Event Model', () => {
  // Get DataTypes from Sequelize
  const { DataTypes } = Sequelize
  // Replace the sequelize in models/event with the Sequelize here
  const EventFactory = proxyquire('../../models/event', {
    sequelize: Sequelize
  })

  // Declare Event
  let Event

  before(() => {
    // Assign value to Event(Event Model instance)
    Event = EventFactory(sequelize, DataTypes)
  })

  // Clear init data
  after(() => {
    Event.init.resetHistory()
  })

  // 1. Test attributes 
  context('properties', () => {
    it('called Event.init with the correct parameters', () => {
      expect(Event.init).to.have.been.calledWithMatch(
        {
          topic: DataTypes.STRING,
          startAt: DataTypes.DATE,
          endAt: DataTypes.DATE,
          memberCount: DataTypes.INTEGER,
          meetingLink: DataTypes.STRING,
          currentMemberCount: DataTypes.INTEGER,
          hostId: DataTypes.INTEGER,
          bookId: DataTypes.INTEGER
        }
      )
    })
  })

  // 2. Test associations
  context('associations', () => {
    const User = 'User'
    const Book = 'Book'
    const Review = 'Review'
    const Participation = 'Participation'
    before(() => {
      // Associate Event model with Book, User, Review, Participation (call assocaite)
      Event.associate({ Book })
      Event.associate({ User })
      Event.associate({ Review })
      Event.associate({ Participation })
    })

    it('should have many events', (done) => {
      // Test if hasMany(Event) is called
      expect(Event.hasMany).to.have.been.calledWith(Participation)
      done()
    })
    it('should have many events', (done) => {
      // Test if belongsTo(Event) is called
      expect(Event.belongsTo).to.have.been.calledWith(Book)
      done()
    })
    it('should have many events', (done) => {
      // Test if belongsTo(Event) is called
      expect(Event.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should have many events', (done) => {
      // Test if belongsToMany(Event) is called
      expect(Event.belongsToMany).to.have.been.calledWith(User)
      done()
    })
  })

  // 3. Test CRUD
  context('action', () => {
    let data = null
    //  Test create
    it('create', (done) => {
      db.Event.create({
        topic: 'topic',
        startAt: '2022-11-11',
        endAt: '2022-11-11',
        memberCount: 3,
        meetingLink: 'googlemeet.com',
        currentMemberCount: 1,
        hostId: 1,
        bookId: 1
      }).then((event) => {
        data = event
        done()
      })
    })
    //  Test read
    it('read', (done) => {
      db.Event.findByPk(data.id).then((event) => {
        expect(data.id).to.be.equal(event.id)
        done()
      })
    })
    //  Test update
    it('update', (done) => {
      db.Event.update({}, { where: { id: data.id } }).then(() => {
        db.Event.findByPk(data.id).then((event) => {
          expect(data.updatedAt).to.be.not.equal(event.updatedAt)
          done()
        })
      })
    })
    //  Test delete
    it('delete', (done) => {
      db.Event.destroy({ where: { id: data.id } }).then(() => {
        db.Event.findByPk(data.id).then((event) => {
          expect(event).to.be.equal(null)
          done()
        })
      })
    })
  })
})
