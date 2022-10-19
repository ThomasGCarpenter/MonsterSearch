import axios from "axios";
import { resourceLimits } from "worker_threads";

async function getMonster() {
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/monsters");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

getMonster();

//****************/
// Write Out Step by Step//

//1) Store Monsters and Spells in DB

// response.results.forEach(
//    const = monsterResponse await axiost.get(url)
//    response(extract fields into fresh object) let = curretMonster = new Monster(monsterResponse.AC, monsterResponse.CR) **LOOK UP CONSTRUCTORS IN TYPESCRIPT
//    currentMonster.save()
//)
