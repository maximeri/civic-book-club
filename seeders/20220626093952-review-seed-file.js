'use strict';
const faker = require('faker')
function generateReviews() {
  const arr = []
  for (let i = 0; i < 5; i++) {
    arr[i] = {
      id: i + 1,
      title: `review${i + 1}`,
      content: faker.lorem.paragraph(),
      user_id: `${Math.floor(1 + Math.random() * 25)}`,
      book_id: `${Math.floor(1 + Math.random() * 5)}`,
      created_at: new Date(),
      updated_at: new Date()
    }
  }
  return arr
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews',
      generateReviews()
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {})
  }
};
