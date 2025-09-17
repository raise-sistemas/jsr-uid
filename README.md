# @ei/uid

[![JSR](https://jsr.io/badges/@ei/uid)](https://jsr.io/@ei/uid)

> [!TIP]
> **Mantenedor**: @neves

64 bits Universally Unique Lexicographically Sortable Identifier

Alternativa ao https://github.com/ulid/javascript para suportar ids como inteiro de 64 bits, ao invés de 128 bits.

## Instalação

```
bunx jsr add @ei/uid
```

## Utilização

```typescript
import { uid } from "@ei/uid"
// para gerar um novo id é só chamar essa função
console.log(uid())
```

## Features

- 64 bits salvo como inteiro no banco, mas string no javascript/json
- Monotonic sort order (correctly detects and handles the same millisecond)
- sync, não precisa utilizar await
- workerId, para separar ids gerados em instâncias diferentes, evitando colisões em sistemas distribuídos
- Versão para utilizar direto no MySql

## MySql UID

Para gerar UID direto no banco MySql, utilizar essa fórmula:
```sql
SELECT CAST(UNIX_TIMESTAMP(NOW(6)) * 1000000 << 15 | (UUID_SHORT() & 0xFFFFF) AS UNSIGNED)
```
Os 2 bits da esquerda são sempre 11, por isso o shift de 15 ao invés de 13, remove ele.

### Descrição do funcionamento

```sql
SELECT
  UNIX_TIMESTAMP()TS,
  UNIX_TIMESTAMP(NOW(6))TS6,
  (UNIX_TIMESTAMP(NOW(6)) * 1000000)TSF,
  CAST(UNIX_TIMESTAMP(NOW(6)) * 1000000 AS UNSIGNED)INT64,
  BIN(CAST(UNIX_TIMESTAMP(NOW(6)) * 1000000 AS UNSIGNED))BITS,
  LENGTH(BIN(CAST(UNIX_TIMESTAMP(NOW(6)) * 1000000 AS UNSIGNED)))LEN; -- 51 bits
TS          TS6                TSF                      INT64             BITS                                                 LEN
----------  -----------------  -----------------------  ----------------  ---------------------------------------------------  ---
1758137204  1758137204.555584  1758137204555584.000000  1758137204555584  110001111110000010000110111100010110011111101000000  51

SELECT
  BIN(CAST(UNIX_TIMESTAMP(NOW(6)) * 1000000 AS UNSIGNED))
UNION ALL
SELECT
  BIN(CAST(UNIX_TIMESTAMP(NOW(6)) * 1000000 << 13 AS UNSIGNED)); -- 64 bits
BIN(cast(UNIX_TIMESTAMP(now(6)) * 1000000 as UNSIGNED))
----------------------------------------------------------------
110001111110000010000111011010001110111111001100101
1100011111100000100001110110100011101111110011001010000000000000 (13 bits zero)

SELECT UUID_SHORT(), BIN(UUID_SHORT())BITS, LENGTH(BIN(UUID_SHORT()))LEN;
UUID_SHORT()          BITS                                                              LEN
--------------------  ----------------------------------------------------------------  ---
15665975995406483616  1101100101101000101110100010101001111010000000000000000010100001  64
```

### UUID_SHORT() 64 bits = 8 + 32 + 24

- Server ID (8 bits): An ID from 0 to 255, taken from the MySQL server_id system variable.
- Startup time (32 bits, approximately): The number of seconds since the server was last started.
  This is a relatively static value for a running server.
- Incrementing counter (24 bits):
  A value that increases with each invocation of UUID_SHORT(), resetting on server restart.

Fazendo UUID_SHORT() & 0xFFFFF (20 bits) retorna um número até 1.048.575,
como durante um insert, o timestamp fica congelado, então é possível criar no máximo 1 milhão de registros
de uma vez sem dar conflito de id.
Aumentando para 0xFFFFFF (24 bits) já sobe para 16.777.215.
