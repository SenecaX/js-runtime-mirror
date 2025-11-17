import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"

describe("Issue07.GetBindingValue", () => {

  it("TC1.BindingMustExist", () => {
    const rec = new DeclarativeEnvironmentRecord()
    expect(() => rec.GetBindingValue("x")).toThrow()
  })

  it("TC2.BindingMustBeInitialized", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")        // created, but uninitialized
    expect(() => rec.GetBindingValue("x")).toThrow()
  })

  it("TC3.ThrowsTDZIfUninitialized", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")        // TDZ
    expect(() => rec.GetBindingValue("x")).toThrow()
  })

  it("TC4.ReturnsStoredValue", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 123)
    expect(rec.GetBindingValue("x")).toBe(123)
  })

  it("TC5.DoesNotModifyValue", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 999)

    const before = rec.bindings.x.value
    rec.GetBindingValue("x")
    const after = rec.bindings.x.value

    expect(before).toBe(after)
  })

  it("TC6.LocalOnly", () => {
    const outer = new DeclarativeEnvironmentRecord()
    outer.CreateMutableBinding("y")
    outer.InitializeBinding("y", 7)

    const inner = new DeclarativeEnvironmentRecord(outer)

    // MUST NOT read outer env
    expect(() => inner.GetBindingValue("y")).toThrow()
  })

  it("TC7.NoEvaluation", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")
    rec.InitializeBinding("x", 42)

    let sideEffect = false

    // Wrap value with a getter that would trigger evaluation
    rec.bindings.x = {
      value: {
        get v() {
          sideEffect = true
          return 42
        }
      },
      mutable: true,
      initialized: true
    }

    const result = rec.GetBindingValue("x")

    // Must NOT trigger the getter
    expect(sideEffect).toBe(false)
    expect(result.v).toBe(42)
  })

})
