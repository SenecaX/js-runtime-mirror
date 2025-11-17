import { LexicalEnvironment } from "../../core/environment/LexicalEnvironment.js"
import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"

describe("Issue09.ResolveIdentifier", () => {

  it("TC1.FindsBindingInCurrentEnv", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("x")

    const env = new LexicalEnvironment(rec, null)

    expect(env.ResolveIdentifier("x")).toBe(rec)
  })

  it("TC2.FindsBindingInOuterEnv", () => {
    const outerRec = new DeclarativeEnvironmentRecord()
    outerRec.CreateMutableBinding("y")

    const outer = new LexicalEnvironment(outerRec, null)

    const innerRec = new DeclarativeEnvironmentRecord()
    const inner = new LexicalEnvironment(innerRec, outer)

    expect(inner.ResolveIdentifier("y")).toBe(outerRec)
  })

  it("TC3.ThrowsIfUnresolvable", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)

    expect(() => env.ResolveIdentifier("z")).toThrow()
  })

  it("TC4.DoesNotMutateEnvironment", () => {
    const rec = new DeclarativeEnvironmentRecord()
    rec.CreateMutableBinding("a")

    const env = new LexicalEnvironment(rec, null)

    const before = JSON.stringify(rec.bindings)
    env.ResolveIdentifier("a")
    const after = JSON.stringify(rec.bindings)

    expect(after).toBe(before)
  })

  it("TC5.DoesNotCreateBinding", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)

    try { env.ResolveIdentifier("ghost") } catch(e) {}

    expect(rec.bindings.ghost).toBeUndefined()
  })

})
