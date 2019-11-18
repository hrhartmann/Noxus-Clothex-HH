module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    exchangePrice: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    size: DataTypes.INTEGER,
  }, {});

  product.associate = function associate(models) {
    product.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    product.belongsTo(models.category, {
      foreignKey: 'categoryId',
      onDelete: 'cascade',
    });
    product.hasOne(models.trade, {
      foreignKey: 'firstObjectId',
      onDelete: 'cascade',
    });
    product.hasOne(models.trade, {
      foreignKey: 'secondObjectId',
      onDelete: 'cascade',
    });
    product.hasOne(models.publication, {
      foreignKey: 'productId',
      onDelete: 'cascade',
    });
  };

  return product;
};
