export class Evaluator {
  evaluateLiteral(node) {
   if(node.type !== "Literal") throw "Not Literal";
   if(!node.value) throw "Missing value"

   const value = node.value;

   return {
    type: "normal",
    value,
   }
  }
}

