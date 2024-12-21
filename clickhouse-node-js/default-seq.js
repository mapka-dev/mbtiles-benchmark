import { createClient } from '@clickhouse/client';

const client = createClient({
  url: 'http://localhost:8123',
});

const getSqlQuery = "SELECT tile_data FROM tiles WHERE zoom_level = {zoom_level:UInt64} AND tile_column = {tile_column:UInt64} AND tile_row = {tile_row:UInt64}";

const queries = [];

for (let z = 0; z < 12; z++) {
  const maxDim = 2 ** z;

  for (let x = 0; x < maxDim; x++) {
    for (let y = 0; y < maxDim; y++) {
      queries.push([z, x, y]);
    }
  }
}

const start = Date.now();
for (const query of queries) {
  const result = await client.query({
    query: getSqlQuery,
    query_params: {
      zoom_level: query[0],
      tile_column: query[1],
      tile_row: query[2],
    },
    format: 'JSONEachRow',
  });
}

const end = Date.now();

console.log(`Time taken: ${end - start}ms to execute ${queries.length} queries`);
console.log("Average Query Time: ", (end - start) / queries.length);

await client.close();