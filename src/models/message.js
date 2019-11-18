module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    content: DataTypes.TEXT,
    senderUserId: DataTypes.INTEGER,
    receiverUserId: DataTypes.INTEGER,
  }, {});

  message.associate = function associate(models) {
    message.belongsTo(models.user, {
      foreignKey: 'senderUserId',
      onDelete: 'cascade',
    });
    message.belongsTo(models.user, {
      foreignKey: 'receiverUserId',
      onDelete: 'cascade',
    });
    message.belongsTo(models.chat, {
      foreignKey: 'chatId',
      onDelete: 'cascade',
    });
  };

  return message;
};
