module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    publicationId: DataTypes.INTEGER,
  }, {});

  comment.associate = function associate(models) {
    comment.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    comment.belongsTo(models.publication, {
      foreignKey: 'publicationId',
      onDelete: 'cascade',
    });
  };

  return comment;
};
