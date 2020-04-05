/*
* 编译器的编译过程
* 1. tokenizer 词法分析 -> tokens 词法单元组成的数组
* 2. parser 语法分析 -> ast
* 3. transformer
* */
function compiler(code) {
    let tokens = tokenizer(code)
    let ast = parser(tokens)
    let newAst = transformer(ast)
    let output = codeGenerator(newAst)
    return output
}

/*
* 目标:
*
*                  LISP                      C
*
*   2 + 2          (add 2 2)                 add(2, 2)
*   4 - 2          (subtract 4 2)            subtract(4, 2)
*   2 + (4 - 2)    (add 2 (subtract 4 2))    add(2, subtract(4, 2))
* */