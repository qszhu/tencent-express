require('tencent-component-monitor')
const fs = require('fs')
const path = require('path')
const { createServer, proxy } = require('tencent-serverless-http')

const express = require('express')
const { NestFactory } = require('@nestjs/core')
const { ExpressAdapter } = require('@nestjs/platform-express')

let server

exports.handler = async (event, context) => {
  const userSls = path.join(__dirname, '..', 'sls.js')
  let app
  if (fs.existsSync(userSls)) {
    // load the user provided app
    app = require(userSls)
  } else {
    // load the built-in default app
    app = require('./sls.js')
  }

  const expressApp = express()

  // attach event and context to request
  expressApp.request.__SLS_EVENT__ = event
  expressApp.request.__SLS_CONTEXT__ = context

  const nestApp = await NestFactory.create(app, new ExpressAdapter(expressApp))
  await nestApp.init()

  // cache server, not create repeatly
  if (!server) {
    server = createServer(expressApp, null, app.binaryTypes || [])
  }

  context.callbackWaitsForEmptyEventLoop =
    app.callbackWaitsForEmptyEventLoop === true ? true : false

  // provide sls intialize hooks
  if (app.slsInitialize && typeof app.slsInitialize === 'function') {
    await app.slsInitialize()
  }

  const result = await proxy(server, event, context, 'PROMISE')
  return result.promise
}
