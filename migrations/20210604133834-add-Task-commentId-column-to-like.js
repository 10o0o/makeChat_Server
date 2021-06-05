'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LikeOrDislikes', 'commentId', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint("LikeOrDislikes", {
      fields: ["commentId"],
      type: "FOREIGN KEY",
      name: "like_commentId_fk",
      references: {
        table: 'Comments',
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
