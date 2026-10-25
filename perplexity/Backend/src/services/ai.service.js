import { ChatGoogle } from "@langchain/google/node";

const model = new ChatGoogle({
  model: "gemini-3.5-flash",
  apiKey: process.env.GEMINI_API_KEY
});

export async function testAI(){
    model.invoke("hello")
    .then((response)=>{
        console.log(response.text)
    })
} 

