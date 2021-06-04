'use strict';
const createdAt = new Date();
const updatedAt = new Date();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Jae Seon Choi',
          email: 'test1@gmail.com',
          password: 'test1234',
          nickName: 'test1',
          createdAt,
          updatedAt,
        },
        { name: 'Ho Jin Lee', 
          email: 'test2@gmail.com',
          password: 'test1234',
          nickName: 'test2',
          createdAt, 
          updatedAt
        },
        {
          name: 'TestTest',
          email: 'test3@gmail.com',
          password: 'test1234',
          nickName: 'test3',
          createdAt, 
          updatedAt
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
