require('isomorphic-fetch')
const Sentry = require('@sentry/node')
const {backendConfig} = require('./helpers/loadConfig')

module.exports = function(app, env) {
  app.get('/api/coinswitch/coins', async (req, res) => {
    const APIKey = backendConfig.COINSWITCH_API_KEY
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    try {
      const response = await fetch(`${process.env.COINSWITCH_URL}/v2/coins`, {
        method: 'GET',
        headers: {
          'x-api-key': APIKey,
          'x-user-ip': ip,
        },
      })
      if (response.status === 200) {
        const body = await response.json()
        if (body.success) {
          const coins = body.data
            .filter((coin) => coin.isActive && !coin.isFiat)
            .map((coin) => ({name: coin.name, symbol: coin.symbol}))
          return res.json({
            Right: coins,
          })
        }
        return res.json({
          statusCode: response.status,
          Left: {
            code: body.code,
          },
        })
      }
      return res.json({
        statusCode: response.status,
        Left: {
          code: 'Unexpected error',
        },
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Getting coins from CoinSwitch failed with an unexpected error: ${err.stack}`)
      Sentry.captureException(err)
      return res.json({
        Left: 'An unexpected error has occurred',
      })
    }
  })

  app.post('/api/coinswitch/pairs', async (req, res) => {
    const APIKey = backendConfig.COINSWITCH_API_KEY
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const {depositCoin} = req.body

    try {
      const response = await fetch(`${process.env.COINSWITCH_URL}/v2/pairs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': APIKey,
          'x-user-ip': ip,
        },
        body: JSON.stringify({depositCoin}),
      })
      if (response.status === 200) {
        const body = await response.json()
        if (body.success) {
          const pairs = body.data
            .filter((pair) => pair.isActive)
            .map((pair) => pair.destinationCoin)
          return res.json({
            Right: pairs,
          })
        }
        return res.json({
          statusCode: response.status,
          Left: {
            code: body.code,
          },
        })
      }
      return res.json({
        statusCode: response.status,
        Left: {
          code: 'Unexpected error',
        },
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        `Getting pairs from CoinSwitch for depositCoin ${depositCoin} failed with an unexpected error: ${err.stack}`
      )
      Sentry.captureException(err)
      return res.json({
        Left: 'An unexpected error has occurred',
      })
    }
  })

  app.post('/api/coinswitch/rate', async (req, res) => {
    const APIKey = backendConfig.COINSWITCH_API_KEY
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const {depositCoin, destinationCoin} = req.body

    try {
      const response = await fetch(`${process.env.COINSWITCH_URL}/v2/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': APIKey,
          'x-user-ip': ip,
        },
        body: JSON.stringify({
          depositCoin,
          destinationCoin,
        }),
      })
      if (response.status === 200) {
        const body = await response.json()
        if (body.success) {
          return res.json({
            Right: body.data,
          })
        }
        return res.json({
          statusCode: response.status,
          Left: {
            code: body.code,
          },
        })
      }
      return res.json({
        statusCode: response.status,
        Left: {
          code: 'Unexpected error',
        },
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        `Getting rate from CoinSwitch for pair ${depositCoin}-${destinationCoin} failed with an unexpected error: ${err.stack}`
      )
      Sentry.captureException(err)
      return res.json({
        Left: 'An unexpected error has occurred',
      })
    }
  })
}
