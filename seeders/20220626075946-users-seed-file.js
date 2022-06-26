'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
function generateUsers() {
  const arr = []
  for (let i = 0; i < 25; i++) {
    arr[i] = {
      id: i + 1,
      name: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: bcrypt.hashSync('12345678', 10),
      account: `user${i + 1}`,
      preference: faker.lorem.sentence(),
      job: faker.lorem.sentence(),
      goal: faker.lorem.sentence(),
      avatar: `https://loremflickr.com/320/240/people/?random=${Math.floor(100 + Math.random() * 900) }`,
      created_at: new Date(),
      updated_at: new Date()
    }
  }
  return arr
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',
      generateUsers()
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
