import { Injectable } from '@nestjs/common';

@Injectable()
export class DocsService {
  async getDocFromUrl(url: string): Promise<any> {
    if (!url.endsWith('.pdf')) {
      throw new Error('Only PDF files are supported');
    }
    const res = await fetch(url, { method: 'GET' });
    const buffer = await res.arrayBuffer();
    return buffer;
  }
}
