'use strict'

const { Api } = require('bfx-wrk-api')
const template = require('./sendgrid.template')

class ExtSendgrid extends Api {
  space (service, msg) {
    const space = super.space(service, msg)
    return space
  }

  async sendEmail (space, msg, cb) {
    const { sgMail } = this.ctx
    const {
      to,
      from,
      subject,
      text
    } = msg

    if (!to) return cb(new Error('ERR_API_NO_TO'))
    if (!from) return cb(new Error('ERR_API_NO_FROM'))
    if (!subject) return cb(new Error('ERR_API_NO_SUBJECT'))
    if (!text) return cb(new Error('ERR_API_NO_TEXT'))

    const html = template(subject, text)

    try {
      const res = await sgMail.send({ ...msg, html })
      cb(null, res && res.length && res[0])
    } catch (e) {
      cb(new Error(`ERR_API_SENDGRID: ${e.toString()}`))
    }
  }
}

module.exports = ExtSendgrid
