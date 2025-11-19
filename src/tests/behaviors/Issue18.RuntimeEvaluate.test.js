import { describe, it, expect, vi } from "vitest"
import { RuntimeEngine } from "../../../src/core/engine/RuntimeEngine.js"

describe("Issue18.RuntimeEvaluate", () => {

  it("TC1.EvaluatesNodesInOrder", () => {
    const engine = new RuntimeEngine()

    engine.evaluator = {
      traverseASTInOrder: vi.fn().mockReturnValue({ type: "normal", value: 42 })
    }

    const ast = { body: [1, 2, 3] }

    const result = engine.evaluate(ast)

    expect(engine.evaluator.traverseASTInOrder).toHaveBeenCalledWith(ast.body)
    expect(result.value).toBe(42)
  })

  it("TC2.ReturnsFinalCompletion", () => {
    const engine = new RuntimeEngine()

    engine.evaluator = {
      traverseASTInOrder: () => ({ type: "normal", value: "final" })
    }

    const ast = { body: [] }

    const result = engine.evaluate(ast)

    expect(result).toEqual({ type: "normal", value: "final" })
  })

  it("TC3.DoesNotReinstantiate", () => {
    const engine = new RuntimeEngine()

    engine.instantiator = {
      instantiateGlobal: vi.fn()   // must NOT be called
    }

    engine.evaluator = {
      traverseASTInOrder: () => ({ type: "normal", value: 10 })
    }

    const ast = { body: [] }

    engine.evaluate(ast)

    expect(engine.instantiator.instantiateGlobal).not.toHaveBeenCalled()
  })

  it("TC4.DoesNotCreateNewExecutionContexts", () => {
    const engine = new RuntimeEngine()

    engine.contexts = []
    engine.pushExecutionContext = vi.fn()
    engine.popExecutionContext = vi.fn()

    engine.evaluator = {
      traverseASTInOrder: () => ({ type: "normal", value: 0 })
    }

    const ast = { body: [] }

    engine.evaluate(ast)

    expect(engine.pushExecutionContext).not.toHaveBeenCalled()
    expect(engine.popExecutionContext).not.toHaveBeenCalled()
  })

})