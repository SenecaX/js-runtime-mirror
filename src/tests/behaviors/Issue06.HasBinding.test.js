import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"

describe("Issue06.HasBinding", () => {

  it("TC1.TrueIfBindingExists", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    expect(rec.HasBinding("x")).toBe(true)
  })

  it("TC2.FalseIfBindingMissing", () => {
    const rec = new DeclarativeEnvironmentRecord()
    expect(rec.HasBinding("x")).toBe(false)
  })

  it("TC3.DoesNotCreateBinding", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.HasBinding("x")
    expect(rec.bindings.x).toBeUndefined()
  })

  it("TC4.DoesNotModifyBindings", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.HasBinding("x")
    expect(rec.bindings.x).toBeDefined()
    expect(Object.keys(rec.bindings)).toEqual(["x"])
  })

  it("TC5.LocalRecordOnly", () => {
    const outer = new DeclarativeEnvironmentRecord()
    outer.CreateMutableBinding("y")

    const inner = new DeclarativeEnvironmentRecord(outer)
    // HasBinding MUST ignore outer
    expect(inner.HasBinding("y")).toBe(false)
  })

})
