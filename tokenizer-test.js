const tokenizer = require('./tokenizer')
let routerCodes = '(add 2 (subtract 4 2))'

console.log(
    tokenizer(routerCodes)
)