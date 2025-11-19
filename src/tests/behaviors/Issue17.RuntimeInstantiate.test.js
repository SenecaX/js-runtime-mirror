import { describe, expect, it, vi } from "vitest"
import { RuntimeEngine } from "../../../src/core/engine/RuntimeEngine.js"

describe("Issue17.RuntimeInstantiate", () => {

  it("TC1.CallsInstantiateGlobal", () => {
    const engine = new RuntimeEngine()
    engine.instantiator = {
      instantiateGlobal: vi.fn()
    }

    const ast = { body: [] }
    engine.instantiate(ast)

    expect(engine.instantiator.instantiateGlobal).toHaveBeenCalledWith(ast)
  })

  it("TC2.DoesNotEvaluateCode", () => {
    const engine = new RuntimeEngine()

    engine.instantiator = {
      instantiateGlobal: vi.fn()
    }

    // spy on internal evaluator → MUST NOT be called
    engine.evaluator = {
      traverseASTInOrder: vi.fn()
    }

    const ast = { body: [{ type: "Literal", value: 42 }] }
    engine.instantiate(ast)

    expect(engine.evaluator.traverseASTInOrder).not.toHaveBeenCalled()
  })

  it("TC3.DoesNotPushExecutionContext", () => {
    const engine = new RuntimeEngine()

    engine.instantiator = {
      instantiateGlobal: vi.fn()
    }

    engine.contexts = []
    engine.pushContext = vi.fn()
    engine.popContext = vi.fn()

    engine.instantiate({ body: [] })

    expect(engine.pushContext).not.toHaveBeenCalled()
    expect(engine.popContext).not.toHaveBeenCalled()
  })

  it("TC4.HandlesTopLevelLetOnly", () => {
    const engine = new RuntimeEngine()

    const captured = []
    engine.instantiator = {
      instantiateGlobal: (ast) => {
        for (const node of ast.body) {
          if (node.type === "VariableDeclaration" && node.kind === "let") {
            captured.push(node.id)
          }
        }
      }
    }

    const ast = {
      body: [
        { type: "VariableDeclaration", kind: "let", id: "x" },     // should be processed
        { type: "VariableDeclaration", kind: "var", id: "y" },     // ignored
        { type: "Literal", value: 123 }                            // ignored
      ]
    }

    engine.instantiate(ast)

    expect(captured).toEqual(["x"])
  })
})