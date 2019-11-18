module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'products',
        'categoryId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'categories',
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
      'products',
      'categoryId'
    );
  }
};
