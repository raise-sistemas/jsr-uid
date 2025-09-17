import { cfg } from "./cfg"

/**
 * Gera uma string id de 64 bits
 * (62 hoje devido ao timestamp estar em 0b1100x e irá chegar em 0b1111x)
 *
 * Remove os 2 bits mais significantes
 * dos 41 bits do timestamp, pois eles não mudarão.
 * Sobrando 39 bits para o timestamp
 * 11111001111111111111111111111110000011000|
 *   1111111111111111111111111111111111111111111111111111111111111111|
 * Dos 25 bits, são 4 bits(15) para o appId:1111|                    |
 *                       11 bits(2047) workerId:11111111111|         |
 *                                  10 bits (1024) counter:1111111111|
 */
export function uid(now = Date.now()) {
  if (now < cfg.minTs) {
    throw new Error(`A data ${new Date(now)} está no passado de ${new Date(cfg.minTs)}`)
  }
  // incrementa o contador ao gerar 2 ids no mesmo milisegundo.
  cfg.counter = now === cfg.lastTs ? cfg.counter + 1 : 0
  cfg.lastTs = now
  // o timestamp possui 41 bits, mas os 2 primeiros são sempre 0b11,
  // ignora eles pegando apenas os próximos 39 bits.
  const b39 = 0b111111111111111111111111111111111111111n
  const now39 = (BigInt(now) & b39) << 25n
  const appId = BigInt(cfg.appId << 21)
  const workerId = BigInt(cfg.workerId << 10)
  const counter = BigInt(cfg.counter)
  const id = (now39 | appId | workerId) + counter
  cfg.lastId = id

  return id.toString()
}
