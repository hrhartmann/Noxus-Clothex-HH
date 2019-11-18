module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('favoritepublications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
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
          model: 'publications',
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

  down: (queryInterface) => queryInterface.dropTable('favoritepublications'),
};
