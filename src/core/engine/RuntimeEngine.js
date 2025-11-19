import * as acorn from "acorn"
import { InstantiationWorkflow } from "../instantiation/InstantiationWorkflow"
import { Evaluator } from "../evaluation/Evaluator";

export class RuntimeEngine {
  constructor() {
    this.instantiator = new InstantiationWorkflow();
    this.controlFlow = { execute() {} }
    this.evaluator = new Evaluator();
  }

  parse(source) {
    return acorn.parse(source, { ecmaVersion: 2020 })
  }

  instantiate(ast) {
    this.instantiator.instantiateGlobal(ast);
  }

  evaluate(ast) {
    return this.evaluator.traverseASTInOrder(ast.body)
  }

}
