import { inject } from '../lib/build/inject'

export function BaseLayout({ scriptPath, children }) {
  return (
    <html>
      <body>
        {children}
        <script type="module" src={inject(scriptPath)}></script>
      </body>
    </html>
  )
}
