export class DeclarativeEnvironmentRecord {
  constructor() {
    this.bindings = {};
  }

  CreateMutableBinding(name) {
    if(this.bindings[name] !== undefined) throw "Already exists";
    this.bindings[name] = {
        mutable: true,
        initialized: false
    };
  }
}
