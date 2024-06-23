'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('Categories', 'name', {
          type: Sequelize.DataTypes.STRING,
          unique: true,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('Categories', 'name', {
          type: Sequelize.DataTypes.STRING,
          unique: false,
        }, { transaction: t }),
      ]);
    });
  }
};