import { Client } from 'cassandra-driver';
import { Queue } from 'moderndash';

const client = new Client({
  contactPoints: ['localhost:9042'],
  localDataCenter: 'datacenter1',
  credentials: { 
    username: 'admin', 
    password: 'admin' 
  }
});
await client.connect();
const getSqlQuery = "SELECT tile_data FROM test.tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?";

const queries = [];

for (let z = 0; z < 12; z++) {
  const maxDim  = 2**z

  for (let x = 0; x < maxDim; x++) {
    for (let y = 0; y < maxDim; y++) {
      queries.push([z, x, y]);
    }
  }
}const options = {
  prepare: true,
}
const queue = new Queue(20);

const start = Date.now();
for (const query of queries) {
  queue.add(() => client.execute(getSqlQuery, query, options))
}
await queue.done();
const end = Date.now();


console.log(`Time taken: ${end - start}ms to execute ${queries.length} queries`);
console.log("Average Query Time: ", (end - start) / queries.length);