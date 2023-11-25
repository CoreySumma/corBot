import axios from 'axios';

export default async function ttsApi(newMessage) {
  const gptApiKey = import.meta.env.VITE_OPEN_AI_KEY;
  console.log(gptApiKey); // Debugging line, remove in production

  try {
    let response = await axios.post(
      'https://api.openai.com/v1/audio/speech', // Corrected API endpoint
      {
        model: "tts-1",
        input: newMessage, // Changed from 'text' to 'input'
        voice: "alloy", // Change the voice if needed
        speed: 1.0, // Change the speed if needed
      },
      {
        responseType: "blob", // For handling binary data
        headers: {
          Authorization: `Bearer ${gptApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    let blob = response.data; // This is a Blob
    let url = URL.createObjectURL(blob); // Create a temporary URL for the Blob
    let audio = new Audio(url);
    audio.play(); // Play the audio

    // Optional: Revoke the URL after playing
    audio.onended = () => URL.revokeObjectURL(url);

    return response.data; // Our Blob object
  } catch (error) {
    console.log("Error calling tts --->", error);
  }
}
