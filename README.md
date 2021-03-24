# bfx-ext-sendgrid-js

## Install

Enter the following to clone and install:

```
git clone https://github.com/bitfinexcom/bfx-ext-sendgrid-js
cd bfx-ext-sendgrid-js
npm install
```

## Setup

The project inherits code from a base repository.

The base / root project is: https://github.com/bitfinexcom/bfx-ext-js

Add it with:

```
git remote add upstream https://github.com/bitfinexcom/bfx-ext-js
```

You will also need to configure the config files to your likings. This can be done by simply running:
```
bash setup-config.sh
```

## Run

If you have not already you need to globally install [Grenache Grape](https://github.com/bitfinexcom/grenache-grape).

```
npm install -g grenache-grape
```

Then run two grapes:

```
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

Next start a worker:

```
node worker.js --env=development --wtype=wrk-ext-sendgrid-api --apiPort 1338
```

Finally see if everything is properly working by running the example:

```
node example.js
```

## Grenache API

### action: 'sendEmail'
- `msg`: &lt;Object&gt;
  - `from`: &lt;String|Object&gt; - Email from address, string or object with fields {`name`: &lt;String&gt;, `email `: &lt;String&gt;}
  - `to`: &lt;String|String[]|Object|Object[]&gt; - Email to address, string or object with fields {`name`: &lt;String&gt;, `email `: &lt;String&gt;}. Could be also array of string or object with fields mentioned
  - `cc`: &lt;String|String[]|Object|Object[]&gt; - Optional, email cc addresses, string or object with fields {`name`: &lt;String&gt;, `email `: &lt;String&gt;}. Could be also array of string or object with fields mentioned
  - `bcc`: &lt;String|String[]|Object|Object[]&gt; - Optional, email cc addresses, string or object with fields {`name`: &lt;String&gt;, `email `: &lt;String&gt;}. Could be also array of string or object with fields mentioned
  - `subject`: &lt;String&gt; - Email subject
  - `header`: &lt;String&gt; - Optional, email header to be used. If omitted, `subject` is used as base for the email header.
  - `text`: &lt;String&gt; - Optional, bitfinex email template body section. If present alongside `plaintext` content, text/html content would be rendered html template with body section from `text` field and text/plain content would be value of `plaintext` field!
  - `html`: &lt;String&gt; - Optional, email html content. If present with `text` field then text/html content would be value of `html` but text/plain would be value of `text`!
  - `plaintext`: &lt;String&gt; - Optional, email plain text content. At least one of `text`, `html` or `plaintext` should be included!
  - `button`: &lt;Object&gt; - Optional, email button, when `html` is provided it's ignored
    - `url`: &lt;String&gt; - Button url
    - `text`: &lt;String&gt; - Button text
  - `language`: &lt;String&gt; - Optional, template language, when `html` is provided it's ignored
  - `attachments`: &lt;Array&gt; - Optional
    - `0`: &lt;Object&gt;
      - `content`: &lt;String&gt; - Base64 content of the attachment
      - `filename`: &lt;String&gt; - File name of the attachment, e.g. `attachment.pdf`
      - `type`: &lt;String&gt; - Mime type of the attachment, e.g. `application/pdf`
      - `disposition`: &lt;String&gt; - Content disposition, allowed types: `attachment` and `inline`
      - `content_id`: &lt;String&gt; - Optional, required only if `disposition=inline`

**Example Response**

Success:
```js
{ statusCode, headers, request }
```

### action: 'sendEncryptedEmail'
- `msg`: &lt;Object&gt;
  - `from`: &lt;String|Object&gt; - Email from address, string or object with fields {`name`: &lt;String&gt;, `email `: &lt;String&gt;}
  - `to`: &lt;String|String[]|Object|Object[]&gt; - Email to address, string or object with fields {`name`: &lt;String&gt;, `email `: &lt;String&gt;}. Could be also array of string or object with fields mentioned
  - `cc`: &lt;String|String[]|Object|Object[]&gt; - Optional, email cc addresses, string or object with fields {`name`: &lt;String&gt;, `email `: &lt;String&gt;}. Could be also array of string or object with fields mentioned
  - `bcc`: &lt;String|String[]|Object|Object[]&gt; - Optional, email cc addresses, string or object with fields {`name`: &lt;String&gt;, `email `: &lt;String&gt;}. Could be also array of string or object with fields mentioned
  - `subject`: &lt;String&gt; - Email subject
  - `header`: &lt;String&gt; - Optional, email header to be used. If omitted, `subject` is used as base for the email header.
  - `text`: &lt;String&gt; - Optional, bitfinex email template body section. If present alongside `plaintext` content, text/html content would be rendered html template with body section from `text` field and text/plain content would be value of `plaintext` field!
  - `html`: &lt;String&gt; - Optional, email html content. If present with `text` field then text/html content would be value of `html` but text/plain would be value of `text`!
  - `plaintext`: &lt;String&gt; - Optional, email plain text content. At least one of `text`, `html` or `plaintext` should be included!
  - `button`: &lt;Object&gt; - Optional, email button, when `html` is provided it's ignored
    - `url`: &lt;String&gt; - Button url
    - `text`: &lt;String&gt; - Button text
  - `language`: &lt;String&gt; - Optional, template language, when `html` is provided it's ignored
  - `gpgKey`: &lt;String&gt; - Required, public GPG key to encrypt message with

**Example Response**

Success:
```js
{
  accepted: [ 'denis.fatkhudinov+1@bitfinex.com' ],
  rejected: [],
  envelopeTime: 250,
  messageTime: 160,
  messageSize: 24083,
  response: '250 Ok: queued as bhS31FKfRpu2fDUjbl468A',
  envelope: {
    from: 'denis.fatkhudinov@bitfinex.com',
    to: [ 'denis.fatkhudinov+1@bitfinex.com' ]
  },
  messageId: '<409bf1b2-a171-51f8-df15-730872d2107b@bitfinex.com>'
}
```
