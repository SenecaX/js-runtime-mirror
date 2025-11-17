export class LexicalEnvironment {
  constructor(rec, outer) {
    this.environmentRecord = rec;
    this.outer = outer;
  }
  ResolveIdentifier(name) {
    let env = this;

    while (env !== null) {
      const record = env.environmentRecord;

      if (record.HasBinding(name)) {
        return record;
      }

      env = env.outer;
    }

    throw "Not found";
  }
}
