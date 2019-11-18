const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    adress: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    category: DataTypes.STRING,
    reputation: DataTypes.FLOAT,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT
  }, {});

  user.associate = function associate(models) {
    user.hasMany(models.publication, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    user.hasMany(models.comment, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    user.hasMany(models.chat, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    user.hasMany(models.chat, {
      foreignKey: 'secondUserId',
      onDelete: 'cascade',
    });
    user.hasMany(models.message, {
      foreignKey: 'senderUserId',
      onDelete: 'cascade',
    });
    user.hasMany(models.message, {
      foreignKey: 'receiverUserId',
      onDelete: 'cascade',
    });
    user.hasMany(models.product, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    user.hasMany(models.trade, {
      foreignKey: 'firstUserId',
      onDelete: 'cascade',
    });
    user.hasMany(models.trade, {
      foreignKey: 'secondUserId',
      onDelete: 'cascade',
    });
  };

  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    if (this.category == "Admin"){
      buildPasswordHash(this);
      return (password == this.password);
    } else {
    return bcrypt.compare(password, this.password);
    }
  };

  return user;
};
