import { ChatGoogle } from "@langchain/google/node";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent} from "langchain"
import * as z from "zod"
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogle({
  model: "gemini-flash-lite-latest",
  apiKey: process.env.GEMINI_API_KEY
});

const searchInternetTool = tool(
  searchInternet,
  {
    name:"searchInternet",
    description:"useful for when you need to answer questions about current events or the world. Input should be a search query and the output will be the search results.",
    schema: z.object({
      query: z.string().describe("the search query to use for searching the internet")
    })
  }
)

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool]
})

export async function generateResponse(messages) {
  const response = await agent.invoke({
      messages: messages.map(msg => {
    if (msg.role == "user") {
      return new HumanMessage(msg.content)
    } else if (msg.role == "ai") {
      return new AIMessage(msg.content)
    }
  })
})

  return response.messages[response.messages.length - 1].text
}

export async function generateChatTitle(message) {
  const response = await geminiModel.invoke([
    new SystemMessage(`you are a helpful assistant that generates a title for a chat based on the following message:
        
        user will provide you with a message and you will generate a title for the chat based on that message. The title should be concise, clear, and relevant to the content of the message. Please provide the title in a single line without any additional text or formatting.
        `),
    new HumanMessage(`generate a title for the following message: ${message}`)
  ])

  return response.text
}