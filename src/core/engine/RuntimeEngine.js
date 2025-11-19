import * as acorn from "acorn"
import { InstantiationWorkflow } from "../instantiation/InstantiationWorkflow"

export class RuntimeEngine {
  constructor() {
    this.instantiator = new InstantiationWorkflow();
    this.controlFlow = { execute() {} }
  }

  parse(source) {
    return acorn.parse(source, { ecmaVersion: 2020 })
  }

  instantiate(ast) {
    this.instantiator.instantiateGlobal(ast);
  }
}
