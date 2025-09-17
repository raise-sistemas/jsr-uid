type Parts = {
  timestamp: number,
  appId: number,
  workerId: number,
  counter: number,
}
/**
 *
 * @param uid string
 */
export function extract(uid: string): Parts {
  const bint = BigInt(uid)
  const s = bint.toString(2).padStart(64, "0")
  const rx = /(\d{39})(\d{4})(\d{11})(\d{10})/g
  const [, t, a, w, c] = Array.from(rx.exec(s) ?? [])
  // devolve os 2 primeiros bits
  const timestamp = Number.parseInt(`11${t}`, 2)
  const appId = Number.parseInt(a, 2)
  const workerId = Number.parseInt(w, 2)
  const counter = Number.parseInt(c, 2)

  return {
    timestamp,
    appId,
    workerId,
    counter,
  }
}
