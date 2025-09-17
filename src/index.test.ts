import { expect, test } from "bun:test"
import * as mod from "./index"

test("mod exports all symbols", () => {
  expect(mod.min64).toBeDefined()
  expect(mod.max64).toBeDefined()
  expect(mod.minTimestamp).toBeDefined()
  expect(mod.maxTimestamp).toBeDefined()
  expect(mod.cfg).toBeDefined()
  expect(mod.sync).toBeDefined()
  expect(mod.uid).toBeDefined()
  expect(mod.extract).toBeDefined()
})
