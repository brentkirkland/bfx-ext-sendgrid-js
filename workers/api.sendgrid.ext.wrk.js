'use strict'

const { WrkApi } = require('bfx-wrk-api')
const sgMail = require('@sendgrid/mail')
const assert = require('assert')

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

    assert.equal(
      typeof apiKey, 'string',
      'apiKey must be a string, check config/sendgrid.ext.json'
    )
    assert(
      apiKey.length > 0,
      'set apiKey, check config/fx.ext.json'
    )
  }

  getApiConf () {
    return {
      path: 'sendgrid.ext'
    }
  }

  getPluginCtx (type) {
    const ctx = super.getPluginCtx(type)
    const { apiKey } = this.conf.ext

    switch (type) {
      case 'api_bfx':
        ctx.sgMail = sgMail
        ctx.sgMail.setApiKey(apiKey)
        ctx.conf = {
          defaultTemplate: this.conf.ext.defaultTemplate
        }

        break
    }

    return ctx
  }
}

module.exports = WrkExtSendgridApi
