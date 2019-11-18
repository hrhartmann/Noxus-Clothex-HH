module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('products', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.STRING,
    },
    exchangePrice: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('products'),
};
