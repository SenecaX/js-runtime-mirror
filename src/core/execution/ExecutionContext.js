export class ExecutionContext {
    constructor() {
        this.lexicalEnv = null;
        this.variableEnv = null;
        this.thisBinding = undefined;
    }
}
