'use strict'

const _omit = require('lodash/omit')
const mime = require('mime-types')
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
      html,
      plaintext,
      attachments
    } = msg

    if (!to) return cb(new Error('ERR_API_NO_TO'))
    if (!from) return cb(new Error('ERR_API_NO_FROM'))
    if (!subject) return cb(new Error('ERR_API_NO_SUBJECT'))
    if (!(text || html || plaintext)) return cb(new Error('ERR_API_NO_TEXT_OR_HTML'))
    if (attachments) {
      if (!Array.isArray(attachments)) return cb(new Error('ERR_API_INVALID_ATTACHMENT'))

      for (let i = 0; i < attachments.length; i++) {
        const att = attachments[i]

        if (typeof att !== 'object') {
          return cb(new Error('ERR_API_INVALID_ATTACHMENT_ITEM'))
        }

        if (!att.type || !mime.extension(att.type)) {
          return cb(new Error('ERR_API_INVALID_ATTACHMENT_ITEM_TYPE'))
        }
        if (!att.filename) {
          return cb(new Error('ERR_API_INVALID_ATTACHMENT_ITEM_FILENAME'))
        }
        if (!att.content) {
          return cb(new Error('ERR_API_INVALID_ATTACHMENT_ITEM_CONTENT'))
        }
        if (!att.disposition) att.disposition = 'attachment'
        if (!['attachment', 'inline'].includes(att.disposition)) {
          return cb(new Error('ERR_API_INVALID_ATTACHMENT_ITEM_DISPOSITION'))
        }
      }
    }

    const send = { ..._omit(msg, ['text', 'html', 'plaintext']) }
    if (text) {
      send.text = text // keep backward compatibility
      send.html = this._createTemplate(msg)
    }
    if (plaintext) send.text = plaintext
    if (html) send.html = html

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

    const { subject, text, button, language, header } = msg
    const html = template(subject, text, button, language, header)

    return html
  }
}

module.exports = ExtSendgrid
