module.exports = [{
  "name": "main",
  "type": "sqlite",
  "database": "./data/main.sql",
  "synchronize": true,
  "logging": false,
  "cache": true,
  "migrations": [
    "src/migration/**/*.ts"
  ],
  "subscribers": [
    "src/subscriber/**/*.ts"
  ],
  "cli": {
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  }
}, {
  "name": "cache",
  "type": "sqlite",
  "database": ":memory:",
  "synchronize": true,
  "logging": false,
  "cache": true,
  "migrations": [
    "src/migration/**/*.ts"
  ],
  "subscribers": [
   "src/subscriber/**/*.ts"
  ],
  "cli": {
   "migrationsDir": "src/migration",
   "subscribersDir": "src/subscriber"
  }
}];
