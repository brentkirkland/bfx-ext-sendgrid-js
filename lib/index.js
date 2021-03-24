'use strict'

function normalizeObj (el) {
  if (typeof el === 'object' && el.email) {
    return {
      name: el.name,
      address: el.email
    }
  }

  return el
}

function normalizeHeader (headerValue) {
  if (!headerValue) return

  // to, cc, bcc
  if (Array.isArray(headerValue)) {
    return headerValue.map(normalizeObj)
  }

  // from, replyTo, sender
  return normalizeObj(headerValue)
}

module.exports = {
  normalizeHeader
}
