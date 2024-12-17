import { DuckDBInstance } from '@duckdb/node-api';

// Install SQLite extension
const install = await DuckDBInstance.create();
const installConnection = await install.connect();
await installConnection.run("INSTALL sqlite;");

// Open database and create connection
const path = "../data/10m_urban_areas.mbtiles"
const db = await DuckDBInstance.create(path, {
  threads: 4,
});
const connection = await db.connect();

// Create queries parameters
const queries = [];
for (let z = 0; z < 12; z++) {
  const maxDim  = 2**z

  for (let x = 0; x < maxDim; x++) {
    for (let y = 0; y < maxDim; y++) {
      queries.push([z, x, y]);
    }
  }
}  

const prepared = await connection.prepare(
  "SELECT tile_data FROM tiles WHERE zoom_level = $1 AND tile_column = $2 AND tile_row = $3"
);

const start = Date.now();
for (const query of queries) {
  console.time(query);
  prepared.bindInteger(1, query[0]);
  prepared.bindInteger(2, query[1]);
  prepared.bindInteger(3, query[2]);

  await prepared.run();
  console.timeEnd(query);
}
const end = Date.now();

console.log(`Time taken: ${end - start}ms to execute ${queries.length} queries`);
console.log("Average Query Time: ", (end - start) / queries.length);