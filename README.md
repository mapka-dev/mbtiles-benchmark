# Benchmarks mbtiles

## Results sequential queries

Sequential queries are not fully useful as in real life I need to build worker threads to parallelize the queries.

- SQLite Node.js experimental API

  Default config:
  Time taken: 124794ms to execute 5592405 queries.
  Average Query Time:  0.022314907450372425 ms

  Optimized config:
  Time taken: 123013ms to execute 5592405 queries.
  Average Query Time:  0.021996439814355364 ms

- LibSQL Node.js

  Default config:
  Time taken: 156265ms to execute 5592405 queries
  Average Query Time:  0.027942361112973758 ms
  
  Optimized config:
  Time taken: 157906ms to execute 5592405 queries
  Average Query Time:  0.028235794796693015 ms

- DuckDB Node.js SQLite extension

  Default config:
  Time taken: 238.997ms per query.

- Cassandra Node.js

  Default config:
  Time taken: 1043329ms to execute 5592405 queries
  Average Query Time:  0.18656177440653887

## Issues

- DuckDB: slow and manual install of SQLite extension: <https://github.com/duckdb/duckdb-node-neo/issues/62>

- libsql: memory leaks over large number of queries <https://github.com/tursodatabase/libsql-js/issues/153>
