import { Evaluator } from "../../core/evaluation/Evaluator.js"
import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"
import { LexicalEnvironment } from "../../core/environment/LexicalEnvironment.js"

describe("Issue11.EvaluateIdentifier", () => {

  it("TC1.CallsResolveIdentifier", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 10)

    const env = new LexicalEnvironment(rec, null)

    // spy on ResolveIdentifier
    env.ResolveIdentifier = vi.fn(env.ResolveIdentifier.bind(env))

    const ev = new Evaluator(env)
    ev.evaluateIdentifier({ type: "Identifier", name: "x" })

    expect(env.ResolveIdentifier).toHaveBeenCalledWith("x")
  })

  it("TC2.CallsGetBindingValue", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 99)

    // spy on GetBindingValue
    rec.GetBindingValue = vi.fn(rec.GetBindingValue.bind(rec))

    const env = new LexicalEnvironment(rec, null)
    const ev = new Evaluator(env)

    ev.evaluateIdentifier({ type: "Identifier", name: "x" })

    expect(rec.GetBindingValue).toHaveBeenCalledWith("x")
  })

  it("TC3.ReturnsNormalCompletionWithValue", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 777)

    const env = new LexicalEnvironment(rec, null)
    const ev = new Evaluator(env)

    const result = ev.evaluateIdentifier({ type: "Identifier", name: "x" })

    expect(result.type).toBe("normal")
    expect(result.value).toBe(777)
  })

  it("TC4.ReturnsThrowOnTDZ", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("z")      // created but NOT initialized

    const env = new LexicalEnvironment(rec, null)
    const ev = new Evaluator(env)

    const result = ev.evaluateIdentifier({ type: "Identifier", name: "x" })

    expect(result.type).toBe("throw")
  })

  it("TC5.ReturnsThrowOnUnresolvable", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)
    const ev = new Evaluator(env)

    const result = ev.evaluateIdentifier({ type: "Identifier", name: "missingVar" })

    expect(result.type).toBe("throw")
  })
})
