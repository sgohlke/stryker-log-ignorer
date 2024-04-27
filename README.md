# stryker-log-ignorer

Log ignorer plugin for [Stryker][1] JS/TS. Provides functionality to ignore logger calls in Stryker if you do not want to mutation test these logger calls.

## Install

```sh
npm i --save-dev @sgohlke/stryker-log-ignorer
```

TypeScript declarations are provided within the project.

## Configuring

In order to use the plugin you have to add it as **ignorer** and add both the **@stryker-mutator** and **@sgohlke/stryker-log-ignorer** plugins to the Stryker configuration file.

In the optional **logignore** option you can define the object names (i.e. the name of the variable/constant, NOT the name of a Logger class or interface) to be ignored. If no **logignore** option is provided **console** calls will be ignored.

```json
{
    "ignorers": ["log-ignore"],
    "plugins": ["@stryker-mutator/*", "@sgohlke/stryker-log-ignorer"],
    "logignore": {
        "objectNames": ["console", "logger"]
    }
}
```

## Example

Using the **logignore** options shown above we run Stryker. As both **console** and **logger** are defined in the **objectNames** option both lines in the code below will be ignored in the results of the stryker run.

Example code:

```typescript
import { MyFavoriteLogger } from 'some-logger-module'
export function doSomething(): void {
    const logger = new MyFavoriteLogger('loggername')
    console.log('We do something here!')
    // Some imaginary code here!
    logger.info('We finished doing something!')
}
```

In the results you can identify these lines as **ignored**, for example

```typescript
logger.info('We finished doing something!')
logger.info('')
// StringLiteral Ignored
// We are not interested in testing console,logger statements.
```

## Contact

If you have questions or issues please visit our [Issue page](https://github.com/sgohlke/stryker-log-ignorer/issues)
and open a new issue if there are no fitting issues for your topic yet.

## License

stryker-log-ignorer is under [CC0 1.0-License](./LICENSE).

[1]: https://stryker-mutator.io/
