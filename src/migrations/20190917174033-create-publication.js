module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('publications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    title: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.BLOB,
    },
    description: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
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

  down: (queryInterface) => queryInterface.dropTable('publications'),
};
