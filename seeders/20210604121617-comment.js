'use strict';

const db = require("../models");

const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userId = await queryInterface.sequelize.query(
      `SELECT id from Users;`
    );

    const userRows = userId[0];

    await queryInterface.bulkInsert(
      'Comments',
      [
        { 
          userId: userRows[0].id,
          context: 'test context 2',
          createdAt, 
          updatedAt
        },
        {
          userId: userRows[1].id,
          context: 'test context 3',
          createdAt, 
          updatedAt
        },
        {
          userId: userRows[2].id,
          context: 'test context 4',
          createdAt, 
          updatedAt
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Comments', null, {});
  }
};
