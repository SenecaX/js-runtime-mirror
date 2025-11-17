import { DeclarativeEnvironmentRecord } from "../../core/environment/DeclarativeEnvironmentRecord.js";

describe("Issue08.SetMutableBinding", () => {
  it("TC1.BindingMustExist", () => {
    const rec = new DeclarativeEnvironmentRecord();
    expect(() => rec.SetMutableBinding("x", 10)).toThrow();
  });

  it("TC2.BindingMustBeMutable", () => {
    const rec = new DeclarativeEnvironmentRecord();

    // create immutable binding manually
    rec.bindings.x = {
      value: undefined,
      mutable: false,
      initialized: true,
    };

    expect(() => rec.SetMutableBinding("x", 5)).toThrow();
  });

  it("TC3.BindingMustBeInitialized", () => {
    const rec = new DeclarativeEnvironmentRecord();

    rec.CreateMutableBinding("x"); // initialized: false
    expect(() => rec.SetMutableBinding("x", 10)).toThrow();
  });

  it("TC4.ValueUpdatedCorrectly", () => {
    const rec = new DeclarativeEnvironmentRecord();

    rec.CreateMutableBinding("x");
    rec.InitializeBinding("x", 1);
    rec.SetMutableBinding("x", 999);

    expect(rec.bindings.x.value).toBe(999);
  });

  it("TC5.DoesNotCreateNewBinding", () => {
    const rec = new DeclarativeEnvironmentRecord();

    rec.CreateMutableBinding("x");
    rec.InitializeBinding("x", 5);

    rec.SetMutableBinding("x", 20);

    // Ensure no additional keys exist
    expect(Object.keys(rec.bindings)).toEqual(["x"]);
  });

  it("TC6.DoesNotModifyOuterEnv", () => {
    const outer = new DeclarativeEnvironmentRecord();
    outer.CreateMutableBinding("y");
    outer.InitializeBinding("y", 50);

    const inner = new DeclarativeEnvironmentRecord(outer);
    inner.CreateMutableBinding("x");
    inner.InitializeBinding("x", 10);

    inner.SetMutableBinding("x", 100);

    // outer must remain untouched
    expect(outer.bindings.y.value).toBe(50);
  });
});
