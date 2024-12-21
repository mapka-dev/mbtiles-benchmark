import { DatabaseSync } from "node:sqlite";
import { Client } from 'cassandra-driver';

const db = new DatabaseSync("../.data/10m_urban_areas.mbtiles", {open: true});
const getSqlQuery = "SELECT * FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?";

const client = new Client({
  contactPoints: ['localhost:9042'],
  localDataCenter: 'datacenter1',
  credentials: { 
    username: 'admin', 
    password: 'admin' 
  }
});
await client.connect();

await client.execute(`
  CREATE KEYSPACE IF NOT EXISTS test 
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
`);
console.log("Keyspace created");
await client.execute(`
  CREATE TABLE IF NOT EXISTS test.tiles (
   zoom_level int,
   tile_column int, 
   tile_row int, 
   tile_data blob,
   PRIMARY KEY (zoom_level, tile_column, tile_row)
   )
`)
console.log("Table created");

const queries = [];
for (let z = 0; z < 12; z++) {
  const maxDim  = 2**z

  for (let x = 0; x < maxDim; x++) {
    for (let y = 0; y < maxDim; y++) {
      queries.push([z, x, y]);
    }
  }
}

const options = {
  prepare: true,
}

for (const query of queries) {
  const result = db.prepare(getSqlQuery).get(...query)
  if(result?.tile_data) {
    const { 
      tile_data: tileData,
      zoom_level: zoomLevel,
      tile_column: tileColumn,
      tile_row: tileRow
    } = result;
    const params = [zoomLevel, tileColumn, tileRow, Buffer.from(tileData)];
    await client.execute(
      `INSERT INTO test.tiles (zoom_level, tile_column, tile_row, tile_data) VALUES (?, ?, ?, ?)`, 
      params,
      options
    )
  }
}
console.log("Loaded")