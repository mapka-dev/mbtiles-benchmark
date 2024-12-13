# Node.js SQLite benchmark

Use node.js experimental API `https://nodejs.org/api/sqlite.html`

## Results

### Default sqlite config

```sh
node --experimental-sqlite ./default-seq.js

```

Time taken: 124794ms to execute 5592405 queries.
Average Query Time:  0.022314907450372425

### Optimized sqlite config

```sh
node --experimental-sqlite ./optimized-seq.js

```

Time taken: 123013ms to execute 5592405 queries.
Average Query Time:  0.021996439814355364
