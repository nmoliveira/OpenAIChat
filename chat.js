import "dotenv/config";
import OpenAI from "openai";
import readline from "node:readline";

const openai = new OpenAI();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const chatHistory = [
  {
    role: "system",
    content:
      "You are an AI assistant. Answer questions to the best of your ability",
  },
];

const formatMessage = (userInput) => ({
  role: "user",
  content: userInput,
});

const sendMessageToAI = async (message) => {
  const results = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [...chatHistory, message],
  });

  const response = results.choices[0].message;
  chatHistory.push(response);
  return response.content;
};

const chat = () => {
  rl.setPrompt("You: ");
  rl.prompt();

  rl.on("line", async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    const message = formatMessage(userInput);
    const response = await sendMessageToAI(message);

    console.log(`\nAI: ${response}\n`);

    rl.prompt();
  });

  rl.on("close", () => {
    console.log("Chatbox exited.");
    process.exit(0);
  });
};

console.log("Chatbot initialized. Type 'exit' to leave the chat.");

chat();
