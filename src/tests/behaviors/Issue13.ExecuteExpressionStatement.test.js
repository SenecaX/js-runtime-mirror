// src/tests/behaviors/Issue13.ExecuteExpressionStatement.test.js
import { describe, it, expect, beforeEach } from "vitest"
import { Evaluator } from "../../core/evaluation/Evaluator.js"
import { LexicalEnvironment } from "../../core/environment/LexicalEnvironment.js"
import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"

describe("Issue13.ExecuteExpressionStatement", () => {
  let env, evaluator

  beforeEach(() => {
    env = new LexicalEnvironment(new DeclarativeEnvironmentRecord(), null)
    evaluator = new Evaluator(env)
  })

  it("TC1.EvaluatesExpression", () => {
    const node = {
      type: "ExpressionStatement",
      expression: { type: "Literal", value: 42 }
    }

    const result = evaluator.executeExpressionStatement(node)
    expect(result.type).toBe("normal")
    expect(result.value).toBe(42)
  })

  it("TC2.ReturnsCompletionUnmodified", () => {
    const node = {
      type: "ExpressionStatement",
      expression: { type: "Literal", value: "ok" }
    }

    const completion = evaluator.executeExpressionStatement(node)
    expect(completion).toEqual({ type: "normal", value: "ok" })
  })

  it("TC3.DoesNotModifyEnvironment", () => {
    const before = { ...env.environmentRecord.bindings }

    const node = {
      type: "ExpressionStatement",
      expression: { type: "Literal", value: 1 }
    }

    evaluator.executeExpressionStatement(node)

    console.log("test")
    const after = env.environmentRecord.bindings
    expect(after).toEqual(before)
  })

  it("TC4.DoesNotWrapValue", () => {
    const node = {
      type: "ExpressionStatement",
      expression: { type: "Literal", value: 99 }
    }

    const result = evaluator.executeExpressionStatement(node)
    // MUST NOT wrap like: { type: "normal", value: { type: "normal", value: 99 } }
    expect(result.value).toBe(99)
  })
})
