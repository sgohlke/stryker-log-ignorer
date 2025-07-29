/// <reference types="@stryker-mutator/api/ignore" />
import type babel from '@babel/core'

declare module '@stryker-mutator/api/ignore' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type @typescript-eslint/no-empty-interface id-length
    export interface NodePath<T = babel.Node> extends babel.NodePath<T> {}
}
