module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'publications',
        'productId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'products',
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
      'publications',
      'productId'
    );
  }
};
 