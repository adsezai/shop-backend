const config = require('config')
const PORT = config.get('server.port')

const app = require('./graphql/graphql')

const connection = require('./models/mongo')

app.listen(PORT, () => console.log(`Winter is coming, on port ${PORT}`))
