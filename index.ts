<<<<<<< eslint
import { initializeSequelize } from './database.js'
import { getMonster, getSpells } from './axios.js'
import Monster from './models/monsters.js'
import Spell from './models/spells.js'
import { Op } from 'sequelize'

const sequelize = async (): Promise<void> => {
  await initializeSequelize()
}

async function letsGo (): Promise<void> {
  try {
    await sequelize()
    await getSpells()
    await getMonster()
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message)
    } else {
      console.log('Unexpected error', err)
=======
import { initializeSequelize } from "./database.js";
import { getMonster, getSpells } from "./axios.js";
import Monster from "./models/monsters.js";
import Spell from "./models/spells.js";
import { Sequelize, QueryTypes, Op } from "sequelize";
import { prototype } from "events";

const sequelize = async () => {
  await initializeSequelize();
};

async function letsGo() {
  try {
    await sequelize();
    await getSpells();
    await getMonster();
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("Unexpected error", err);
>>>>>>> master
    }
  }
}

<<<<<<< eslint
async function queryFunc (): Promise<void> {
  await letsGo()
  const users = await Monster.findAll({
    where: {
      challengeRating: {
        [Op.gt]: `${process.argv[2]}`
      }
=======
async function queryFunc() {
  await letsGo();
  const users = await Monster.findAll({
    where: {
      challengeRating: {
        [Op.gt]: `${process.argv[2]}`,
      },
>>>>>>> master
    },
    include: {
      model: Spell,
      where: {
<<<<<<< eslint
        damageType: `${process.argv[3]}`
      }
    }
  })
  console.log('Look!', JSON.stringify(users, null, 2))
}

await queryFunc()

export default sequelize
=======
        damageType: `${process.argv[3]}`,
      },
    },
  });
  console.log("Look!", JSON.stringify(users, null, 2));
}

queryFunc();

export default sequelize;
>>>>>>> master
