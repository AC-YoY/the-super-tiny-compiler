/*
* 目标
*
*  [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
*
* */

function parser(tokens) {

    // Again we keep a `current` variable that we will use as a cursor.
    let current = 0

    // But this time we're going to use recursion instead of a `while` loop. So we
    // define a `walk` function.
    // walk 只返回一个对象，内部再嵌套时需要主动调用 walk
    function walk() {

        // Inside the walk function we start by grabbing the `current` token.
        let token = tokens[current]

        if (token.type === 'number') {
            current++

            return {
                type: 'NumberLiteral',
                value: token.value,
            }
        }

        if (token.type === 'string') {
            current++

            return {
                type: 'StringLiteral',
                value: token.value,
            }
        }

        // Next we're going to look for CallExpressions. We start this off when we
        // encounter an open parenthesis.
        if (
            token.type === 'paren' &&
            token.value === '('
        ) {
            // We'll increment `current` to skip the parenthesis since we don't care
            // about it in our AST.
            token = tokens[++current]

            // We create a base node with the type `CallExpression`, and we're going
            // to set the name as the current token's value since the next token after
            // the open parenthesis is the name of the function.
            // 这里是 LISP 语法导致的，( 之后的才是 方法名
            let node = {
                type: 'CallExpression',
                name: token.value,
                params: [],
            }

            // We increment `current` *again* to skip the name token.
            token = tokens[++current]

            // And now we want to loop through each token that will be the `params` of
            // our `CallExpression` until we encounter a closing parenthesis.
            //
            // Now this is where recursion comes in. Instead of trying to parse a
            // potentially infinitely nested set of nodes we're going to rely on
            // recursion to resolve things.
            //
            // To explain this, let's take our Lisp code. You can see that the
            // parameters of the `add` are a number and a nested `CallExpression` that
            // includes its own numbers.
            //
            //   (add 2 (subtract 4 2))
            //
            // You'll also notice that in our tokens array we have multiple closing
            // parenthesis.
            //
            //   [
            //     { type: 'paren',  value: '('        },
            //     { type: 'name',   value: 'add'      },
            //     { type: 'number', value: '2'        },
            //     { type: 'paren',  value: '('        },
            //     { type: 'name',   value: 'subtract' },
            //     { type: 'number', value: '4'        },
            //     { type: 'number', value: '2'        },
            //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
            //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
            //   ]
            //
            // We're going to rely on the nested `walk` function to increment our
            // `current` variable past any nested `CallExpression`.

            // So we create a `while` loop that will continue until it encounters a
            // token with a `type` of `'paren'` and a `value` of a closing
            // parenthesis.
            while (
                (token.type !== 'paren') ||
                (token.type === 'paren' && token.value !== ')')
                ) {
                // we'll call the `walk` function which will return a `node` and we'll
                // push it into our `node.params`.
                node.params.push(walk())
                token = tokens[current]
            }

            // Finally we will increment `current` one last time to skip the closing
            // parenthesis.
            current++

            // And return the node.
            return node
        }

        throw new TypeError(token.type)
    }

    // Now, we're going to create our AST which will have a root which is a
    // `Program` node.
    let ast = {
        type: 'Program',
        body: [],
    }

    while (current < tokens.length) {
        ast.body.push(walk())
    }

    return ast
}

module.exports = parser