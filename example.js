'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')
const mime = require('mime-types')
const Grenache = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const Peer = Grenache.PeerRPCClient

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new Peer(link, {})
peer.init()

const service = 'rest:ext:sendgrid'

function printPeerRequest (action, args, opts) {
  const query = { action, args, opts }
  return new Promise((resolve, reject) => {
    peer.request(service, query, { timeout: 10000 }, (err, data) => {
      if (err) {
        return reject(err)
      }

      console.log(`query ${action} response:`)
      console.log(util.inspect(data, false, null, true))
      console.log('---')
      resolve(data)
    })
  })
}

const pngImage = {
  content: fs.readFileSync(path.join(__dirname, 'test/data/bitfinex.png')).toString('base64'),
  filename: 'bitfinex.png',
  type: mime.contentType('bitfinex.png'),
  disposition: 'attachment'
}
const pdfPaper = {
  content: fs.readFileSync(path.join(__dirname, 'test/data/paper.pdf')).toString('base64'),
  filename: 'paper.pdf',
  type: mime.contentType('paper.pdf'),
  disposition: 'attachment'
}

const msg = {
  to: 'vigan.abd@gmail.com',
  from: { email: 'vigan.abdurrahmani@bitfinex.com', name: 'vigan work' },
  cc: ['vigan.abd@outlook.com'],
  subject: 'Simple documents',
  header: 'An important message',
  text: 'This <strong>email</strong> contains a sample file upload test',
  plaintext: 'This email contains a sample file upload test',
  attachments: [
    pngImage,
    pdfPaper
  ]
}

const encryptedMsg = {
  to: 'vigan.abd@gmail.com',
  from: { email: 'vigan.abdurrahmani@bitfinex.com', name: 'vigan work' },
  cc: ['vigan.abd@outlook.com'],
  subject: 'Sample encrypted email',
  header: 'An important message',
  text: 'This <strong>email</strong> contains an encrypted message',
  plaintext: 'This email contains a sample encrypted message',
  gpgKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----

mQENBF3JIrEBCADLgG1z2NuRx1yi+EGYdgdDMn09cpPLtJG1uMyM03Cf3YmypEwc
FioM49V4GSLbW+baZSsSsZpIsTMRZBU91F8VgK62rYH8lH+48Wmdjd7ZtGXNVGSI
t4p1+TF4YjvIBuLNwJNCw/SbtixvSRXWjrS1WGBSxWYo9BAGaogO28zhVVhHMQzN
FhiuuMATRAUEJ/MmnpRC3GgsimpyMrOYjgwkADWj4H7ozJoT0z9y1Yhx3RGYf+h2
D09LBLDz2fIPkWjRsOsZveU/jv3EzbtBq/qxiPstnVyyUn8mNPeLhfz1IUa/pPMJ
doooXeWffHuNmqRapbd6sGkGbyDEssoHKRY/ABEBAAG0J2RmLWJmeCA8ZGVuaXMu
ZmF0a2h1ZGlub3ZAYml0ZmluZXguY29tPokBTgQTAQgAOBYhBLaZEwfHp32c1y66
GLIQY1zrDiuUBQJdySKxAhsDBQsJCAcCBhUKCQgLAgQWAgMBAh4BAheAAAoJELIQ
Y1zrDiuUf9sIAMqmUThqMIYrcqINvsdZ0QiCSRC/qveunNzz0+V44ch0kZILF9HX
R7syKNI3SZyh87TXEzTo1JdTo0WXOYdDrdP64AIbIClyO3k6AJvckhBdnGiIyAq3
JcNhlSrpjCwd4JkIdTtkcZ18HuvkA9L513TSlP24XC+KJgevUrMHE3I7jRglUeRw
3r9A047vv5BYdnMVJFAVEiXtBwrMya/aco/eT2443ox92w1ob0C9y80FZ3ghXsvt
g4tz719jv5BBXj8XWn4E4RXJRPL1nZ6wuaDUNozZJp52E+Wf2AJ0cv+G/FDUkC6e
4DTIVt6RQWSn84aqis+ozkHKueElOF5cpb+5AQ0EXckisQEIAMR/4atScpUXOyhQ
kKiXTl3WjMoM1WG14eDdvFK8nTrvAGx9/m07BpxGCPXEHFOEmAOyg22fC/9L0Yyv
qW3wCK6zJ9wSM3H1V+gHvFaHrTSzKtDbkLFFu6ojO0HpEHs0qQQhEalBZsHt+Vqr
b9OqZ8QDc/jRZLu3eEjCiFr04IEvT88r6giJ3S8Z+GXOWmEj9AmJGFSmGk4BDGJb
UYk+XPEujPAxDICn3xzrcsORDQPgKb9OkpzRAHn46/mv83ABQfXhT8A1k5bewMiq
iOZcpirPj/LR2d38dRLOyVubPCVep1A7NJyPkQioC+lJAeahUH+0PLT65IvLtQiX
Wu2ZvHcAEQEAAYkBNgQYAQgAIBYhBLaZEwfHp32c1y66GLIQY1zrDiuUBQJdySKx
AhsMAAoJELIQY1zrDiuUcIkH+QE36EsXX/Mebo1K6ki+Srl6xGwlwB/44+ahbfPD
JQJ0jRTlK67yLCHzlPvoKkAXel5EP8wuE5tovwhU+UmbTbfqd6GI5VdkDb9FEHt+
rVopPohesSfDB/12n6ucZyIwD1weYlz/U1JiOLKCIGIpMFwiDP/rQozF+SJ+n3Vi
b/gBVmp0MAngq6QgwvYM6jD43cItqKOCLOKsjqdJSf0Cxm2pRVNWQWtMydqbEvsw
dGIA3duBERLHfWsyi41uO32KsPIAJDlHs33fLl/BTAceC6l2SN4tIvAURX6qL2GS
a9ZPWHL8bq8lW/ulqIDAoGBtwn8cULYZzcDx8EAVkGkN/VA=
=HT7u
-----END PGP PUBLIC KEY BLOCK-----`
}

async function main () {
  await printPeerRequest('sendEmail', [msg])
  await printPeerRequest('sendEncryptedEmail', [encryptedMsg])
}

main()
  .catch(console.error)
  .finally(() => process.exit())
