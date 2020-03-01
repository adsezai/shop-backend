const app = require('./routes/graphql')

const connection = require('./models/mongo')

app.listen(8080, () => console.log('app running'))
