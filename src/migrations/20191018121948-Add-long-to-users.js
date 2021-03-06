module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'long',
        Sequelize.FLOAT,
      ),
    ]);
  },
down: function(queryInterface, Sequelize) {
  // logic for reverting the changes
  return queryInterface.removeColumn(
    'users',
    'long'
  );
}
};
