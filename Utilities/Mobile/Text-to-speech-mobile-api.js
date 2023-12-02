import axios from "axios";

export default async function ttsmApi(
  newMessage,
  audio,
  setAudio,
  audioUrl,
  setAudioUrl,
  blob,
  setBlob,
  setLoading
) {
  const gptApiKey = import.meta.env.VITE_OPEN_AI_KEY;

  try {
    let response = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        model: "tts-1",
        input: newMessage,
        voice: "alloy",
        speed: 1.0,
      },
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${gptApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    let blob = response.data;
    let url = URL.createObjectURL(blob); // Create a temporary URL for the Blob
    let audio = new Audio(url);
    // Set state for audio, audioUrl, blob, and loading flag for frontend animation
    setAudio(audio);
    setAudioUrl(url);
    setBlob(blob);
    setLoading(false);

    // audio.play();

    // Revoke the URL after playing
    // audio.onended = () => URL.revokeObjectURL(url);

    return response.data; // Our Blob object
  } catch (error) {
    console.log("Error calling ttsm --->", error);
  }
}
