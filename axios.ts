import axios from "axios";

import Monster from './models/monsters.js';
import Spell from "./models/spells.js";

export async function getMonster() {
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/monsters");
    Object.values(response.data.results).forEach(async (monster: any) => {
      const monsterResponse = await axios.get(
        `https://www.dnd5eapi.co${monster.url}`
      );
      const specAbilites = monsterResponse.data.special_abilities;
      var spellNames = [];
      specAbilites.forEach((ability) => {
        if (ability.spellcasting !== undefined) {
          spellNames = ability.spellcasting.spells.map((name) => name.name);
        }
      });

      let monsterPost = Monster.build({
        name: monsterResponse.data.name,
        challengeRating: monsterResponse.data.challenge_rating,
        armorClass: monsterResponse.data.armor_class,
      });

      monsterPost.save();
    });
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
    Object.values(response.data.results).forEach(async (spell: any) => {
      const spellResponse = await axios.get(
        `https://www.dnd5eapi.co${spell.url}`
      );
      if (
        spellResponse.data.damage !== undefined &&
        spellResponse.data.damage.damage_type !== undefined
      ) {
        console.log(spellResponse.data);
        const spellPost = Spell.build({
          name: spellResponse.data.name,
          level: spellResponse.data.level,
          concentration: spellResponse.data.concentration,
          damageType: spellResponse.data.damage.damage_type.name,
        });
        spellPost.save();
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("Unexpected error", err);
    }
  }
}

// const specAbilites = data.special_abilites
// var spellNames = [];
// specAbilites.forEach(ability) => {
// if(ability.spellcastinge !== undefined ){

//}
//}

// look up map function
