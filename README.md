# MonsterSearch

MonsterSearch is a personal project built for educational purposes. Using the [D&D API](https://www.dnd5eapi.co/), you can filter for monsters who have spellcasting abilities based on their challenge rating and spell damage type. 

## Up and Running

1. Install Environment Dependencies, and ensure the databases are running.

- Node.js (https://nodejs.org/en/)
- PostgreSQL (https://www.postgresql.org/download/)

2. Install application dependencies with `npm install`

## Usage

Example Command.

```
ts-node index.ts --cr 2 --dt Radiant --csv csvFileExampleName -db

```
The -db command will populate the database. You will want to pass it as an argument the first time to initialize the database and afterwards it is not obligatory unless you want to re-populate the database. 
The data will be saved as a CSV file which you can name using the --csv arg.
Check out inputOptions.ts file to see what challenge ratings and damage types you can search.
