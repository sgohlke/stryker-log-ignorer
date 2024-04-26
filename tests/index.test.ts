import { LogIgnorer, LogIgnorerOptions } from '@/index'

import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { NodePath } from '@stryker-mutator/api/ignore'
import { describe, expect, test } from 'vitest'

describe('LogIgnorer.shouldIgnore', () => {
    test.each(['log', 'debug', 'info', 'warn', 'error'])(
        'returns a truthy value when calling console.%s',
        (method) => {
            const logIgnorer = new LogIgnorer()
            const path = parseExpressionStatement(`console.${method}("test")`)
            expect(logIgnorer.shouldIgnore(path)).toBeTruthy()
        },
    )

    test('returns a truthy value when calling methods on object with name included in options', () => {
        const options: Partial<LogIgnorerOptions> = {
            logignore: { objectNames: ['customLogger'] },
        }
        const logIgnorer = new LogIgnorer(options)
        const path = parseExpressionStatement('customLogger.log("test")')
        expect(logIgnorer.shouldIgnore(path)).toBeTruthy()
    })

    test('returns a falsy value when calling methods on other objects than console', () => {
        const logIgnorer = new LogIgnorer()
        const path = parseExpressionStatement('customLogger.log("test")')
        expect(logIgnorer.shouldIgnore(path)).toBeFalsy()
    })

    test('returns a falsy value when calling methods on other objects than configured', () => {
        const options: Partial<LogIgnorerOptions> = {
            logignore: { objectNames: ['customLogger'] },
        }
        const logIgnorer = new LogIgnorer(options)
        const path = parseExpressionStatement('foo.log("test")')
        expect(logIgnorer.shouldIgnore(path)).toBeFalsy()
    })

    test('returns a falsy value when passing console as an argument to a method', () => {
        const logIgnorer = new LogIgnorer()
        const path = parseExpressionStatement('someObject.log(console)')
        expect(logIgnorer.shouldIgnore(path)).toBeFalsy()
    })
})

function parseExpressionStatement(
    sourceCode: string,
): NodePath {
    const ast = parser.parse(sourceCode, { sourceType: 'module' })

    let statementPath: NodePath | undefined
    traverse(ast, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ExpressionStatement(path) {
            statementPath = path
        },
    })

    if (!statementPath) {
        throw new Error('Could not find expression statement in given code')
    }

    return statementPath
}
