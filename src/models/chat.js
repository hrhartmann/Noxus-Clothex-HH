module.exports = (sequelize, DataTypes) => {
  const chat = sequelize.define('chat', {
    userId: DataTypes.INTEGER,
    secondUserId: DataTypes.INTEGER,
  }, {});

  chat.associate = function associate(models) {
    chat.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    chat.belongsTo(models.user, {
      foreignKey: 'secondUserId',
      onDelete: 'cascade',
    });
    chat.hasMany(models.message, {
      foreignKey: 'chatId',
      onDelete: 'cascade',
    });
  };

  return chat;
};
