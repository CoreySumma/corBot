import axios from "axios";

export default async function gptChatApi(
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory
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
    setServerSideChatHistory((prevHistory) => [
      ...prevHistory,
      response.data.choices[0].message,
    ]);
    setClientSideChatHistory((prevHistory) => [
      ...prevHistory,
      response.data.choices[0].message.content,
    ]);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log("Error calling chat GPT --->", error);
  }
}
