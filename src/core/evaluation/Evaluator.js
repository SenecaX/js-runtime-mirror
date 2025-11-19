import { CompletionRecord } from "../../../src/core/execution/CompletionRecord.js";

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

  executeExpressionStatement(node) {
    return this.evaluateLiteral(node.expression);
  }

  traverseASTInOrder(bodyArray) {
    let completion;

    if (bodyArray.length === 0) {
      return CompletionRecord.Normal(undefined);
    }

    for (const node of bodyArray) {
      switch (node.type) {
        case "Literal":
          completion = this.evaluateLiteral(node);

          if(completion.type === "throw") {
            return completion
          }
          break;
        case "Identifier":
          completion = this.evaluateIdentifier(node);
          break;
        case "VariableDeclaration":
          completion = this.executeVariableStatement(node);
          break;
        case "ExpressionStatement":
          completion = this.executeExpressionStatement(node);
      }
    }

    return completion;
  }
}
