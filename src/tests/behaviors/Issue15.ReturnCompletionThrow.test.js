import { describe, it, expect } from "vitest"
import { CompletionRecord } from "../../../src/core/execution/CompletionRecord.js"

describe("Issue15.ReturnCompletionThrow", () => {

  it("TC1.CreatesThrowCompletion", () => {
    const c = CompletionRecord.Throw(new Error("boom"))
    expect(c.type).toBe("throw")
  })

  it("TC2.SetsErrorCorrectly", () => {
    const err = new Error("boom")
    const c = CompletionRecord.Throw(err)
    expect(c.value).toBe(err)
  })

  it("TC3.DoesNotModifyEnvironment", () => {
    const env = { x: 1 }
    const snapshot = JSON.stringify(env)

    const c = CompletionRecord.Throw("err")
    expect(c.type).toBe("throw")
    expect(c.value).toBe("err")

    // env must not change at all
    expect(JSON.stringify(env)).toBe(snapshot)
  })

})