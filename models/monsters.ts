import Sequelize, {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../index.js";

import Spell from "./spells.js";

export class Monster extends Model<
  InferAttributes<Monster, { omit: "spells" }>,
  InferCreationAttributes<Monster, { omit: "spells" }>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare name: string;
  declare challengeRating: number;
  declare armorClass: number;
  declare spells: string;

  declare getSpells: HasManyGetAssociationsMixin<Spell>; // Note the null assertions!
  declare addSpell: HasManyAddAssociationMixin<Spell, number>;
  declare addSpells: HasManyAddAssociationsMixin<Spell, number>;
  declare setSpells: HasManySetAssociationsMixin<Spell, number>;
  declare removeSpell: HasManyRemoveAssociationMixin<Spell, number>;
  declare removeSpells: HasManyRemoveAssociationsMixin<Spell, number>;
  declare hasSpell: HasManyHasAssociationMixin<Spell, number>;
  declare hasSpells: HasManyHasAssociationsMixin<Spell, number>;
  declare countSpells: HasManyCountAssociationsMixin;

  declare static associations: {
    spells: Association<Monster, Spell>;
  };
}
export function initializeMonster(sequelize: Sequelize.Sequelize): void {
  Monster.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      name: {
        type: Sequelize.STRING,
        // allowNull: false,
      },
      challengeRating: {
        type: Sequelize.FLOAT,
        // allowNull: false,
      },
      armorClass: {
        type: Sequelize.INTEGER,
        // allowNull: false,
      },
    },
    {
      sequelize,
    }
  );
}

export default Monster;

//outer & inner joins

//Select *
// From Monsters as m
// JOIN MonstersSpells AS ms ON m.Id = ms.MonsterId
// JOIN Spells AS s on ms.SpellId = s.Id
// WHERE m.CR > 3
// AND s.AttackType = "Acid"
