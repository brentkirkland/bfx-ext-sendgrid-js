/* eslint-env mocha */

'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn

const Grenache = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const Peer = Grenache.PeerRPCClient

const { bootTwoGrapes, killGrapes } = require('./helper')

let rpc, grapes
describe('Integration tests', () => {
  let link
  let peer

  const baseMsg = {
    to: 'denis.fatkhudinov+1@bitfinex.com',
    from: 'denis.fatkhudinov@bitfinex.com',
    subject: 'Sending with SendGrid is Fun',
    header: 'An important message',
    text: 'This <strong>email</strong> contains a sample test',
    plaintext: 'This email contains a sample test'
  }

  before(function (done) {
    this.timeout(20000)
    link = new Link({
      grape: 'http://127.0.0.1:30001'
    })
    link.start()

    peer = new Peer(link, {})
    peer.init()

    bootTwoGrapes((err, g) => {
      if (err) throw err

      grapes = g
      grapes[0].once('announce', (msg) => {
        done()
      })

      const f = path.join(__dirname, '..', 'worker.js')
      rpc = spawn('node', [f, '--env=development', '--wtype=wrk-ext-sendgrid-api', '--apiPort=13371'])
      rpc.stdout.on('data', (d) => {
        console.log(d.toString())
      })
      rpc.stderr.on('data', (d) => {
        console.log(d.toString())
      })
    })
  })

  after(function (done) {
    this.timeout(25000)
    link.stop()
    peer.stop()
    rpc.on('close', () => {
      killGrapes(grapes, done)
    })
    rpc.kill()
  })

  it('Should send an email', (done) => {
    const msg = {
      ...baseMsg,
      attachments: [
        {
          content: fs.readFileSync(path.join(__dirname, 'data/bitfinex.png')).toString('base64'),
          filename: 'bitfinex.png',
          type: 'image/png',
          disposition: 'attachment'
        }
      ]
    }
    const querySendEmail = {
      action: 'sendEmail',
      args: [msg]
    }
    peer.request('rest:ext:sendgrid', querySendEmail, { timeout: 10000 }, (err, data) => {
      if (err) return done(err)
      assert.strictEqual(202, data.statusCode)
      done()
    })
  }).timeout(5000)

  it('Should send an encrypted email', (done) => {
    const msg = {
      ...baseMsg,
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
    const querySendEncryptedEmail = {
      action: 'sendEncryptedEmail',
      args: [msg]
    }
    peer.request('rest:ext:sendgrid', querySendEncryptedEmail, { timeout: 10000 }, (err, data) => {
      if (err) return done(err)
      if (!data.response.includes('Ok: queued')) {
        return done(new Error('Unsuccessful response'))
      }
      done()
    })
  }).timeout(5000)
})
