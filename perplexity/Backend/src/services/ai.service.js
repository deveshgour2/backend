import { ChatGoogle } from "@langchain/google/node";
import { HumanMessage, SystemMessage, AIMessage } from "langchain"

const model = new ChatGoogle({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

export async function generateResponse(messages) {
  const response = await model.invoke(messages.map(msg => {
    if (msg.role == "user") {
      return new HumanMessage(msg.content)
    } else if (msg.role == "ai") {
      return new AIMessage(msg.content)
    }
  }))

  return response.text
}

export async function generateChatTitle(message) {
  const response = await model.invoke([
    new SystemMessage(`you are a helpful assistant that generates a title for a chat based on the following message:
        
        user will provide you with a message and you will generate a title for the chat based on that message. The title should be concise, clear, and relevant to the content of the message. Please provide the title in a single line without any additional text or formatting.
        `),
    new HumanMessage(`generate a title for the following message: ${message}`)
  ])

  return response.text
}