module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    satisfaction: DataTypes.INTEGER,
    puntuality: DataTypes.INTEGER,
    quality: DataTypes.INTEGER,
    tradeId: DataTypes.INTEGER,
  }, {});

  review.associate = function associate(models) {
    review.belongsTo(models.trade, {
      foreignKey: 'tradeId',
      onDelete: 'cascade',
    });
  };

  return review;
};
