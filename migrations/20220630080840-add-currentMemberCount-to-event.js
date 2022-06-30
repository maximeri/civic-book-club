'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Events', 'currentMemberCount', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'currentMemberCount')
  }
};
