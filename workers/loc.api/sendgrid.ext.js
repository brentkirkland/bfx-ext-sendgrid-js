'use strict'

const path = require('path')
const { Api } = require('bfx-wrk-api')

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
      text,
      html
    } = msg

    if (!to) return cb(new Error('ERR_API_NO_TO'))
    if (!from) return cb(new Error('ERR_API_NO_FROM'))
    if (!subject) return cb(new Error('ERR_API_NO_SUBJECT'))
    if (!text && !html) return cb(new Error('ERR_API_NO_TEXT_OR_HTML'))

    const send = (html)
      ? msg
      : this._createTemplate(msg)

    try {
      const res = await sgMail.send(send)
      cb(null, res && res.length && res[0])
    } catch (e) {
      cb(new Error(`ERR_API_SENDGRID: ${e.toString()}`))
    }
  }

  _createTemplate (msg) {
    const tpl = msg.template || this.ctx.conf.defaultTemplate

    const template = require(path.join(__dirname, `../../templates/${tpl}.js`))

    const { subject, text, button, language } = msg
    const html = template(subject, text, button, language)

    return { ...msg, html }
  }
}

module.exports = ExtSendgrid
