const codeGenerator = require('./codeGenerator')

const util = require('util')
const tokenizer = require('./tokenizer')
const parser = require('./parser')
const transformer = require('./transformer')
let codes = '(add 2 (subtract 4 2))'

const ast = transformer(parser(tokenizer(codes)))
// debugger
console.log(
    util.inspect(
        codeGenerator(ast),
        false,
        null,
    )
)