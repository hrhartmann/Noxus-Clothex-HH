module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('comments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    content: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    publicationId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
        references: {
          model: 'products',
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

  down: (queryInterface) => queryInterface.dropTable('comments'),
};
