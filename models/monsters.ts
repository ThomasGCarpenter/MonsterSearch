import Sequelize from "sequelize";
import sequelize from "../index";

const Monster = sequelize.define("monster", {
  name: {
    type: Sequelize.STRING,
  },
  CR: {
    type: Sequelize.STRING,
  },
});

module.exports = Monster;
