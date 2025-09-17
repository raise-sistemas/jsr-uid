# @ei/uid

64 bits Universally Unique Lexicographically Sortable Identifier

Alternativa ao https://github.com/ulid/javascript para suportar ids como inteiro de 64 bits, ao invés de 128 bits.

## Features

- 64 bits salvo como inteiro no banco, mas string no javascript/json
- Monotonic sort order (correctly detects and handles the same millisecond)
- sync, não precisa utilizar await
- workerId, para separar ids gerados em instâncias diferentes, evitando colisões em sistemas distribuídos
-
