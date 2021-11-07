import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper' // for non docker runnings use a .env file
import env from './config/env'
require('dotenv').config()

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = require('./config/app').default
    app.listen(env.port, () => console.log(`Server running on port http://localhost:${env.port}`))
  }).catch(console.error)
