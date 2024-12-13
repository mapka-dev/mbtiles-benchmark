import Database from 'libsql';

const db = new Database("../data/10m_urban_areas.mbtiles", {
  readOnly: true,
  open: true,
});
db.exec("PRAGMA journal_mode = OFF;");
db.exec("PRAGMA synchronous = OFF;");

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
const start = Date.now();
for (const query of queries) {
  db.prepare(getSqlQuery).get(...query)
}
const end = Date.now();

console.log(`Time taken: ${end - start}ms to execute ${queries.length} queries`);
console.log("Average Query Time: ", (end - start) / queries.length);