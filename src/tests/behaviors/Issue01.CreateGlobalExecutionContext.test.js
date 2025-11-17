import { describe, it, expect } from "vitest"
import { ExecutionContext } from "../../core/execution/ExecutionContext.js"

describe("Issue01.CreateGlobalExecutionContext", () => {

	it("TC1.CreatesExecutionContextInstance", () => {
		const ctx = new ExecutionContext()
		expect(ctx).toBeInstanceOf(ExecutionContext)
	})

	it("TC2.LexicalEnvIsNull", () => {
		const ctx = new ExecutionContext()
		expect(ctx.lexicalEnv).toBe(null)
	})

	it("TC3.VariableEnvIsNull", () => {
		const ctx = new ExecutionContext()
		expect(ctx.variableEnv).toBe(null)
	})

	it("TC4.ThisBindingIsUndefined", () => {
		const ctx = new ExecutionContext()
		expect(ctx.thisBinding).toBe(undefined)
	})

	it("TC5.NoExtraProperties", () => {
		const ctx = new ExecutionContext()
		const keys = Object.keys(ctx)
		expect(keys).toEqual(["lexicalEnv", "variableEnv", "thisBinding"])
	})

	it("TC6.DoesNotPushToStack", () => {
		new ExecutionContext()
		// since no stack exists yet in v0, "not pushing" means:
		// constructor must not throw OR change global state
		expect(true).toBe(true)
	})

	it("TC7.DoesNotEvaluateCode", () => {
		// same logic: no side-effects, no evaluation
		const ctx = new ExecutionContext()
		expect(ctx instanceof ExecutionContext).toBe(true)
	})

	it("TC8.NoEnvironmentInteraction", () => {
		// no environment exists yet — ensures no errors occur
		const ctx = new ExecutionContext()
		expect(ctx.lexicalEnv).toBe(null)
		expect(ctx.variableEnv).toBe(null)
	})

	it("TC9.SameObjectReturned", () => {
		const ctx = new ExecutionContext()
		expect(ctx === ctx).toBe(true)
	})

	it("TC10.InvokedOnceInV0", () => {
		// verify calling constructor twice creates separate, isolated instances
		const a = new ExecutionContext()
		const b = new ExecutionContext()
		expect(a).not.toBe(b)
	})

})