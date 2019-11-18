module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'messages',
        'chatId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'chats',
            key: 'id',
          }
        }
      ),
    ]);
  },
  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'messages',
      'chatId'
    );
  }
  };