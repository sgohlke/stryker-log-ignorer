import { StrykerOptions } from '@stryker-mutator/api/core'
import { Ignorer, NodePath } from '@stryker-mutator/api/ignore'
import {
    Injector,
    PluginContext,
    PluginKind,
    commonTokens,
    declareFactoryPlugin,
    tokens,
} from '@stryker-mutator/api/plugin'
import fs from 'node:fs'

/**
 * Configuration for @sgohlke/stryker-log-ignorer
 */
interface IgnorerOptions {
    /**
     * Specify the object names of the logger objects to be ignored. Defaults to ["console"]
     */
    objectNames?: string[]
}

interface LogIgnorerOptions extends StrykerOptions {
    logignore?: IgnorerOptions
}

/*
 * LogIgnorer provides functionality to ignore log calls for provided logger object names.
 */
class LogIgnorer implements Ignorer {
    public static inject = [commonTokens.options] as const
    protected readonly options?: IgnorerOptions

    constructor(options?: Partial<LogIgnorerOptions>) {
        this.options = options?.logignore
    }

    shouldIgnore(path: NodePath): string | undefined {
        const loggerObjectNames = this.options?.objectNames ?? ['console']
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

function logIgnorerFactory(injector: Injector<PluginContext>): LogIgnorer {
    return injector.injectClass(LogIgnorer)
}

function createLogIgnorerFactory(): {
    (injector: Injector<PluginContext>): LogIgnorer
    inject: ['$injector']
} {
    return logIgnorerFactory
}

const strykerPlugins = [
    declareFactoryPlugin(
        PluginKind.Ignore,
        'log-ignore',
        createLogIgnorerFactory(),
    ),
]

const strykerValidationSchema: typeof import('../schema/log-ignorer-options.json') =
    JSON.parse(
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.readFileSync(
            new URL('../schema/log-ignorer-options.json', import.meta.url),
            'utf8',
        ),
    )

export {
    IgnorerOptions,
    LogIgnorer,
    LogIgnorerOptions,
    createLogIgnorerFactory,
    logIgnorerFactory,
    strykerPlugins,
    strykerValidationSchema,
}
