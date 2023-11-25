import axios from "axios";

export default async function speechToText(audioRecording) {
  const gptApiKey = import.meta.env.VITE_OPEN_AI_KEY;
  const formData = new FormData();
  formData.append('file', audioRecording, 'recording.mp3'); // 'recording.mp3' is the filename
  formData.append('model', 'whisper-1');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${gptApiKey}`, 
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error in audio transcription request:', error);
    throw error; // Propagate the error
  }
};
