'use strict'

const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const translationsFile = path.join(__dirname, 'translate.yml')
const translations = yaml.safeLoad(fs.readFileSync(translationsFile, 'utf8'))

const prettyEmail = (subject, text, button, language) => {
  const htmlHeader = _getHtmlHeader(subject)
  const htmlButton = _getHtmlEmailButtonText(button)
  const t = _getTranslations(language)
  const html = `
  <div marginwidth="0" marginheight="0" style="margin:0;padding:0;background-color:#363636;min-height:100%!important;width:100%!important">
    <center>
      <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="border-collapse:collapse;margin:0;padding:0;background-color:#D4D4D4;height:100%!important;width:100%!important">
        <tbody>
          <tr>
            <td align="center" valign="top" style="margin:0;padding:0;border-top:0;height:100%!important;width:100%!important">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                <tbody>
                  <tr>
                    <td align="center" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#eeeeee;border-top:0;border-bottom:0">
                        <tbody>
                          <tr>
                            <td align="center" valign="top">
                              <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse">
                                <tbody>
                                  <tr>
                                    <td valign="top" style="padding-top:15px;padding-bottom:10px">
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                        <tbody>
                                          <tr>
                                            <td valign="top" style="padding:9px">
                                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                                                <tbody>
                                                  <tr>
                                                    <td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center">
                                                      <a href="https://www.bitfinex.com" title="Bitfinex" target="_blank"><img align="center" alt="Bitfinex" src="https://www.bitfinex.com/assets/logo3.png" width="230" style="max-width:230px;padding:10px;display:inline!important;vertical-align:bottom;border:0;outline:none;text-decoration:none" ></a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#eeeeee;border-top:0;border-bottom:0">
                        <tbody>
                          <tr>
                            <td align="center" valign="top" style="padding-top:10px;padding-right:10px;padding-left:10px">
                              <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse">
                                <tbody>
                                  <tr>
                                    <td align="center" valign="top">
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#ffffff;">
                                        <tbody>
                                          <tr>
                                            <td valign="top" style="padding-top:10px;padding-bottom:10px">

                                              <!--email title-->
                                              ${htmlHeader}

                                              <!--main email body-->
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                <tbody>
                                                  <tr>
                                                    <td valign="top">
                                                      <table align="left" border="0" cellpadding="0" cellspacing="0" width="599" style="border-collapse:collapse">
                                                        <tbody>
                                                          <tr>
                                                            <td valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#606060;font-family:Helvetica;font-size:15px;line-height:150%;text-align:left">
                                                              ${text}
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>

                                              ${htmlButton}

                                              <!--email signiture-->
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                <tbody>
                                                  <tr>
                                                    <td valign="top">
                                                      <table align="left" border="0" cellpadding="0" cellspacing="0" width="599" style="border-collapse:collapse">
                                                        <tbody>
                                                          <tr>
                                                            <td valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#999999;font-family:Helvetica;font-size:13px;line-height:150%;text-align:left">
                                                              ${t.user_mailer.template.regards}, <br/>
                                                              The Bitfinex Team <br/>
                                                              <a href='https://www.bitfinex.com' style='word-wrap:break-word;color:#BABABA;font-weight:normal;text-decoration:none;' target='_blank'>
                                                                https://www.bitfinex.com
                                                              </a>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>

                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" valign="top" style="padding-bottom:40px">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#D4D4D4;border-bottom:0">
                        <tbody>
                          <tr>
                            <td align="center" valign="top">
                              <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse">
                                <tbody>
                                  <tr>
                                    <td valign="top" style="padding-top:10px;padding-bottom:10px">
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                        <tbody>
                                          <tr>
                                            <td valign="top">
                                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse">
                                                <tbody>
                                                  <tr>
                                                    <td valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;color:#999999;font-family:Helvetica;font-size:11px;line-height:125%;text-align:center">
                                                      ${t.user_mailer.template.apps}
                                                      <br>
                                                      <a href="https://itunes.apple.com/us/app/bitfinex/id1436383182?ls=1&mt=8" title="${t.user_mailer.template.apple}" target="_blank">
                                                        <img align="center" alt="${t.user_mailer.template.apple}" src="https://www.bitfinex.com/assets/appstore.png" width="135" style="max-width:135px;padding:10px;display:inline!important;vertical-align:bottom;border:0;outline:none;text-decoration:none" >
                                                      </a>
                                                      <a href="https://play.google.com/store/apps/details?id=com.bitfinex.mobileapp&hl=en" title="${t.user_mailer.template.goog}" target="_blank">
                                                        <img align="center" alt="${t.user_mailer.template.goog}" src="https://www.bitfinex.com/assets/play.png" width="135" style="max-width:135px;padding:10px;display:inline!important;vertical-align:bottom;border:0;outline:none;text-decoration:none" >
                                                      </a>
                                                      <br>
                                                      <a href="https://www.bitfinex.com/app" style="word-wrap:break-word;color:#999999;font-weight:normal;text-decoration:underline" target="_blank">
                                                        ${t.user_mailer.template.read_more}
                                                      </a>
                                                      <br>
                                                      <br>
                                                      <em>Copyright © 2013-${new Date().getFullYear()} iFinex Inc. All rights reserved.</em>
                                                      <br>
                                                      <br>
                                                      ${t.user_mailer.template.settings}<br>
                                                      ${t.user_mailer.template.update}
                                                        <a href="https://www.bitfinex.com/account" style="word-wrap:break-word;color:#999999;font-weight:normal;text-decoration:underline" target="_blank">
                                                          ${t.user_mailer.template.update2}
                                                        </a>
                                                      ${t.user_mailer.template.update3}
                                                      <br>
                                                      ${t.user_mailer.template.disable_html}
                                                      <a href="https://www.bitfinex.com/anti_spam" style="word-wrap:break-word;color:#999999;font-weight:normal;text-decoration:underline" target="_blank">
                                                        ${t.user_mailer.template.anti_spam}
                                                      </a>.
                                                      <br><br><br><br><br><br><br><br>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </center>
  </div>`

  return html
}

function _getTranslations (language) {
  if (language && translations[language]) return translations[language]
  return translations.en
}

function _getHtmlHeader (header) {
  if (!header) return ''

  const html = `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
      <tbody>
          <tr>
              <td valign="top">
                  <table align="left" border="0" cellpadding="0" cellspacing="0" width="599" style="border-collapse:collapse">
                      <tbody>
                          <tr>
                              <td valign="top" style="padding:9px 18px;color:#000000;text-align:left;font-family:Helvetica;font-size:15px;line-height:150%">
                                  <h1 style="text-align:left;margin:0;padding:0;display:block;font-family:Helvetica;font-style:normal;font-weight:lighter;line-height:100%;color:#425db4!important">
                                    <span style="font-size:24px;color:#a6a6a6">
                                      ${header}
                                    </span>
                                  </h1>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
      </tbody>
  </table>`

  return html
}

function _getHtmlEmailButtonText (button) {
  if (!(button && button.url && button.text)) return ''

  const html = `
  <!--big button-->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
    <tbody>
      <tr>
        <td style="padding-top:20px;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate!important;border:1px solid #e5e5e5;border-radius:2px;background-color:#f5f5f5">
            <tbody>
              <tr>
                <td align="center" valign="middle" style="font-family:Arial;font-size:12px;">
                  <a href="${button.url}" target="_blank" style="padding:10px;letter-spacing:.7;line-height:100%;text-align:center;text-decoration:none;color:#4995c4;text-transform:uppercase;word-wrap:break-word;display:block">
                    ${button.text}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`

  return html
}

module.exports = prettyEmail
