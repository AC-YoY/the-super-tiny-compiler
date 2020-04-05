/*
* code demo
*  {
*    type: 'Program',
*    body: [
*      {
*        type: 'ExpressionStatement',
*        expression: {
*          type: 'CallExpression',
*          callee: { type: 'Identifier', name: 'add' },
*          arguments: [
*            { type: 'NumberLiteral', value: '2' },
*            {
*              type: 'CallExpression',
*              callee: { type: 'Identifier', name: 'subtract' },
*              arguments: [
*                { type: 'NumberLiteral', value: '4' },
*                { type: 'NumberLiteral', value: '2' },
*              ]
*            }
*          ]
*        }
*      }
*    ]
*  }
* */

function codeGenerator(node) {
    switch (node.type) {
        case 'Program':
            return node.body.map(codeGenerator).join('\n')
        case 'ExpressionStatement':
            return codeGenerator(node.expression) + ''
        case 'NumberLiteral':
            return node.value
        case 'StringLiteral':
            return node.value
        case 'Identifier':
            return node.name
        case 'CallExpression':
            return codeGenerator(node.callee) +
                '(' +
                    node.arguments.map(codeGenerator).join(', ') +
                ')'
        default:
            throw new TypeError(node.type)
    }
    // let code = ''
    // if (node.type === 'Program') {
    //     node.body.forEach(n => {
    //         code += codeGenerator(n)
    //     })
    // } else if (node.type === 'ExpressionStatement') {
    //     code += codeGenerator(node.expression)
    // } else if (node.type === 'CallExpression') {
    //     code += node.callee.name + '('
    //     node.arguments.forEach((n, index) => {
    //         code += codeGenerator(n)
    //         if (index !== node.arguments.length - 1) {
    //             code += ', '
    //         }
    //     })
    //     code += ')'
    // } else if (node.type === 'NumberLiteral') {
    //     code += node.value
    // } else if (node.type === 'StringLiteral') {
    //     code += node.value
    // }
    // return code
}

function codeGenerator2(node) {

    // We'll break things down by the `type` of the `node`.
    switch (node.type) {

        // If we have a `Program` node. We will map through each node in the `body`
        // and run them through the code generator and join them with a newline.
        case 'Program':
            return node.body.map(codeGenerator)
                .join('\n')

        // For `ExpressionStatement` we'll call the code generator on the nested
        // expression and we'll add a semicolon...
        case 'ExpressionStatement':
            return (
                codeGenerator(node.expression) +
                '' // << (...because we like to code the *correct* way)
            )

        // For `CallExpression` we will print the `callee`, add an open
        // parenthesis, we'll map through each node in the `arguments` array and run
        // them through the code generator, joining them with a comma, and then
        // we'll add a closing parenthesis.
        case 'CallExpression':
            return (
                codeGenerator(node.callee) +
                '(' +
                node.arguments.map(codeGenerator)
                    .join(', ') +
                ')'
            )

        // For `Identifier` we'll just return the `node`'s name.
        case 'Identifier':
            return node.name

        // For `NumberLiteral` we'll just return the `node`'s value.
        case 'NumberLiteral':
            return node.value

        // For `StringLiteral` we'll add quotations around the `node`'s value.
        case 'StringLiteral':
            return '"' + node.value + '"'

        // And if we haven't recognized the node, we'll throw an error.
        default:
            throw new TypeError(node.type)
    }
}

module.exports = codeGenerator