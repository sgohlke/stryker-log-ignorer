import { LogIgnorer, NodePath } from '@/index'
import { expect, test } from 'vitest'
// import {  testInjector } from '@stryker-mutator/test-helpers';

const pathMock: NodePath = {
    isExpressionStatement: () => true,
    node: {
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'MemberExpression',
                object: {
                    type: 'Identifier',
                    name: 'console',
                },
            },
        },
    },
}

test('Test LogIgnorer function', () => {
    // Call each log function once. Should call console.log for all log levels
    const logIgnorer = new LogIgnorer()
    expect(logIgnorer.shouldIgnore(pathMock)).toBe(
        'We are not interested in testing console statements.',
    )
})
