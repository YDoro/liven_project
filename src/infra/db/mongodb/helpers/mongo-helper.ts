
import { MongoClient, MongoClientOptions } from 'mongodb'
export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  }
}