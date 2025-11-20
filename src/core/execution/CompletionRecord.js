export class CompletionRecord {
    
    static Normal(value) {
        return Object.freeze({
            type: "normal",
            value,
        })
    }

    static Throw(error) {
        return Object.freeze({
            type: "throw",
            value: error
        })
    }

    static Return(value) {
        return Object.freeze({
            type: "return",
            value,
        })
    }
}
