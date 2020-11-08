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
  peer.request(service, query, { timeout: 10000 }, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`query ${action} response:`)
    console.log(util.inspect(data, false, null, true))
    console.log('---')
  })
}

const pngImage = {
  content: fs.readFileSync(path.join(__dirname, 'test/data/bitfinex.png')).toString('base64'),
  filename: 'bitinex.png',
  type: mime.contentType('bitinex.png'),
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
  from: 'vigan.abdurrahmani@bitfinex.com',
  subject: 'Simple documents',
  text: 'This email contains a sample file upload test',
  attachments: [
    pngImage,
    pdfPaper
  ]
}

printPeerRequest('sendEmail', [msg])
