/// <reference types="@stryker-mutator/api/ignore" />
import type { Node } from '@babel/types'

declare module '@stryker-mutator/api/ignore' {
  export interface NodePath {
    node: Node
  }
}
