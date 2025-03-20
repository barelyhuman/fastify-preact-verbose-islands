import fastifyStatic from '@fastify/static'
import fastify from 'fastify'
import path, { dirname } from 'path'
import renderToString from 'preact-render-to-string'
import { fileURLToPath } from 'url'
import { About } from '../shared/components/About'
import { Counter } from '../shared/components/Counter'
import { BaseLayout } from './layout/base.jsx'
import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import { getMetafile } from './lib/build/get-metafile'

const __dirname = dirname(fileURLToPath(import.meta.url))

let loggerOptions = {}
if (process.stdout.isTTY) {
  loggerOptions = {
    transport: {
      target: '@fastify/one-line-logger',
    },
  }
}

const app = fastify({
  logger: loggerOptions,
})

app.register(fastifyCookie)
app.register(fastifyMultipart)

app.register(fastifyStatic, {
  root: path.join(__dirname, './client'),
  prefix: '/client',
})

app.get('/_meta', async (request, reply) => {
  return getMetafile()
})

app.get('/health', async (request, reply) => {
  return { status: 'ok' }
})

app.decorateReply('render', function (vnode) {
  const html = renderToString(vnode)
  this.header('content-type', 'text/html')
  this.send(html)
})

app.get('/', (res, reply) => {
  return reply.render(
    <BaseLayout scriptPath={'client/pages/index.js'}>
      <Counter.Island />
    </BaseLayout>
  )
})

app.get('/about', (res, reply) => {
  return reply.render(
    <BaseLayout scriptPath={'client/pages/about.js'}>
      <About.Island name="reaper" />
    </BaseLayout>
  )
})

const start = async () => {
  try {
    await app.listen({
      port: 3000,
      host: '0.0.0.0',
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
