import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

let devDB = "";
if (process.env.DEV_DATABASE_URL !== undefined) {
  devDB = process.env.DEV_DATABASE_URL;
}

export async function initializeSequelize(): Promise<Sequelize> {
  let sequelize: Sequelize;
  //this if for future use with Heroku, currently only support devdb
  if (process.env.DATABASE_URL !== undefined) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  } else {
    sequelize = new Sequelize(devDB, { dialect: "postgres" });
  }

  await sequelize.authenticate();
  console.log("Connection has been established successfully.");

  return sequelize;
}
