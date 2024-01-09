import axios from "axios";

export default async function ttsApi(
  newMessage,
  setLoading,
  dispatch,
  isRecordingRef,
  audioUrl
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
    setLoading(false);
    let blob = response.data;
    let url = URL.createObjectURL(blob); // Create a temporary URL for the Blob
    let audio = new Audio(url);
    // Set the ref for audio url so we can stop it if user hits record button and its playing
    audioUrl.current = audio;
    // If the user starts recording before TTS is done, stop the recording
    console.log("recordingRef state in ttsApi NOT in if block:", isRecordingRef);
    audioUrl.current.play().then(() => {
      if (isRecordingRef.current === true) {
        console.log("recordingRef state in ttsApi if block:", isRecordingRef);
        audio.pause();
        audioUrl.current = null;
      } else {
        // Handle the case where recording has already started
        console.log("Skipped playing audio because recording has started");
    }
    });
    // audio.play();

    // Revoke the URL after playing
    audio.onended = () => URL.revokeObjectURL(url);

    return response.data; // Our Blob object
  } catch (error) {
    console.log("Error calling tts --->", error);
  }
}
