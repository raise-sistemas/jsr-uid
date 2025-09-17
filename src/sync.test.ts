import { expect, test } from "bun:test"
import { cfg } from "./cfg"
import { sync } from "./sync"

test("sync", async () => {
  expect(cfg.minTs <= Date.now())
  expect(cfg.minTs > Date.now() - 1000)
  await sync()
  expect(cfg.minTs <= Date.now())
  expect(cfg.minTs > Date.now() - 1000)
})
