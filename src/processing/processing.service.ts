import { Injectable } from '@nestjs/common';
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
// import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { MongoDBAtlasVectorSearch } from '@langchain/community/vectorstores/mongodb_atlas';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoClient, GridFSBucket, Db, Collection } from 'mongodb';
import { Document } from 'langchain/document';

@Injectable()
export class ProcessingService {
  client: MongoClient;
  db: Db;
  collection: Collection<any>;
  gfs: any;
  vectorStore: MongoDBAtlasVectorSearch; // cant be shared
  embeddings: OpenAIEmbeddings;
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI, {});
    this.db = this.client.db('barzai');
    this.collection = this.db.collection('embed');
    this.gfs = new GridFSBucket(this.db, { bucketName: 'uploads' });
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
      batchSize: 512, // Default value if omitted is 512. Max is 2048
    });
  }
  // move inside function const share this
  gfsBlob: Blob;
  loader: WebPDFLoader;

  async pdfToLangchainDoc(file): Promise<Document<Record<string, any>>[]> {
    console.log('pdfToLangchainDoc');
    console.log(file);
    console.log(file.buffer);

    this.gfsBlob = new Blob([file.buffer]);
    this.loader = new WebPDFLoader(this.gfsBlob, {
      parsedItemSeparator: ' ',
    });
    console.log('ProcessingService.pdfToLangchainDoc()');
    return await this.loader.load();
  }

  async embedDocsToMongoDBVectorStore(docs: Document<Record<string, any>>[]) {
    console.log(docs);
    // const collection = this.db.collection('embed');
    this.vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
      docs,
      this.embeddings,
      {
        collection: this.collection,
        indexName: 'default', // The name of the Atlas search index. Defaults to "default"
        textKey: 'text', // The name of the collection field containing the raw content. Defaults to "text"
        embeddingKey: 'embedding', // The name of the collection field containing the embedded text. Defaults to "embedding"
      },
    );
    console.log(this.vectorStore);
  }
}
