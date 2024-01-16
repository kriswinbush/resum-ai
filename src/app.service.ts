import { Injectable } from '@nestjs/common';
import { MongoClient, GridFSBucket, Db } from 'mongodb';
@Injectable()
export class AppService {
  client: MongoClient;
  db: Db;
  gfs: any;
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI, {});
    this.db = this.client.db('barzai');
    this.gfs = new GridFSBucket(this.db, { bucketName: 'uploads' });
  }

  getHello(): any {
    return { message: 'Hello World!' };
  }
}
