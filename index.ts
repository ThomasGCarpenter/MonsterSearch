import { initializeSequelize } from "./database.js";
import { getMonster, getSpells } from "./axios.js";

const sequelize = async () => {
  await initializeSequelize();
};
console.log("starting");
sequelize();
getMonster();
getSpells();
export default sequelize;
