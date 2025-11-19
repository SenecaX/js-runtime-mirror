export class CompletionRecord {
    
    static Normal(value) {
        return Object.freeze({
            type: "normal",
            value,
        })
    }
}
