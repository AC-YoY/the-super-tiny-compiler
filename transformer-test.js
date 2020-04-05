const util = require('util')
const tokenizer = require('./tokenizer')
const parser = require('./parser')
const transformer = require('./transformer')
let codes = '(add 2 (subtract 4 2))'

const ast = parser(tokenizer(codes))
debugger
console.log(
    util.inspect(
        transformer(ast),
        false,
        null,
    )
)