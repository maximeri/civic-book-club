'use strict';
const faker = require('faker')
function generateBooks() {
  const arr = []
  for (let i = 0; i < 5; i++) {
    arr[i] = {
      id: i + 1,
      name: `book${i + 1}`,
      ISBN: `${Math.floor(1000000000000 + Math.random() * 9000000000000) }`,
      introduction: faker.lorem.sentence(),
      image: `https://loremflickr.com/320/240/random/?random=${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date(),
      updated_at: new Date()
    }
  }
  return arr
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Books',
      generateBooks()
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {})
  }
};
