const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  const connections = {
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
    postgres: {
      connection: {
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME'),
        user: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
    },
  };
};
