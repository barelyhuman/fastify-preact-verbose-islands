import register from 'preact-custom-element'
import { h } from 'preact'

import { AnyComponent } from 'preact'
import { normalizeRootUrl } from '../../../server/lib/url'

const basePath = 'shared/components'

let inject = (p, prefix="/client") => {}

if (!import.meta.env.CLIENT) {
  inject = (await import('../../../server/lib/build/inject')).inject
}

export function constructIsland<P, S>(
  name: string,
  Component: AnyComponent<P, S>,
  scriptBaseFile
) {
  if (typeof window != 'undefined') {
    register(Component, name)
  }
  return ({ ...props }: P) => {
    return h(
      name,
      { ...props },
      h(Component, { ...props }),
      h('script', {
        type: 'module',
        src: inject(basePath + '/' + scriptBaseFile),
      })
    )
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
  _islandBuild.Island = constructIsland(
    name,
    componentDef,
    componentDef.name.replace(/\d+$/, '') 
  )
  return _islandBuild
}
