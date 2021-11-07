import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env' // for non docker runnings use a .env file

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = require('./config/app').default
    app.listen(env.port, () => console.log(`Server running on port http://localhost:${env.port}`))
  }).catch(console.error)
