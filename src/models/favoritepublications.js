module.exports = (sequelize, DataTypes) => {
    const favoritepublications = sequelize.define('favoritepublications', {
      userId: DataTypes.INTEGER,
      publicationId: DataTypes.INTEGER,
    }, {});
  
    favoritepublications.associate = function associate(models) {
      favoritepublications.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'cascade',
      });
      favoritepublications.belongsTo(models.publication, {
        foreingKey: 'publicationId',
        onDelete: 'cascade',
      });
    };
  
    return favoritepublications;
  };