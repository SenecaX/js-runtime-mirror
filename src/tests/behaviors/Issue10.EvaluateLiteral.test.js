import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"
import { LexicalEnvironment } from "../../core/environment/LexicalEnvironment.js"
import { Evaluator } from "../../core/evaluation/Evaluator.js"

describe("Issue10.EvaluateLiteral", () => {

  it("TC1.ReturnsNormalCompletion", () => {
    const ev = new Evaluator()

    const result = ev.evaluateLiteral({ type: "Literal", value: 123 })
    expect(result.type).toBe("normal")
  })

  it("TC2.ValueEqualsNodeValue", () => {
    const ev = new Evaluator()
    const result = ev.evaluateLiteral({ type: "Literal", value: "hello" })
    expect(result.value).toBe("hello")
  })

  it("TC3.DoesNotModifyEnvironment", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)

    const snapshot = JSON.stringify(rec.bindings)

    const ev = new Evaluator(env)
    ev.evaluateLiteral({ type: "Literal", value: 999 })

    expect(JSON.stringify(rec.bindings)).toBe(snapshot)
  })

  it("TC4.DoesNotThrowUnlessMalformed", () => {
    const ev = new Evaluator()

    // valid → must not throw
    expect(() =>
      ev.evaluateLiteral({ type: "Literal", value: true })
    ).not.toThrow()

    // invalid → must throw
    expect(() =>
      ev.evaluateLiteral({ type: "Identifier", name: "x" })
    ).toThrow()

    expect(() =>
      ev.evaluateLiteral({ type: "Literal" }) // missing value
    ).toThrow()
  })
})
