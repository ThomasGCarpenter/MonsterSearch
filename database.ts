import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import Monster, { initializeMonster } from './models/monsters.js'
import Spell, { initializeSpells } from './models/spells.js'

dotenv.config()

let devDB = ''
if (process.env.DEV_DATABASE_URL !== undefined) {
  devDB = process.env.DEV_DATABASE_URL
}

export async function initializeSequelize (): Promise<Sequelize> {
  let sequelize: Sequelize
  // this if for future use with Heroku, currently only support devdb
  if (process.env.DATABASE_URL !== undefined) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  } else {
    sequelize = new Sequelize(devDB, { dialect: 'postgres' })
  }
  await sequelize.authenticate()
  console.log('Connection has been established successfully.')
  initializeMonster(sequelize)
  initializeSpells(sequelize)
  Monster.belongsToMany(Spell, { through: 'MonsterSpells' })
  Spell.belongsToMany(Monster, { through: 'MonsterSpells' })
  await sequelize.sync({ force: true })

  return sequelize
}
