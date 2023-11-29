import axios from "axios";
import ttsmApi from "./Text-to-speech-mobile-api";

export default async function gptMobileChatApi(
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
  audio,
  setAudio,
  audioUrl,
  setAudioUrl,
  blob,
  setBlob
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
    console.log(serverSideChatHistory);
    const newMessage = response.data.choices[0].message.content;
    // Call Text to speech API with args
    ttsmApi(newMessage, audio, setAudio, audioUrl, setAudioUrl, blob, setBlob);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
  }
}
