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

  InitializeBinding(name, value) {
    const binding = this.bindings[name];
    if(!binding) throw "Does not exist.";
    if(binding.initialized) throw "Already initialized";

    binding.value = value;
    binding.initialized = true;
  }
}
