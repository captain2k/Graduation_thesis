'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orders", "order_date");
    await queryInterface.removeColumn("Orders", "total_amount");

    await queryInterface.changeColumn("Orders", "order_status", {
      type: Sequelize.ENUM(
        "pending",
        "wait_confirmation",
        "confirmed",
        "shipped",
        "cancelled",
        "delivered"
      ),
      defaultValue: "pending",
      after: "user_id",
    });

    await queryInterface.changeColumn("Orders", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Orders", "order_date", {
      type: Sequelize.DATE,
      after: "user_id",
    });

    await queryInterface.addColumn("Orders", "total_amount", {
      type: Sequelize.INTEGER,
      after: "user_id",
    });

    await queryInterface.changeColumn("Orders", "order_status", {
      type: Sequelize.ENUM(
        "pending",
        "confirmed",
        "shipped",
        "cancelled",
        "delivered"
      ),
      defaultValue: "pending",
      after: "user_id",
    });

    await queryInterface.changeColumn("Orders", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};