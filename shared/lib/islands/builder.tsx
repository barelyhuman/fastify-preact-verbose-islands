import register from 'preact-custom-element'
import { h } from 'preact'

import { AnyComponent } from 'preact'

export function constructIsland<P, S>(
  name: string,
  Component: AnyComponent<P, S>
) {
  if (typeof window != 'undefined') {
    register(Component, name)
  }
  return ({ ...props }: P) => {
    return h(name, { ...props }, h(Component, { ...props }))
  }
}

type IslandComponent<P, S> = AnyComponent<P, S> & {
  Island: AnyComponent<P, S>
}

export function createIslandComponent<P, S>(
  name: string,
  componentDef: AnyComponent<P, S>
): IslandComponent<P, S> {
  let _islandBuild = componentDef as IslandComponent<P, S>
  _islandBuild.Island = constructIsland(name, componentDef)
  return _islandBuild
}
