import { DuckDBInstance } from '@duckdb/node-api';

// Install SQLite extension
const install = await DuckDBInstance.create();
const installConnection = await install.connect();
await installConnection.run("INSTALL sqlite;");

// Open database and create connection
const path = "../.data/10m_urban_areas.mbtiles"
const db = await DuckDBInstance.create(path, {
  threads: 4,
});
const connection = await db.connect();

await connection.run(`
  COPY (SELECT * FROM tiles) TO '10m_urban_areas.parquet' (FORMAT PARQUET);
`);
