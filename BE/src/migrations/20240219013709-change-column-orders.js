'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Order_detail", "product_list_id");
    await queryInterface.removeColumn("Order_detail", "unit_list_price");
    
    await queryInterface.addColumn("Order_detail", "productId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Products", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      after: 'order_id',
    });

    await queryInterface.changeColumn("Order_detail", "order_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Orders", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Order_detail", "product_list_id", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Order_detail", "unit_list_price", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("Order_detail", "productId");
    await queryInterface.changeColumn("Order_detail", "order_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};