'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      topic: {
        allowNull: false,
        type: Sequelize.STRING
      },
      start_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      end_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      member_count: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      current_member_count: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      meeting_link: {
        allowNull: false,
        type: Sequelize.STRING
      },
      host_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      book_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Events');
  }
};