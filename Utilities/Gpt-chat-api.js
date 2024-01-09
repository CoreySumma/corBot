import axios from "axios";
import ttsApi from "./Text-to-speech-api";

export default async function gptChatApi(
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
  setLoading,
  dispatch,
  isRecordingRef,
  audioUrl,
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
    setServerSideChatHistory((prevHistory) => [
      ...prevHistory,
      response.data.choices[0].message,
    ]);
    setClientSideChatHistory((prevHistory) => [
      ...prevHistory,
      response.data.choices[0].message,
    ]);
    console.log(serverSideChatHistory)
    ttsApi(response.data.choices[0].message.content, setLoading, dispatch, isRecordingRef, audioUrl);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
  }
}
