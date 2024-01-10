import { Injectable } from '@nestjs/common';
import { MongoClient, GridFSBucket, Db } from 'mongodb';

@Injectable()
export class DocsService {
  client: MongoClient;
  db: Db;
  gfs: GridFSBucket;
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI, {});
    this.db = this.client.db('barzai');
    this.gfs = new GridFSBucket(this.db);
  }

  getMongoDBClient() {
    return this.client;
  }

  getMongoDBGridFSClient() {}

  async getDocFromUrl(url: string): Promise<any> {
    if (!url.endsWith('.pdf')) {
      throw new Error('Only PDF files are supported');
    }
    const res = await fetch(url, { method: 'GET' });
    const buffer = await res.arrayBuffer();
    return buffer;
  }
}
