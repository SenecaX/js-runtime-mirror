import { RuntimeEngine } from "../../core/engine/RuntimeEngine.js";
import * as acornNS from "acorn";

describe("Issue03.ParseProgramToAST", () => {
  it("TC1.ReturnsProgramAST", () => {
    const rt = new RuntimeEngine();
    const ast = rt.parse("let x = 1");
    expect(ast.type).toBe("Program");
  });

  it("TC2.ProgramBodyIsArray", () => {
    const rt = new RuntimeEngine();
    const ast = rt.parse("let x = 1");
    expect(Array.isArray(ast.body)).toBe(true);
  });

  it("TC3.ThrowsOnInvalidSyntax", () => {
    const rt = new RuntimeEngine();
    expect(() => rt.parse("let =")).toThrow();
  });

  it("TC4.DoesNotModifyAST", () => {
    const source = "let x = 1; const y = 2;";
    const expected = acornNS.parse(source, { ecmaVersion: 2020 });

    const rt = new RuntimeEngine();
    const ast = rt.parse(source);

    expect(ast).toEqual(expected);
  });

  it("TC5.DoesNotWalkAST", () => {
    let walked = false;

    // Clone acorn namespace so we can patch parse()
    const acorn = { ...acornNS };
    const originalParse = acorn.parse;

    acorn.parse = (src, opts) => {
      const ast = originalParse(src, opts);
      return new Proxy(ast, {
        get(target, prop) {
          if (prop === "body") walked = true;
          return target[prop];
        },
      });
    };

    const rt = new RuntimeEngine();
    rt.acorn = acorn; // inject patched parser

    rt.parse("let x = 1");

    expect(walked).toBe(false);
  });
  it("TC6.PreservesNodeOrder", () => {
    const source = `
      let a = 1;
      let b = 2;
      let c = 3;
    `;

    const rt = new RuntimeEngine();
    const ast = rt.parse(source);

    const names = ast.body
      .filter((n) => n.type === "VariableDeclaration")
      .map((n) => n.declarations[0].id.name);

    expect(names).toEqual(["a", "b", "c"]);
  });

  it("TC7.DoesNotInstantiateOrEvaluate", () => {
    const rt = new RuntimeEngine();

    rt.instantiator.instantiateGlobal = () => {
      throw "Should not be called";
    };
    rt.controlFlow.execute = () => {
      throw "Should not be called";
    };

    rt.parse("let x = 1"); // Must not trigger instantiation or execution
  });
});
