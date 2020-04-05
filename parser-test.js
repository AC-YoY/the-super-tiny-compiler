const util = require('util')
const tokenizer = require('./tokenizer')
const parser = require('./parser')
let codes = '(add 2 (subtract 4 2)) (add 3 4)'

console.log(
    util.inspect(
        parser(tokenizer(codes)),
        false,
        null,
    )
)