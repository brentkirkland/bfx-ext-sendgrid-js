'use strict'

const { Api } = require('bfx-wrk-api')
const _ = require('lodash')

class ExtSendgrid extends Api {
  space (service, msg) {
    const space = super.space(service, msg)
    return space
  }
}

module.exports = ExtSendgrid
