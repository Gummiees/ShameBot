const Sequelize = require('sequelize');

module.exports = function myDatabase() {
  this.getDatabase = function() {
    const sequelize = new Sequelize('database', 'root', 'root', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      // SQLite only
      storage: 'database.sqlite'
    });

    return sequelize;
  };

  this.defineDatabase = function() {
    const sequelize = this.getDatabase();
    const Tags = sequelize.define('tags', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM,
        values: global.categories
      },
      duration: Sequelize.DATE,
      counter: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    });

    return Tags;
  };
};
