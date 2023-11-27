import axios from "axios";
import ttsmApi from "../Text-to-speech-mobile-api";

export default async function gptChatMobileApi(
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory
) {
  const gptApiKey = import.meta.env.VITE_OPEN_AI_KEY;
  console.log("calling GPT....");
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
    console.log(serverSideChatHistory)
    setServerSideChatHistory((prevHistory) => [
      ...prevHistory,
      response.data.choices[0].message,
    ]);
    setClientSideChatHistory((prevHistory) => [
      ...prevHistory,
      response.data.choices[0].message,
    ]);
    ttsmApi(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
  }
}
