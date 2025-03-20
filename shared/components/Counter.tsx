import { useState } from 'preact/hooks'
import { createIslandComponent } from '../lib/islands/builder.tsx'

export const Counter = createIslandComponent(
  'island-counter',
  function Counter() {
    const [count, setCount] = useState(0)
    return <button onClick={() => setCount(count + 1)}>{count}</button>
  }
)
