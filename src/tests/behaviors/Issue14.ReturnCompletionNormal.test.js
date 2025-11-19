import { describe, it, expect } from "vitest"
import { CompletionRecord } from "../../core/execution/CompletionRecord.js"

describe("Issue14.ReturnCompletionNormal", () => {

  it("TC1.CreatesNormalCompletion", () => {
    const c = CompletionRecord.Normal(99)
    expect(c.type).toBe("normal")
  })

  it("TC2.SetsValueCorrectly", () => {
    const c = CompletionRecord.Normal("ok")
    expect(c.value).toBe("ok")
  })

  it("TC3.IsImmutable", () => {
    const c = CompletionRecord.Normal(123)

    // attempt mutation
    try { c.type = "mutated" } catch {}
    try { c.value = "mutated" } catch {}

    expect(c.type).toBe("normal")
    expect(c.value).toBe(123)
  })

})