import { StrykerOptions } from '@stryker-mutator/api/core'
import { Ignorer } from '@stryker-mutator/api/ignore'
import { Logger } from '@stryker-mutator/api/logging'
import {
    commonTokens,
    declareFactoryPlugin,
    Injector,
    PluginContext,
    PluginKind,
    tokens,
} from '@stryker-mutator/api/plugin'

export interface NodePath {
    isExpressionStatement(): boolean
    node: {
        expression: {
            type: string
            callee: {
                type: string
                object: {
                    type: string
                    name: string
                }
            }
        }
    }
}

export interface LogIgnorerOptions extends StrykerOptions {
    loggerClass?: string
}

export class LogIgnorer implements Ignorer {
    public static inject = [commonTokens.logger, commonTokens.options] as const
    private readonly options: LogIgnorerOptions

    constructor(
        // eslint-disable-next-line @typescript-eslint/parameter-properties
        private readonly log?: Logger,
        options?: StrykerOptions,
    ) {
        this.options = options as LogIgnorerOptions
    }

    shouldIgnore(path: NodePath): string | undefined {
        const loggerClass = this.options?.loggerClass ?? 'console'
        this.log?.debug(
            'LogIgnore Plugin. Path is: ',
            JSON.stringify(path.node),
        )
        if (
            path.isExpressionStatement() &&
            path.node.expression.type === 'CallExpression' &&
            path.node.expression.callee.type === 'MemberExpression' &&
            path.node.expression.callee.object.type === 'Identifier' &&
            path.node.expression.callee.object.name === loggerClass
        ) {
            return `We are not interested in testing ${loggerClass} statements.`
        }
    }
}

logIgnorerFactory.inject = tokens(commonTokens.injector)

export function logIgnorerFactory(
    injector: Injector<PluginContext>,
): LogIgnorer {
    return injector.injectClass(LogIgnorer)
}

export function createLogIgnorerFactory(): {
    (injector: Injector<PluginContext>): LogIgnorer
    inject: ['$injector']
} {
    return logIgnorerFactory
}

const createLogIgnorer = createLogIgnorerFactory()
export const strykerPlugins = [
    declareFactoryPlugin(PluginKind.Ignore, 'log-ignore', createLogIgnorer),
]
