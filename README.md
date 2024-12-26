# Benchmarks mbtiles

## Results sequential queries

Sequential queries are not fully useful as in real life I need to build worker threads to parallelize the queries.

- SQLite Node.js experimental API

  Default config:
  Time taken: 124794ms to execute 5592405 queries.
  Average Query Time:  0.022 ms

  Optimized config:
  Time taken: 123013ms to execute 5592405 queries.
  Average Query Time:  0.021 ms

- LibSQL Node.js

  Default config:
  Time taken: 156265ms to execute 5592405 queries
  Average Query Time:  0.027 ms
  
  Optimized config:
  Time taken: 157906ms to execute 5592405 queries
  Average Query Time:  0.028 ms

- DuckDB Node.js SQLite extension

  Default config:
  Time taken: 238.997ms per query.

- Cassandra Node.js

  Default config:
  Time taken: 1043329ms to execute 5592405 queries
  Average Query Time:  0.186ms per query.

- Clickhouse Node.js

  Default config:
  Time taken: 36085ms to execute 100 queries
  Average Query Time:  360.85ms per query.

## Issues

- DuckDB: slow and manual install of SQLite extension: <https://github.com/duckdb/duckdb-node-neo/issues/62>

- libsql: memory leaks over large number of queries <https://github.com/tursodatabase/libsql-js/issues/153>
