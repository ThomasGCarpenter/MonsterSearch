import axios from 'axios'

import Monster from './models/monsters.js'
import Spell from './models/spells.js'

export async function getMonster (): Promise<void> {
  interface GetMonstersResponseSchema {
    count: number
    results: [{
      index: string
      name: string
      url: string
    }]
  }
  interface GetMonsterResponseSchema {
    special_abilities: [{
      spellcasting: {
        spells: [{
          name: string
        }]
      }
    }]
    name: string
    challenge_rating: number
    armor_class: number
  }

  try {
    const response = await axios.get<GetMonstersResponseSchema>('https://www.dnd5eapi.co/api/monsters')

    const arrayPromise = Object.values(response.data.results).map(
      async (monster) => {
        const monsterResponse = await axios.get<GetMonsterResponseSchema>(
          `https://www.dnd5eapi.co${monster.url}`
        )
        const specAbilites = monsterResponse.data.special_abilities
        const spellNames: string[] = []
        specAbilites.forEach((specAbility) => {
          if (specAbility.spellcasting !== undefined) {
            specAbility.spellcasting.spells.forEach((spell) =>
              spellNames.push(spell.name)
            )
          }
        })

        const monsterPost = Monster.build({
          name: monsterResponse.data.name,
          challengeRating: monsterResponse.data.challenge_rating,
          armorClass: monsterResponse.data.armor_class
        })
        await monsterPost.save()

        const spellPromiseArr = spellNames.map(async (x) => {
          const spellAssociation = await Spell.findOne({
            where: { name: x }
          })
          if (spellAssociation === null) {
            console.log('Not found!', x)
          } else {
            await monsterPost.addSpell(spellAssociation)
          }
        })
        await Promise.all(spellPromiseArr)
      }
    )
    await Promise.all(arrayPromise)
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message)
    } else {
      console.log('Unexpected error', err)
    }
  }
}

export async function getSpells (): Promise<void> {
  interface GetSpellsResponseSchema {
    count: number
    results: [{
      index: string
      name: string
      url: string
    }]
  }
  try {
    const response = await axios.get<GetSpellsResponseSchema>('https://www.dnd5eapi.co/api/spells')
    const spellArr = Object.values(response.data.results).map(
      async (spell) => {
        const spellResponse = await axios.get(
          `https://www.dnd5eapi.co${spell.url}`
        )
        if (
          spellResponse.data?.damage !== undefined &&
          spellResponse.data.damage.damage_type !== undefined
        ) {
          const spellPost = Spell.build({
            name: spellResponse.data.name,
            level: spellResponse.data.level,
            concentration: spellResponse.data.concentration,
            damageType: spellResponse.data.damage.damage_type.name
          })
          await spellPost.save()
        }
      }
    )
    await Promise.all(spellArr)
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message)
    } else {
      console.log('Unexpected error', err)
    }
  }
}
