import {MongoHelper} from'../infra/db/mongodb/helpers/mongo-helper'
require('dotenv').config() //for non docker runnings use a .env file
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = require('./config/app').default
    app.listen(env.port, () => console.log(`Server running on port http://localhost:${env.port}`))
  }).catch(console.error)