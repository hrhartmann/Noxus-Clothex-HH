module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'trades',
        'publicationId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'publications',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      ),
    ]);
  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'trades',
      'publicationId'
    );
  }
};
