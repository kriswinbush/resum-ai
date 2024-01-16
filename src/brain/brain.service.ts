import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { ProcessingService } from 'src/processing/processing.service';
import { MongoDBAtlasVectorSearch } from '@langchain/community/vectorstores/mongodb_atlas';
import { StringOutputParser } from 'langchain/schema/output_parser';
@Injectable()
export class BrainService {
  vectorStore: MongoDBAtlasVectorSearch;
  llm: ChatOpenAI;
  tweetTemplate: string =
    'Generate a promotional tweet for a product, from this product description: {productDesc}';
  constructor(private readonly processingService: ProcessingService) {
    const { collection, embeddings } = this.processingService;

    this.llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
      temperature: 0.9, // Default value if omitted is 0.9
      maxTokens: 200, // Default value if omitted is 200
      topP: 1, // Default value if omitted is 1
      frequencyPenalty: 0, // Default value if omitted is 0
      presencePenalty: 0, // Default value if omitted is 0
      stop: ['\n'], // Default value if omitted is ['\n']
    });

    this.vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: 'default', // The name of the Atlas search index. Defaults to "default"
      textKey: 'text', // The name of the collection field containing the raw content. Defaults to "text"
      embeddingKey: 'embedding',
    });
  }

  async run() {
    console.log('BrainService.run()');
    const tweetPrompt = this.createPrompt(this.tweetTemplate);
    const tweetChain = tweetPrompt.pipe(this.llm);
    const response = await tweetChain.invoke({
      productDesc: 'Eel skin work boots',
    });
    console.log(response);
  }

  async getStandAloneQuestion(question: string) {
    const retriever = this.vectorStore.asRetriever();
    const template =
      'Given a question, convert it to a stand-alone question: {question} standalone question: ';
    const prompt = PromptTemplate.fromTemplate(template);
    const chain = prompt
      .pipe(this.llm)
      .pipe(new StringOutputParser())
      .pipe(retriever);

    const response = await chain.invoke({ question });
    return response;
  }

  async getMatchingDocsVectorsFromMongoDBVectorStore() {
    const retriever = this.vectorStore.asRetriever();
    const res = await retriever.invoke('when did Kristen work for Sony?');
    console.log(res);
    return res;
  }

  createPrompt(template: string): PromptTemplate {
    return PromptTemplate.fromTemplate(template);
  }
}
