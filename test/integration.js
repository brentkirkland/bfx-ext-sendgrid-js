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
describe('Sendgrid test', () => {
  before(function (done) {
    this.timeout(20000)

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
    rpc.on('close', () => {
      killGrapes(grapes, done)
    })
    rpc.kill()
  })

  it('Should send an email', (done) => {
    const link = new Link({
      grape: 'http://127.0.0.1:30001'
    })
    link.start()

    const peer = new Peer(link, {})
    peer.init()

    const msg = {
      to: 'brent@bitfinex.com',
      from: 'test@example.com',
      subject: 'Sending with SendGrid is Fun',
      header: 'An important message',
      text: 'This <strong>email</strong> contains a sample file upload test',
      plaintext: 'This email contains a sample file upload test',
      attachments: [
        {
          content: fs.readFileSync(path.join(__dirname, 'data/bitfinex.png')).toString('base64'),
          filename: 'bitfinex.png',
          type: 'image/png',
          disposition: 'attachment'
        }
      ]
    }
    const queryUploadPublic = {
      action: 'sendEmail',
      args: [msg]
    }
    peer.request('rest:ext:sendgrid', queryUploadPublic, { timeout: 10000 }, (err, data) => {
      if (err) return done(err)
      assert.strictEqual(202, data.statusCode)
      done()
    })
  }).timeout(5000)
})
