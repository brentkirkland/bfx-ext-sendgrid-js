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

You will also need to configure the config files to your likings.

You can start with the following:

```
cp config/sendgrid.ext.json.example config/sendgrid.ext.json
cp config/common.json.example config/common.json
cp config/facs/grc.config.json.example config/facs/grc.config.json
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
- args: &lt;Object&gt;
  - `to`: &lt;String&gt;
    - Email to address
  - `from`: &lt;String&gt;
    - Email from address
  - `subject`: &lt;String&gt;
    - Email subject
  - `text`: &lt;String&gt;
    - Email body text version of message when html is not available

**Example Response**

Success:
```js
{ statusCode, headers, request }
```
