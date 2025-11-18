export class Evaluator {
  constructor(lexicalEnv) {
    this.lexicalEnv = lexicalEnv;
  }

  evaluateLiteral(node) {
    if (node.type !== "Literal") throw "Not Literal";
    if (!node.value) throw "Missing value";

    const value = node.value;

    return {
      type: "normal",
      value,
    };
  }

  evaluateIdentifier(node) {
    try {
      const result = this.lexicalEnv.ResolveIdentifier(node.name);
      const value = result.GetBindingValue(node.name);

      return {
        type: "normal",
        value,
      };
    } catch (error) {
      return { type: "throw", value: error };
    }
  }

  executeVariableStatement(node) {
    for (let i = 0; i < node.declarations.length; i++) {
      this.lexicalEnv.environmentRecord.InitializeBinding(
        node.declarations[i].id.name,
        node.declarations[i].init ? node.declarations[i].init.value : undefined
      );
    }

    return {
      type: "normal",
      value: undefined,
    };
  }
}
