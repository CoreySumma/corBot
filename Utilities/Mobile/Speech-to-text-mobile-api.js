import axios from "axios";

export default async function speechToTextMobile(
  audioRecording,
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory
) {
  // Helper function to handle server side chat history with 
  // user messages and call GPT after adding it
  console.log("calling speech to text mobile")
  const addMessageToServerSideChatHistory = (message) => {
    setServerSideChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: message },
    ]);
  };

  // Check if audio recording is valid
  if (!audioRecording || audioRecording.size === 0) {
    console.error("Invalid or empty audio recording.");
    return;
  }

  console.log("audio recording:", audioRecording)

  
  const formData = new FormData();
  formData.append("file", audioRecording, "recording.mp4");
  formData.append("model", "whisper-1");

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
}

  const gptApiKey = import.meta.env.VITE_OPEN_AI_KEY;

  try {
    console.log("Sending audio data with formData:", formData);
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${gptApiKey}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Successfully received response from OpenAI API:", response);
    addMessageToServerSideChatHistory(response.data.text);
    console.log(serverSideChatHistory);
    return response.data;
  } catch (error) {
    console.error("Error in audio transcription request:", error);
    // Additional error handling logic can be added here
  }
}