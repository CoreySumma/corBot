import axios from 'axios';

export default async function ttsApi(newMessage, setLoading) {
  const gptApiKey = import.meta.env.VITE_OPEN_AI_KEY;

  try {
    let response = await axios.post(
      'https://api.openai.com/v1/audio/speech', 
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
    if (response) {
      setLoading(false);
    }
    let blob = response.data; 
    let url = URL.createObjectURL(blob); // Create a temporary URL for the Blob
    let audio = new Audio(url);
    audio.play(); 

    // Revoke the URL after playing
    audio.onended = () => URL.revokeObjectURL(url);

    return response.data; // Our Blob object
  } catch (error) {
    console.log("Error calling tts --->", error);
  }
}
