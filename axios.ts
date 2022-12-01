import axios from "axios";

import Monster from "./models/monsters.js";
import Spell from "./models/spells.js";

export async function getMonster() {
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/monsters");

    const arrayPromise = Object.values(response.data.results).map(
      async (monster: any) => {
        const monsterResponse = await axios.get(
          `https://www.dnd5eapi.co${monster.url}`
        );
        const specAbilites = monsterResponse.data.special_abilities;
        let spellNames = [];
        specAbilites.forEach((ability: { spellcasting: { spells: any[] } }) => {
          if (ability.spellcasting !== undefined) {
            ability.spellcasting.spells.forEach((name) =>
              spellNames.push(name.name)
            );
          }
        });

        let monsterPost = Monster.build({
          name: monsterResponse.data.name,
          challengeRating: monsterResponse.data.challenge_rating,
          armorClass: monsterResponse.data.armor_class,
        });
        await monsterPost.save();

        const spellPromiseArr = spellNames.map(async (x) => {
          const spellAssociation = await Spell.findOne({
            where: { name: x },
          });
          if (spellAssociation === null) {
            console.log("Not found!", x);
          } else {
            monsterPost.addSpell(spellAssociation);
          }
        });
        await Promise.all(spellPromiseArr);
      }
    );
    await Promise.all(arrayPromise);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("Unexpected error", err);
    }
  }
}

export async function getSpells() {
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/spells");
    const spellArr = Object.values(response.data.results).map(
      async (spell: any) => {
        const spellResponse = await axios.get(
          `https://www.dnd5eapi.co${spell.url}`
        );
        if (
          spellResponse.data.damage !== undefined &&
          spellResponse.data.damage.damage_type !== undefined
        ) {
          const spellPost = Spell.build({
            name: spellResponse.data.name,
            level: spellResponse.data.level,
            concentration: spellResponse.data.concentration,
            damageType: spellResponse.data.damage.damage_type.name,
          });
          spellPost.save();
        }
      }
    );
    await Promise.all(spellArr);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("Unexpected error", err);
    }
  }
}
