import { createClient } from '@clickhouse/client';
import { createReadStream } from 'node:fs';

const client = createClient({
  url: 'http://localhost:8123',
});

await client.exec({
  query: `
    CREATE TABLE IF NOT EXISTS tiles
    (
      zoom_level UInt8,
      tile_column UInt16,
      tile_row UInt16,
      tile_data String
    )
    ENGINE = MergeTree
    ORDER BY (zoom_level, tile_column, tile_row)
    PARTITION BY zoom_level
  `
})
await client.insert({
  table: 'tiles',
  values: createReadStream('../.data/10m_urban_areas.parquet'),
  format: 'Parquet',
})

console.log("Loaded")