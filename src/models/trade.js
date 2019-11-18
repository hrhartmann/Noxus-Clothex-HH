module.exports = (sequelize, DataTypes) => {
  const trade = sequelize.define('trade', {
    shippingCost: DataTypes.INTEGER,
    state: DataTypes.STRING,
    firstUserId: DataTypes.INTEGER,
    secondUserId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    publicationId: DataTypes.INTEGER,
    firstObjectId: DataTypes.INTEGER,
    secondObjectId: DataTypes.INTEGER,
  }, {});

  trade.associate = function associate(models) {
    trade.belongsTo(models.publication, {
      foreignKey: 'publicationId',
      onDelete: 'cascade',
    });
    trade.belongsTo(models.user, {
      foreignKey: 'firstUserId', as: 'requestReceiver',
    });
    trade.belongsTo(models.user, {
      foreignKey: 'secondUserId', as: 'requestMaker',
    });
    trade.belongsTo(models.product, {
      foreignKey: 'firstObjectId',
      onDelete: 'cascade',
    });
    trade.belongsTo(models.product, {
      foreignKey: 'secondObjectId',
      onDelete: 'cascade',
    });
    trade.hasOne(models.review, {
      foreignKey: 'tradeId',
      onDelete: 'cascade',
      sourceKey: 'id',
    });
  };

  return trade;
};
