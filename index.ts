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
    }
  }
}

async function queryFunc (): Promise<void> {
  await letsGo()
  const users = await Monster.findAll({
    where: {
      challengeRating: {
        [Op.gt]: `${process.argv[2]}`
      }
    },
    include: {
      model: Spell,
      where: {
        damageType: `${process.argv[3]}`
      }
    }
  })
  console.log('Look!', JSON.stringify(users, null, 2))
}

await queryFunc()

export default sequelize
