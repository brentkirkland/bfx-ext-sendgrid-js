'use strict'

const { WrkApi } = require('bfx-wrk-api')
const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
const { openpgpEncrypt } = require('nodemailer-openpgp')
const assert = require('assert')
const { normalizeHeader } = require('../lib')

class WrkExtSendgridApi extends WrkApi {
  constructor (conf, ctx) {
    super(conf, ctx)

    this.loadConf('sendgrid.ext', 'ext')
    this.checkConf()

    this.init()
    this.start()
  }

  init () {
    super.init()
  }

  checkConf () {
    const { apiKey } = this.conf.ext

    assert.strictEqual(
      typeof apiKey, 'string',
      'apiKey must be a string, check config/sendgrid.ext.json'
    )
    assert(
      apiKey.length > 0,
      'set apiKey, check config/fx.ext.json'
    )
  }

  getPluginCtx (type) {
    const ctx = super.getPluginCtx(type)
    const { apiKey } = this.conf.ext
    const mailer = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: apiKey
      }
    })
    mailer.use('stream', openpgpEncrypt())

    switch (type) {
      case 'api_bfx':
        ctx.sgMail = sgMail
        ctx.sgMail.setApiKey(apiKey)
        ctx.conf = {
          defaultTemplate: this.conf.ext.defaultTemplate
        }
        ctx.sendEncryptedMail = sendData => {
          for (const header of ['from', 'replyTo', 'sender', 'to', 'cc', 'bcc']) {
            sendData[header] = normalizeHeader(sendData[header])
          }

          return mailer.sendMail(sendData)
        }

        break
    }

    return ctx
  }
}

module.exports = WrkExtSendgridApi
