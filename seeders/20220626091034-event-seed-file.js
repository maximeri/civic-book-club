'use strict';
function generateEvents() {
  const arr = []
  for (let i = 0; i < 25; i++) {
    arr[i] = {
      id: i + 1,
      topic: `event${i + 1}`,
      start_at: new Date(),
      end_at: new Date(),
      member_count: `${Math.floor(2 + Math.random() * 25)}`,
      current_member_count: 1,
      meeting_link:'https://meet.google.com/wxf-vsxc-vnk',
      host_id: `${Math.floor(1 + Math.random() * 25)}`,
      book_id: `${Math.floor(1 + Math.random() * 25)}`,
      created_at: new Date(),
      updated_at: new Date()
    }
  }
  return arr
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Events',
      generateEvents()
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {})
  }
};
