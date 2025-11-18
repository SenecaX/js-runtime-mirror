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
}
