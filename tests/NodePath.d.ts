/// <reference types="@stryker-mutator/api/ignore" />
import type babel from '@babel/core'

declare module '@stryker-mutator/api/ignore' {
    export interface NodePath<T = babel.Node> extends babel.NodePath<T> {}
}
