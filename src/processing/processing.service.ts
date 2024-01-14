import { Injectable } from '@nestjs/common';
// import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
@Injectable()
export class ProcessingService {
  gfsBlob: Blob;
  loader: PDFLoader;

  async pdfToLangchainDoc(file) {
    console.log('pdfToLangchainDoc');
    console.log(file);
    console.log(file.buffer);

    this.gfsBlob = new Blob([file.buffer]);
    this.loader = new PDFLoader(this.gfsBlob);
    const docs = await this.loader.load();

    console.log('ProcessingService.pdfToLangchainDoc()', docs);
    // return docs;
  }
}
