/*
* 目标：
*
*   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
*
*   [
*     { type: 'paren',  value: '('        },
*     { type: 'name',   value: 'add'      },
*     { type: 'number', value: '2'        },
*     { type: 'paren',  value: '('        },
*     { type: 'name',   value: 'subtract' },
*     { type: 'number', value: '4'        },
*     { type: 'number', value: '2'        },
*     { type: 'paren',  value: ')'        },
*     { type: 'paren',  value: ')'        },
*   ]
*
* 已知没有处理的问题：
* {} 注释
* */
function tokenizer(input) {
    const tokens = []
    let index = 0

    while (index < input.length) {
        let char = input[index]

        if (char === '(') {
            tokens.push({
                type: 'paren',
                value: '('
            })
            index++
            continue
        }

        if (char === ')') {
            tokens.push({
                type: 'paren',
                value: ')'
            })
            index++
            continue
        }

        const NUMBERS = /[0-9]/
        if (NUMBERS.test(char)) {
            let value = ''

            while (NUMBERS.test(char)) {
                value += char
                index++
                char = input[index]
            }
            tokens.push({
                type: 'number',
                value,
            })
            continue
        }

        const LETTERS = /[a-z]/i
        if (LETTERS.test(char)) {
            let value = ''

            while (LETTERS.test(char)) {
                value += char
                index++
                char = input[index]
            }
            tokens.push({
                type: 'name',
                value,
            })
            continue
        }

        if (char === '"' || char === '\'') {
            const quote = char
            let value = char
            index++
            char = input[index]

            while (char !== quote) {
                value += char
                index++
            }

            tokens.push({
                type: 'string',
                value,
            })
            continue
        }

        const WHITESPACE = /\s/
        if (WHITESPACE.test(char)) {
            index++
            continue
        }

        throw new TypeError('I dont know what this character is: ' + char)
    }

    return tokens
}

module.exports = tokenizer
