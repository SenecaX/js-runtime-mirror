import { CompletionRecord } from "../../../../src/core/execution/CompletionRecord"

describe("Issue01.CreateReturnCompletion", () => {

  it("TC1.CreatesReturnCompletion", () => {
    const rec = CompletionRecord.Return(123)
    expect(rec.type).toBe("return")
  })

  it("TC2.SetsValueCorrectly", () => {
    const rec = CompletionRecord.Return(999)
    expect(rec.value).toBe(999)
  })

  it("TC3.IsImmutable", () => {
    const rec = CompletionRecord.Return("x")
    expect(Object.isFrozen(rec)).toBe(true)
    expect(() => { rec.value = "nope" }).toThrow()
  })

  it("TC4.DoesNotModifyEnvironment", () => {
    const fakeEnv = { touched: false }
    CompletionRecord.Return(1)
    expect(fakeEnv.touched).toBe(false)
  })

  it("TC5.DoesNotEvaluateAnything", () => {
    let called = false
    const value = {
      get x() {
        called = true
        return 10
      }
    }
    const rec = CompletionRecord.Return(value)
    expect(called).toBe(false)
    expect(rec.value).toBe(value)
  })

})