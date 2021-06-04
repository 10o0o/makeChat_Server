'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LikeOrDislikes', 'userId', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint("LikeOrDislikes", {
      fields: ["userId"],
      type: "foreign Key",
      name: "like_userId_fk",
      references: {
        table: 'Users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
