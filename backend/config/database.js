const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'hammondbytes-postgres.flycast'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'hammondbytes'),
      user: env('DATABASE_USERNAME', 'hammondbytes'),
      password: env('DATABASE_PASSWORD'),
      ssl: {
        rejectUnauthorized: false,
        ca: env('DATABASE_CA', undefined),
        key: env('DATABASE_KEY', undefined),
        cert: env('DATABASE_CERT', undefined)
      },
      pool: {
        min: 0,
        max: 5
      }
    },
    debug: false,
  },
});
