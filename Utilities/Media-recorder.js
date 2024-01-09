import speechToText from "./Speech-to-text-api";
import sendVideoToModel from "./Face-api";
import { updateRecordingState } from "../src/actions";

export default function startMediaRecording(
  recording,
  videoChunksRef,
  audioChunksRef,
  videoRecorderRef,
  audioRecorderRef,
  setRecording,
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
  setLoading,
  dispatch,
  isRecording,
  isRecordingRef,
  facialExpressionRef,
) {
  // Don't record again if we are already recording
  if (isRecording) return; 
  // Otherwise, set recording to true locally and through redux
  setRecording(true);
  isRecordingRef.current = true;
  console.log("isRecordingRef in start recording", isRecordingRef.current)
  dispatch(updateRecordingState(true));

  navigator.mediaDevices
    // The getUserMedia() method prompts the user for permission to use video and audio media inputs.
    .getUserMedia({ video: true, audio: true }) 
    .then((stream) => {
      // Grab two separate tracks from the stream
      const videoStream = new MediaStream([stream.getVideoTracks()[0]]);
      const audioStream = new MediaStream([stream.getAudioTracks()[0]]);
      // Analyze the video stream for facial expressions
      sendVideoToModel(videoStream, recording, isRecordingRef, facialExpressionRef);

      // Create a new ref.current for video and audio MediaRecorder for each stream
      videoRecorderRef.current = new MediaRecorder(videoStream, {
        mimeType: "video/webm",
      });
      audioRecorderRef.current = new MediaRecorder(audioStream, {
        mimeType: "audio/webm",
      });
      // As we record the video and audio, we will push the data into these arrays
      videoRecorderRef.current.ondataavailable = (e) => {
        // Add the recorded video chunks to the array
        videoChunksRef.current.push(e.data);
      };
      audioRecorderRef.current.ondataavailable = (e) => {
        // Add the recorded audio chunks to the array
        audioChunksRef.current.push(e.data);
      };

      videoRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, {
          type: "video/webm",
        });
        // Function sending video data to tensor flow model
        // sendVideoToModel(videoBlob);
           // Reset the recording state
           videoChunksRef.current = [];
      }
      audioRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        // Call the speechToText function with the audioBlob and the chat history
        speechToText(
          audioBlob,
          serverSideChatHistory,
          setServerSideChatHistory,
          clientSideChatHistory,
          setClientSideChatHistory,
          setLoading,
          dispatch,
          facialExpressionRef
        );
        // Reset the recording state
        audioChunksRef.current = [];
      };        
      // Start recording video and audio
      videoRecorderRef.current.start();
      audioRecorderRef.current.start();
    })
    .catch((e) => console.error(e));
}
