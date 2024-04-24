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
import fs from 'node:fs'

/**
 * We define the necessary functions and fields for NodePath to be able to provide type safety
 * in our code.
 */
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

/**
 * Configuration for @sgohlke/stryker-log-ignorer
 */
export interface IgnorerOptions {
    /**
     * Specify the object names of the logger objects to be ignored. Defaults to ["console"]
     */
    objectNames?: string[]
}

export interface LogIgnorerOptions extends StrykerOptions {
    logignore: IgnorerOptions
}

/*
 * LogIgnorer provides functionality to ignore log calls for provides logger object names.
 */
export class LogIgnorer implements Ignorer {
    public static inject = [commonTokens.logger, commonTokens.options] as const
    protected readonly options: LogIgnorerOptions

    constructor(
        // eslint-disable-next-line @typescript-eslint/parameter-properties
        private readonly log?: Logger,
        options?: StrykerOptions,
    ) {
        this.options = options as LogIgnorerOptions
    }

    shouldIgnore(path: NodePath): string | undefined {
        const loggerObjectNames = this.options?.logignore?.objectNames ?? [
            'console',
        ]
        if (
            path.isExpressionStatement() &&
            path.node.expression.type === 'CallExpression' &&
            path.node.expression.callee.type === 'MemberExpression' &&
            path.node.expression.callee.object.type === 'Identifier' &&
            loggerObjectNames.includes(path.node.expression.callee.object.name)
        ) {
            return `We are not interested in testing ${loggerObjectNames} statements.`
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

export const strykerPlugins = [
    declareFactoryPlugin(
        PluginKind.Ignore,
        'log-ignore',
        createLogIgnorerFactory(),
    ),
]

export const strykerValidationSchema: typeof import('../schema/log-ignorer-options.json') =
    JSON.parse(
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.readFileSync(
            new URL('../schema/log-ignorer-options.json', import.meta.url),
            'utf8',
        ),
    )
