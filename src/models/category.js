module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {});

  category.associate = function associate(models) {
    category.hasMany(models.product, {
      foreignKey: 'categoryId',
      onDelete: 'cascade',
    });
  };

  return category;
};
