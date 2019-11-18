module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'products',
        'size',
        {
          type: Sequelize.INTEGER,
        }
      ),
    ]);
  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'products',
      'size'
    );
  }
};
