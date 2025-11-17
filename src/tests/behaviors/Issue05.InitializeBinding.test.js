import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"

describe("Issue05.InitializeBinding", () => {

  it("TC1.BindingMustExist", () => {
    const rec = new DeclarativeEnvironmentRecord()
    expect(() => rec.InitializeBinding("x", 10)).toThrow()
  })

  it("TC2.BindingMustBeUninitialized", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 1)
    expect(() => rec.InitializeBinding("x", 2)).toThrow()
  })

  it("TC3.SetsInitializedTrue", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 5)
    expect(rec.bindings.x.initialized).toBe(true)
  })

  it("TC4.SetsValueCorrectly", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 99)
    expect(rec.bindings.x.value).toBe(99)
  })

  it("TC5.NoReinitializationAllowed", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 42)
    expect(() => rec.InitializeBinding("x", 77)).toThrow()
  })

  it("TC6.DoesNotCreateNewBinding", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 10)

    // Ensure no new key was added
    expect(Object.keys(rec.bindings)).toEqual(["x"])
  })

  it("TC7.DoesNotModifyOuterEnv", () => {
    const outer = new DeclarativeEnvironmentRecord()
    outer.CreateMutableBinding("y")
    outer.InitializeBinding("y", 100)

    const inner = new DeclarativeEnvironmentRecord(outer)
    inner.CreateMutableBinding("x")
    inner.InitializeBinding("x", 5)

    expect(outer.bindings.y.value).toBe(100)
  })

})
