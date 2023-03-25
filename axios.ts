import axios from 'axios';

import Monster from './models/monsters.js';
import Spell from './models/spells.js';

interface GetMonstersResponseSchema {
  count: number;
  results: [
    {
      index: string;
      name: string;
      url: string;
    }
  ];
}

interface GetMonsterResponseSchema {
  special_abilities: [
    {
      spellcasting: {
        spells: [
          {
            name: string;
          }
        ];
      };
    }
  ];
  name: string;
  challenge_rating: number;
  armor_class: number;
}

export async function getMonsters(): Promise<
  GetMonstersResponseSchema | undefined
> {
  try {
    const response = await axios.get<GetMonstersResponseSchema>(
      'https://www.dnd5eapi.co/api/monsters'
    );
    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
}

export async function getMonster(
  monster: string
): Promise<GetMonsterResponseSchema | undefined> {
  try {
    const monsterResponse = await axios.get<GetMonsterResponseSchema>(
      `https://www.dnd5eapi.co${monster}`
    );
    return monsterResponse.data;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
}

export async function buildMonster(
  monsterResponse
): Promise<Monster | undefined> {
  try {
    const ac = monsterResponse.armor_class;
    const instantiatedMonster = Monster.build({
      name: monsterResponse.name,
      challengeRating: monsterResponse.challenge_rating,
      armorClass: ac[0].value,
    });
    await instantiatedMonster.save();
    return instantiatedMonster;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export async function populateMonsterTable(): Promise<void> {
  try {
    const response = await getMonsters();

    if (response != null) {
      const success = Object.values(response.results).map(async (monster) => {
        const spellNames: string[] = [];
        const monsterResponse = await getMonster(monster.url);
        const monsterIsBuilt = await buildMonster(monsterResponse);

        const hereIGoFilteringAgain = monsterResponse?.special_abilities.find(
          (element) => element.spellcasting
        );

        if (hereIGoFilteringAgain !== undefined) {
          hereIGoFilteringAgain.spellcasting.spells.forEach((spell) =>
            spellNames.push(spell.name)
          );
        }

        const spellPromiseArr = spellNames.map(async (spellName) => {
          const spellAssociation = await Spell.findOne({
            where: { name: spellName },
          });
          if (spellAssociation === null) {
            console.log('Not found!', spellName);
          } else {
            await monsterIsBuilt?.addSpell(spellAssociation);
          }
        });
        await Promise.all(spellPromiseArr);
      });
      await Promise.all(success);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
}

export async function getSpells(): Promise<void> {
  interface GetSpellsResponseSchema {
    count: number;
    results: [
      {
        index: string;
        name: string;
        url: string;
      }
    ];
  }
  try {
    const response = await axios.get<GetSpellsResponseSchema>(
      'https://www.dnd5eapi.co/api/spells'
    );
    const spellArr = Object.values(response.data.results).map(async (spell) => {
      const spellResponse = await axios.get(
        `https://www.dnd5eapi.co${spell.url}`
      );
      if (
        spellResponse.data?.damage !== undefined &&
        spellResponse.data.damage.damage_type !== undefined
      ) {
        const spellPost = Spell.build({
          name: spellResponse.data.name,
          level: spellResponse.data.level,
          concentration: spellResponse.data.concentration,
          damageType: spellResponse.data.damage.damage_type.name,
        });
        await spellPost.save();
      }
    });
    await Promise.all(spellArr);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
}
