import { ChatGoogle } from "@langchain/google/node";

const model = new ChatGoogle({
  model: "gemini-3.7-flash",
  apiKey: process.env.GEMINI_API_KEY
});

export async function testAI(){
    model.invoke("how can i get fast response by you")
    .then((response)=>{
        console.log(response.text)
    })
} 

