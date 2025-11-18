import { Evaluator } from "../../core/evaluation/Evaluator.js"
import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"
import { LexicalEnvironment } from "../../core/environment/LexicalEnvironment.js"

describe("Issue12.ExecuteVariableStatement", () => {

  it("TC1.EvaluatesInitializerIfPresent", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)

    const ev = new Evaluator(env)

    // Spy on evaluateLiteral
    ev.evaluateLiteral = (node) => {
      if (node.type !== "Literal") throw "Wrong call"
      return { type: "normal", value: node.value }
    }

    rec.CreateMutableBinding("x")


    const node = {
      type: "VariableDeclaration",
      declarations: [
        {
          id: { name: "x" },
          init: { type: "Literal", value: 10 }
        }
      ]
    }
    ev.executeVariableStatement(node)

    expect(rec.bindings.x.value).toBe(10)
  })

  it("TC2.InitializesBindingWithValue", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)
    const ev = new Evaluator(env)

    rec.CreateMutableBinding("x")

    const node = {
      type: "VariableDeclaration",
      declarations: [
        {
          id: { name: "x" },
          init: { type: "Literal", value: 42 }
        }
      ]
    }

    ev.evaluateLiteral = (n) => ({ type: "normal", value: n.value })

    ev.executeVariableStatement(node)

    expect(rec.bindings.x.value).toBe(42)
    expect(rec.bindings.x.initialized).toBe(true)
  })

  it("TC3.InitializesBindingUndefinedIfNoInit", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)
    const ev = new Evaluator(env)

    rec.CreateMutableBinding("y")


    const node = {
      type: "VariableDeclaration",
      declarations: [
        {
          id: { name: "y" },
          init: null
        }
      ]
    }

    ev.executeVariableStatement(node)

    console.log("rec.bindings", rec.bindings)

    expect(rec.bindings.y.value).toBe(undefined)
    expect(rec.bindings.y.initialized).toBe(true)
  })

  it("TC4.ReturnsNormalUndefined", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)
    const ev = new Evaluator(env)

    const node = {
      type: "VariableDeclaration",
      declarations: []
    }

    const result = ev.executeVariableStatement(node)

    expect(result.type).toBe("normal")
    expect(result.value).toBe(undefined)
  })

  it("TC5.DoesNotCreateLexicalEnvironment", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)
    const ev = new Evaluator(env)

    const originalOuter = env.outer

    rec.CreateMutableBinding("x")


    const node = {
      type: "VariableDeclaration",
      declarations: [
        {
          id: { name: "x" },
          init: { type: "Literal", value: 1 }
        }
      ]
    }

    ev.evaluateLiteral = (n) => ({ type: "normal", value: n.value })

    ev.executeVariableStatement(node)

    expect(env.outer).toBe(originalOuter)
  })

})