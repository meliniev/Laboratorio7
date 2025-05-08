export default (sequelize, Sequelize) => {
    return sequelize.define("Users", {
      username: {
        type: Sequelize.STRING,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
    });
  };