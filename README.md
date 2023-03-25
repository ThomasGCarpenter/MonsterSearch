# MonsterSearch

MonsterSearch is a personal project built for learning purposes. Using the [D&D API](https://www.dnd5eapi.co/), you can search for monsters who have spellcasting abilities based on their challenge rating and spell damage type.

## Up and Running

1. Install Environment Dependencies, and ensure the databases are running.

- Node.js (https://nodejs.org/en/)
- PostgreSQL (https://www.postgresql.org/download/)

2. Install application dependencies with `npm install`

## Usage

Example Command.

```
ts-node index.ts --challenge-rating 2 --damage-type Radiant -db

```
The data will be saved as a CSV file.
Check out inputOptions.ts file to see what challenge ratings and damage types you can search.
