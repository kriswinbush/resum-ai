import { Injectable } from '@nestjs/common';
import { MongoClient, GridFSBucket, Db, ObjectId } from 'mongodb';
import * as fs from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';

@Injectable()
export class DocsService {
  client: MongoClient;
  db: Db;
  gfs: any;
  pipelineAsync = promisify(pipeline);
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI, {});
    this.db = this.client.db('barzai');
    this.gfs = new GridFSBucket(this.db, { bucketName: 'uploads' });
  }

  async getFile(id: string) {
    return await this.gfs.openDownloadStream(new ObjectId(id));
  }

  async getFilesInfo() {
    const cursor = this.gfs.find({});
    const response = [];
    for await (const doc of cursor) {
      response.push(doc);
    }
    return response;
  }

  async deleteFile(id: string) {
    return await this.gfs.delete(new ObjectId(id));
  }

  uploadFile(file: any) {
    console.log('DocsService.uploadFile()', file);
    return this.pipelineAsync(
      fs.createReadStream(file.path),
      this.gfs.openUploadStream(file.filename, {
        chunkSizeBytes: 1048576,
        metadata: {
          contentType: file.mimetype,
          filename: file.originalname,
          test: 'test data on metadata',
        },
      }),
    );
  }
  // 'https://arxiv.org/pdf/2401.02385.pdf',
  async getDocFromUrl(url: string): Promise<any> {
    if (!url.endsWith('.pdf')) {
      throw new Error('Only PDF files are supported');
    }
    const res = await fetch(url, { method: 'GET' });
    const buffer = await res.arrayBuffer();
    return buffer;
  }
}
