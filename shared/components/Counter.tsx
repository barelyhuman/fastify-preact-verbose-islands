import { useState } from 'preact/hooks'
import { createIslandComponent } from '../lib/islands/builder'

export const Counter = createIslandComponent('island-counter', function () {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
})
