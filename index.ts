import express from "express";
import pkg from "body-parser";
import { initializeSequelize } from "./database";

const { json, urlencoded } = pkg;

const app = express();
const port = 3000;

app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

let sequelize = await initializeSequelize();

export default sequelize;
