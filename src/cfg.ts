let appId = 0
let workerId = 0

export const cfg = {
  lastId: 0n,
  lastTs: 0,
  counter: 0,
  minTs: Date.now(),

  get appId() {
    return appId
  },
  set appId(id: number) {
    // 4 bits, 0-15 variações (sql, front, back, mobile, etc)
    const bits = 0b1111
    appId = id < 1 ? Math.round(id * bits) : id % (bits + 1)
  },

  get workerId() {
    return workerId
  },
  set workerId(id) {
    // 11 bits 0-2047
    const bits = 0b11111111111
    workerId = id < 1 ? Math.round(id * bits) : id % (bits + 1)
  },
}
// defaults
cfg.appId = Math.random()
cfg.workerId = Math.random()
