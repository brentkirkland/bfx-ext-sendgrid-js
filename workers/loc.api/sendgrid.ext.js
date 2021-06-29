'use strict'

const mime = require('mime-types')
const path = require('path')
const { Api } = require('bfx-wrk-api')

class ExtSendgrid extends Api {
  space (service, msg) {
    const space = super.space(service, msg)
    return space
  }

  async sendEmail (space, msg, cb) {
    const validationError = this._validateParams(msg)
    if (validationError) {
      return cb(validationError)
    }
    const { sgMail } = this.ctx
    const { attachments } = msg

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

    const send = this._createSendObj(msg)

    try {
      const res = await sgMail.send(send)
      cb(null, res && res.length && res[0])
    } catch (e) {
      cb(new Error(`ERR_API_SENDGRID: ${e.toString()}`))
    }
  }

  async sendEncryptedEmail (space, msg, cb) {
    const validationError = this._validateParams(msg)
    if (validationError) {
      return cb(validationError)
    }
    if (msg.attachments) {
      return cb(new Error('ERR_API_ATTACHMENT_NOT_ALLOWED'))
    }
    const { gpgKey } = msg
    if (!gpgKey) {
      return cb(new Error('ERR_API_NO_GPG_KEY'))
    }
    const { sendEncryptedMail } = this.ctx

    const send = this._createSendObj(msg)
    send.encryptionKeys = [gpgKey]

    try {
      const res = await sendEncryptedMail(send)
      cb(null, res)
    } catch (e) {
      cb(new Error(`ERR_API_SENDGRID: ${e.toString()}`))
    }
  }

  _createTemplate (msg) {
    const tpl = msg.template || this.ctx.conf.defaultTemplate

    const template = require(path.join(__dirname, `../../templates/${tpl}.js`))

    const { subject, text, button, language, header, from } = msg
    const html = template(subject, text, button, language, header, from)

    return html
  }

  _validateParams ({ to, from, subject, text, html, plaintext } = {}) {
    if (!to) return new Error('ERR_API_NO_TO')
    if (!from) return new Error('ERR_API_NO_FROM')
    if (typeof from === 'object' && !from.email && !from.address) {
      return new Error('ERR_API_NO_FROM')
    }
    if (!subject) return new Error('ERR_API_NO_SUBJECT')
    if (!(text || html || plaintext)) return new Error('ERR_API_NO_TEXT_OR_HTML')
  }

  _createSendObj (msg) {
    const { text, html, plaintext, gpgKey, ...send } = msg
    if (text) {
      send.text = text // keep backward compatibility
      send.html = this._createTemplate(msg)
    }
    if (plaintext) send.text = plaintext
    if (html) send.html = html
    return send
  }
}

module.exports = ExtSendgrid
