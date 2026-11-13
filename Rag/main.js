import dotenv from "dotenv"
dotenv.config()
import { PDFParse } from "pdf-parse";
import fs from "fs"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
})

const index = pc.index("cohort-rag-vectors")

// await pc.createIndex({
//     name: "cohort-rag-vectors",
//     dimension: 3072,          // gemini-embedding-001 output size
//     metric: "cosine",
//     spec: { serverless: { cloud: "aws", region: "us-east-1" } },
//     waitUntilReady: true
// })

// console.log("index ready")

// let dataBuffer = fs.readFileSync("./story.pdf");

// const parser = new PDFParse({
//     data : dataBuffer
// })

// const data = await parser.getText()

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model:"gemini-embedding-001"
})

// const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 500,
//     chunkOverlap:0
// })

// const chunks = await splitter.splitText(data.text)

// const docs = await Promise.all(chunks.map(async (chunk)=> {
//     const embedding = await embeddings.embedQuery(chunk)
//     return {
//         text: chunk,
//         embedding: embedding
//     }
// }))

// const result = await index.upsert({
//     records: docs.map((doc, i) => ({
//         id: `doc-${i}`,
//         values: doc.embedding,
//         metadata:{
//             text: doc.text
//         }
//     }))
// })

const queryEmbedding = await embeddings.embedQuery("how was the internship experience?")

console.log(queryEmbedding);  // embedding dimensions are 3072

const result = await index.query({
    vector: queryEmbedding,
    topK: 2,
    includeMetadata: true
})

console.log(JSON.stringify(result));

