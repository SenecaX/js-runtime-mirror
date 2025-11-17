export class LexicalEnvironment {
    constructor(rec, outer) {
        this.environmentRecord = rec;
        this.outer = outer;
    }
}
