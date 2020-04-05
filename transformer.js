/*
* 目标
* ----------------------------------------------------------------------------
*   Original AST                     |   Transformed AST
* ----------------------------------------------------------------------------
*   {                                |   {
*     type: 'Program',               |     type: 'Program',
*     body: [{                       |     body: [{
*       type: 'CallExpression',      |       type: 'ExpressionStatement',
*       name: 'add',                 |       expression: {
*       params: [{                   |         type: 'CallExpression',
*         type: 'NumberLiteral',     |         callee: {
*         value: '2'                 |           type: 'Identifier',
*       }, {                         |           name: 'add'
*         type: 'CallExpression',    |         },
*         name: 'subtract',          |         arguments: [{
*         params: [{                 |           type: 'NumberLiteral',
*           type: 'NumberLiteral',   |           value: '2'
*           value: '4'               |         }, {
*         }, {                       |           type: 'CallExpression',
*           type: 'NumberLiteral',   |           callee: {
*           value: '2'               |             type: 'Identifier',
*         }]                         |             name: 'subtract'
*       }]                           |           },
*     }]                             |           arguments: [{
*   }                                |             type: 'NumberLiteral',
*                                    |             value: '4'
* ---------------------------------- |           }, {
*                                    |             type: 'NumberLiteral',
*                                    |             value: '2'
*                                    |           }]
*  (sorry the other one is longer.)  |         }
*                                    |       }
*                                    |     }]
*                                    |   }
* ----------------------------------------------------------------------------
* */

function traverser(ast, visitor) {

    // A `traverseArray` function that will allow us to iterate over an array and
    // call the next function that we will define: `traverseNode`.
    function traverseArray(array, parent) {
        array.forEach(child => {
            traverseNode(child, parent)
        })
    }

    // `traverseNode` will accept a `node` and its `parent` node. So that it can
    // pass both to our visitor methods.
    function traverseNode(node, parent) {

        // We start by testing for the existence of a method on the visitor with a
        // matching `type`.
        let methods = visitor[node.type]

        // If there is an `enter` method for this node type we'll call it with the
        // `node` and its `parent`.
        if (methods && methods.enter) {
            methods.enter(node, parent)
        }

        // Next we are going to split things up by the current node type.
        switch (node.type) {

            // We'll start with our top level `Program`. Since Program nodes have a
            // property named body that has an array of nodes, we will call
            // `traverseArray` to traverse down into them.
            //
            // (Remember that `traverseArray` will in turn call `traverseNode` so  we
            // are causing the tree to be traversed recursively)
            case 'Program':
                traverseArray(node.body, node)
                break

            // Next we do the same with `CallExpression` and traverse their `params`.
            case 'CallExpression':
                traverseArray(node.params, node)
                break

            // In the cases of `NumberLiteral` and `StringLiteral` we don't have any
            // child nodes to visit, so we'll just break.
            case 'NumberLiteral':
            case 'StringLiteral':
                break

            // And again, if we haven't recognized the node type then we'll throw an
            // error.
            default:
                throw new TypeError(node.type)
        }

        // If there is an `exit` method for this node type we'll call it with the
        // `node` and its `parent`.
        if (methods && methods.exit) {
            methods.exit(node, parent)
        }
    }

    // Finally we kickstart the traverser by calling `traverseNode` with our ast
    // with no `parent` because the top level of the AST doesn't have a parent.
    traverseNode(ast, null)
}

function transformer(ast) {
    let newAst = {
        type: 'Program',
        body: [],
    }

    // Next I'm going to cheat a little and create a bit of a hack. We're going to
    // use a property named `context` on our parent nodes that we're going to push
    // nodes to their parent's `context`. Normally you would have a better
    // abstraction than this, but for our purposes this keeps things simple.
    //
    // Just take note that the context is a reference *from* the old ast *to* the
    // new ast.
    // 重点，遍历树结构时，_context 是新的树，所有变化都只需要直接操作 _context 就行了
    ast._context = newAst.body

    // We'll start by calling the traverser function with our ast and a visitor.
    traverser(ast, {

        // The first visitor method accepts any `NumberLiteral`
        NumberLiteral: {
            // We'll visit them on enter.
            enter(node, parent) {
                // We'll create a new node also named `NumberLiteral` that we will push to
                // the parent context.
                parent._context.push({
                    type: 'NumberLiteral',
                    value: node.value,
                })
            },
        },

        // Next we have `StringLiteral`
        StringLiteral: {
            enter(node, parent) {
                parent._context.push({
                    type: 'StringLiteral',
                    value: node.value,
                })
            },
        },

        // Next up, `CallExpression`.
        CallExpression: {
            enter(node, parent) {

                // We start creating a new node `CallExpression` with a nested
                // `Identifier`.
                // 这里是函数转换的地方
                let expression = {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: node.name,
                    },
                    arguments: [],
                }

                // Next we're going to define a new context on the original
                // `CallExpression` node that will reference the `expression`'s arguments
                // so that we can push arguments.
                node._context = expression.arguments

                // Then we're going to check if the parent node is a `CallExpression`.
                // If it is not...
                if (parent.type !== 'CallExpression') {

                    // We're going to wrap our `CallExpression` node with an
                    // `ExpressionStatement`. We do this because the top level
                    // `CallExpression` in JavaScript are actually statements.
                    expression = {
                        type: 'ExpressionStatement',
                        expression: expression,
                    }
                }

                // Last, we push our (possibly wrapped) `CallExpression` to the `parent`'s
                // `context`.
                parent._context.push(expression)
            },
        }
    })

    // At the end of our transformer function we'll return the new ast that we
    // just created.
    return newAst
}

module.exports = transformer