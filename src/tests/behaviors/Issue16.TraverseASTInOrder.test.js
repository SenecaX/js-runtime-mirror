// src/tests/behaviors/Issue16.TraverseASTInOrder.test.js
import { describe, it, expect } from "vitest"
import { Evaluator } from "../../core/evaluation/Evaluator.js"

describe("Issue16.TraverseASTInOrder", () => {

  it("TC1.EvaluatesNodesSequentially", () => {
    const evals = []
    const evaluator = new Evaluator(null)

    evaluator.evaluateLiteral = (node) => {
      evals.push(node.value)
      return { type: "normal", value: node.value }
    }

    const body = [
      { type: "Literal", value: 1 },
      { type: "Literal", value: 2 },
      { type: "Literal", value: 3 }
    ]

    const result = evaluator.traverseASTInOrder(body)

    expect(evals).toEqual([1, 2, 3])
    expect(result.value).toBe(3)
  })

  it("TC2.StopsOnThrow", () => {
    const evaluator = new Evaluator(null)

    evaluator.evaluateLiteral = (node) => {
      if (node.value === "boom") {
        return { type: "throw", value: "err" }
      }
      return { type: "normal", value: node.value }
    }

    const body = [
      { type: "Literal", value: 1 },
      { type: "Literal", value: "boom" },
      { type: "Literal", value: 99 }
    ]

    const result = evaluator.traverseASTInOrder(body)

    expect(result.type).toBe("throw")
    expect(result.value).toBe("err")
  })

  it("TC3.ReturnsLastNormalCompletion", () => {
    const evaluator = new Evaluator(null)

    evaluator.evaluateLiteral = (node) => {
      return { type: "normal", value: node.value }
    }

    const body = [
      { type: "Literal", value: 10 },
      { type: "Literal", value: 20 }
    ]

    const result = evaluator.traverseASTInOrder(body)

    expect(result.type).toBe("normal")
    expect(result.value).toBe(20)
  })

  it("TC4.ReturnsNormalUndefinedIfEmpty", () => {
    const evaluator = new Evaluator(null)

    const result = evaluator.traverseASTInOrder([])

    expect(result.type).toBe("normal")
    expect(result.value).toBe(undefined)
  })
})