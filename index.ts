#! /usr/bin/env node

import { initializeSequelize } from './database.js';
import { getSpells, populateMonsterTable } from './axios.js';
import Monster from './models/monsters.js';
import Spell from './models/spells.js';
import { Op } from 'sequelize';
import { challengeRatingOptions, damageTypeOptions } from './inputOptions.js';
import { program } from '@commander-js/extra-typings';
import * as fs from 'fs';

interface Options {
  challengeRating: number;
  damageType: string;
  csvFileName: string;
  Db: boolean;
}

interface CsvFile {
  name: string;
  challengeRating: number;
  armorClass: number;
  Spells: string[];
}

program
  .option('--challenge-rating <number>')
  .option('--damage-type <type>')
  .option('--csv-file-name <string>')
  .option('-db', 'refresh database', false)
  .description(
    `Query challenge rating by entering number 0.125, 0.5, 0.175, or whole numbers 1 - 30. Then enter spell damage type.
    `
  )
  .parse();

const options = program.opts() as Options;
const damageType = options.damageType;

const damageTypeCapitalized =
  damageType.charAt(0).toUpperCase() + damageType.slice(1);

isDamageTypeValid(damageTypeCapitalized);
isChallengeRatingValid(options.challengeRating);

void (async function queryFunc() {
  try {
    if (options.Db) {
      await initializeSequelize(true);
    }
    await getSpells();
    await populateMonsterTable();

    const results = await Monster.findAll({
      where: {
        challengeRating: {
          [Op.gt]: `${options.challengeRating}`,
        },
      },
      include: {
        model: Spell,
        where: {
          damageType: `${damageTypeCapitalized}`,
        },
      },
    });
    const csv: CsvFile[] = [];
    const filteredResults = JSON.stringify(results, null, 2);
    JSON.parse(filteredResults).forEach((element) => {
      const spellArray = element.Spells.map((element) => {
        return element.name;
      });
      const objectToPush = {
        name: element.name,
        challengeRating: element.challengeRating,
        armorClass: element.armorClass,
        Spells: spellArray,
      };
      csv.push(objectToPush);
    });
    const convertedToCsv = toCsv(pivot(csv));
    fs.appendFileSync(`./${options.csvFileName}.csv`, convertedToCsv);

    return csv;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
})();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function pivot(arr) {
  var mp = new Map();

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function setValue(a, path, val) {
    if (Object(val) !== val) {
      // primitive value
      var pathStr = path.join('.');
      var i = (mp.has(pathStr) ? mp : mp.set(pathStr, mp.size)).get(pathStr);
      a[i] = val;
    } else {
      for (var key in val) {
        setValue(a, key == '0' ? path : path.concat(key), val[key]);
      }
    }
    return a;
  }

  var result = arr.map((obj) => setValue([], [], obj));
  return [[...mp.keys()], ...result];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function toCsv(arr) {
  return arr
    .map((row) =>
      row.map((val) => (isNaN(val) ? JSON.stringify(val) : +val)).join(',')
    )
    .join('\n');
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function isDamageTypeValid(damageType) {
  if (Array(damageType).length === 0) {
    throw new Error('Please input a damage type');
  }
  const checkDamageTypeOptionsArray = damageTypeOptions.find(
    (element) => element === String(damageType)
  );
  if (checkDamageTypeOptionsArray == null) {
    throw new Error('enter help to see list of options');
  }
  return true;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function isChallengeRatingValid(challengeRating) {
  if (isNaN(challengeRating)) {
    throw new Error('Please input a number');
  }
  const found = challengeRatingOptions.find(
    (element) => element === Number(challengeRating)
  );
  if (found == null) {
    throw new Error('Number can be 0.125, 0.5, 0.175, 1 - 30');
  }
  return true;
}

// let user specify output folder
// let user specify file name
