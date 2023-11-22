import axios from "axios";

export default async function gptChatApi(
  serverSideChatHistory,
  setServerSideChatHistory
) {
  const gptApiKey = import.meta.env.VITE_OPEN_AI_KEY;
  try {
    let response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: serverSideChatHistory,
      },
      {
        headers: {
          Authorization: `Bearer ${gptApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    setServerSideChatHistory([
      ...serverSideChatHistory,
      response.data.choices[0].message,
    ]);
    return response.data.choices[0].message;
  } catch (error) {
    console.log("Error calling chat GPT --->", error);
  }
}
