import Sequelize, {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'

export class Spells extends Model<
InferAttributes<Spells>,
InferCreationAttributes<Spells>
> {
  declare id: CreationOptional<number>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare name: string
  declare level: number
  declare concentration: boolean
  declare damageType: string

  // declare getProjects: HasManyGetAssociationsMixin<Spell>; // Note the null assertions!
  // declare addProject: HasManyAddAssociationMixin<Spell, number>;
  // declare addProjects: HasManyAddAssociationsMixin<Spell, number>;
  // declare setProjects: HasManySetAssociationsMixin<Spell, number>;
  // declare removeProject: HasManyRemoveAssociationMixin<Spell, number>;
  // declare removeProjects: HasManyRemoveAssociationsMixin<Spell, number>;
  // declare hasProject: HasManyHasAssociationMixin<Spell, number>;
  // declare hasProjects: HasManyHasAssociationsMixin<Spell, number>;
  // declare countProjects: HasManyCountAssociationsMixin;
}
export function initializeSpells (sequelize: Sequelize.Sequelize): void {
  Spells.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      name: {
        type: Sequelize.STRING
        // allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER
        // allowNull: false,
      },
      concentration: {
        type: Sequelize.BOOLEAN
        // allowNull: false,
      },
      damageType: {
        type: Sequelize.STRING
        // allowNull: false,
      }
    },
    {
      sequelize
    }
  )
}

export default Spells
