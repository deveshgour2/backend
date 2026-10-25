import "dotenv/config"
import readline from "readline/promises"
import { ChatGoogle } from "@langchain/google/node";
import { createAgent, HumanMessage, tool } from "langchain";
import { sendEmail } from "./mail.service.js";
import * as z from "zod"

const emailTool = tool(
  sendEmail,
  {
    name: "emailTool",
    description: "Use this tool to send an email",
    schema: z.object({
      to: z.string().describe("the recipients email address"),
      html: z.string().describe("the HTML content of the email"),
      subject: z.string().describe("The subject of email"),
    })
  }
)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const model = new ChatGoogle({
  model: "gemini-3.5-flash",
  apiKey: process.env.GEMINI_API_KEY
});

const agent = createAgent({
  model,
  tools: [emailTool],

})

const messages = []

while (true) {
  const userInput = await rl.question("you: ")
  messages.push(new HumanMessage(userInput))

  const response = await agent.invoke({ messages })
  messages.push(response.messages[response.messages.length - 1])
  console.log("AI: " + response.messages[response.messages.length - 1].content)
}

rl.close()