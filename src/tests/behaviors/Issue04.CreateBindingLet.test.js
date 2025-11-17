import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"

describe("Issue04.CreateBindingLet", () => {

  it("TC1.CreatesBindingInLocalRecord", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const test = rec.CreateMutableBinding("x")
    expect(rec.bindings.x).toBeDefined()
  })

  it("TC2.BindingMutableTrue", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    expect(rec.bindings.x.mutable).toBe(true)
  })

  it("TC3.BindingInitializedFalse", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    expect(rec.bindings.x.initialized).toBe(false)
  })

  it("TC4.BindingValueUndefined", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    expect(rec.bindings.x.value).toBe(undefined)
  })

  it("TC5.DoesNotInitializeValue", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    // should remain undefined + uninitialized
    expect(rec.bindings.x.initialized).toBe(false)
    expect(rec.bindings.x.value).toBe(undefined)
  })

  it("TC6.ThrowsOnDuplicateBinding", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    expect(() => rec.CreateMutableBinding("x")).toThrow()
  })

  it("TC7.DoesNotEvaluateInitializer", () => {
    let evaluated = false
    const rec = new DeclarativeEnvironmentRecord()

    rec.CreateMutableBinding("x", () => { evaluated = true })

    expect(evaluated).toBe(false)
  })

  it("TC8.DoesNotModifyOuterEnv", () => {
    const outer = new DeclarativeEnvironmentRecord()
    outer.bindings.y = { value: 10, mutable: true, initialized: true }

    const inner = new DeclarativeEnvironmentRecord(outer)
    inner.CreateMutableBinding("x")

    expect(outer.bindings.y.value).toBe(10)
    expect(inner.bindings.x).toBeDefined()
  })

})
