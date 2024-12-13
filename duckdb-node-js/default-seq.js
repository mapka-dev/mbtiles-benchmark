import { DuckDBInstance } from '@duckdb/node-api';


const db = await DuckDBInstance.create("../data/10m_urban_areas.mbtiles");
const connection = db.connect();

const getSqlQuery = "SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?";

const queries = [];

for (let z = 0; z < 12; z++) {
  const maxDim  = 2**z

  for (let x = 0; x < maxDim; x++) {
    for (let y = 0; y < maxDim; y++) {
      queries.push([z, x, y]);
    }
  }
}
const prepared = connection.prepare(getSqlQuery);

const start = Date.now();
for (const query of queries) {
  prepared.bindInteger(2, query[0]);
  prepared.bindInteger(3, query[1]);
  prepared.bindInteger(4, query[2]);
  await prepared.run();
}
const end = Date.now();

console.log(`Time taken: ${end - start}ms to execute ${queries.length} queries`);
console.log("Average Query Time: ", (end - start) / queries.length);