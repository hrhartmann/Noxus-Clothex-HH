module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('reviews', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    satisfaction: {
      type: Sequelize.INTEGER,
    },
    puntuality: {
      type: Sequelize.INTEGER,
    },
    quality: {
      type: Sequelize.INTEGER,
    },
    tradeId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'trades',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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

  down: (queryInterface) => queryInterface.dropTable('reviews'),
};
