import { expect, test } from "bun:test"
import { cfg } from "./cfg"
import { extract } from "./extract"
import { uid } from "./uid"

test("uid", () => {
  const now = Date.now()
  cfg.appId = 0b1111 // 4 bits
  cfg.workerId = 0b11111111111 // 11 bits
  const id = uid(now)
  const parts = extract(id)
  expect(parts.appId).toBe(cfg.appId)
  expect(parts.workerId).toBe(cfg.workerId)
  expect(parts.counter).toBe(0)
  expect(parts.timestamp).toBe(now)
})
