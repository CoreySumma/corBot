import axios from "axios";

export default async function speechToText(
  audioRecording,
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
  setLoading,
  dispatch,
  facialExpressionRef
) {

  // Grab the current facial expression from the ref
  let facialExpression = facialExpressionRef.current;
  // Helper function to handle server side chat history with user messages and call GPT after adding it
  const addMessageToServerSideChatHistory = (message, facialExpression) => {
    setServerSideChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: message + " Users Facial Expression: " + facialExpression},
    ]);
  };

  const gptApiKey = import.meta.env.VITE_OPEN_AI_KEY;
  const formData = new FormData();
  formData.append("file", audioRecording, "recording.mp3"); // 'recording.mp3' is the filename
  formData.append("model", "whisper-1");
  // Local State
  setLoading(true);

  try {
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
    addMessageToServerSideChatHistory(response.data.text, facialExpression);
    return response.data;
  } catch (error) {
    console.error("Error in audio transcription request:", error);
    throw error; 
  }
}
