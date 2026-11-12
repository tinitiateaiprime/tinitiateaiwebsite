// Loopback-only production build verification. Netlify supplies HTTPS itself.
import https from 'node:https'
import next from 'next'
import { readFile } from 'node:fs/promises'
import { assertStagingEnvironment } from '../../src/lib/staging/environment.mjs'
assertStagingEnvironment()
const app = next({ dev: false, hostname: 'localhost', port: 3200 })
await app.prepare()
https.createServer({ key: await readFile('.staging-private/localhost-key.pem'), cert: await readFile('.staging-private/localhost-cert.pem') }, app.getRequestHandler()).listen(3200, '127.0.0.1', () => console.log('Isolated Neon staging verification: https://localhost:3200'))
