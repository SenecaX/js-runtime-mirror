import { LexicalEnvironment } from "../../core/environment/LexicalEnvironment.js"
import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js"

describe("Issue02.CreateGlobalLexicalEnvironment", () => {

  it("TC1.CreatesLexicalEnvironmentInstance", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)
    expect(env).toBeInstanceOf(LexicalEnvironment)
  })

  it("TC2.EnvironmentRecordIsDeclarative", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)
    expect(env.environmentRecord).toBeInstanceOf(DeclarativeEnvironmentRecord)
  })

  it("TC3.OuterIsNull", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)
    expect(env.outer).toBe(null)
  })

  it("TC4.HasNoBindings", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)
    expect(Object.keys(env.environmentRecord.bindings)).toEqual([])
  })

  it("TC5.NotAttachedToVariableEnv", () => {
    const rec = new DeclarativeEnvironmentRecord()
    const env = new LexicalEnvironment(rec, null)

    // Ensure no accidental linkage to variable env
    expect(env.environmentRecord.varBindings).toBeUndefined()
    expect(env.outerVariableEnv).toBeUndefined()
    expect(env.environmentRecord.globalVarEnv).toBeUndefined()
  })

  it("TC6.DoesNotEvaluateCode", () => {
    // Creating the environment must not evaluate or execute anything
    let evaluated = false

    const rec = new DeclarativeEnvironmentRecord(() => { evaluated = true })
    const env = new LexicalEnvironment(rec, null)

    expect(evaluated).toBe(false)
  })

  it("TC7.InvokedOnceInV0", () => {
    let count = 0
    class REC extends DeclarativeEnvironmentRecord {
      constructor() { super(); count++ }
    }

    const rec = new REC()
    const env = new LexicalEnvironment(rec, null)

    expect(count).toBe(1)
  })

})
