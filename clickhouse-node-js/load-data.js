import { createClient } from '@clickhouse/client';
import { createReadStream } from 'node:fs';

const client = createClient({
  url: 'http://localhost:8123',
});

await client.exec({
  query: `
    CREATE TABLE IF NOT EXISTS tiles
    (
      zoom_level UInt64,
      tile_column UInt64,
      tile_row UInt64,
      tile_data BLOB
    )
    ENGINE = MergeTree
    ORDER BY (zoom_level)
  `
})
await client.exec(`
  CREATE DATABASE sqlite_tiles ENGINE = SQLite('../.data/10m_urban_areas.mbtiles');
`)

await client.exec({
  query : `INSERT INTO tiles SELECT * FROM sqlite_tiles.tiles;`
})

// await client.insert({
//   table: 'tiles',
//   values: createReadStream('../data/10m_urban_areas.parquet'),
//   format: 'Parquet',
// })

console.log("Loaded")