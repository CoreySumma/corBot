import { useState, useRef } from "react";
import speechToText from "../../../Utilities/Speech-to-text-api";

export default function RecordButton({
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
}) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = () => {
    if (recording) {
      return; // If already recording, don't start again
    }
    setRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        mediaRecorderRef.current.ondataavailable = (e) =>
          audioChunksRef.current.push(e.data);
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          // Pass the Blob to your speechToText function and state
          speechToText(
            audioBlob,
            serverSideChatHistory,
            setServerSideChatHistory,
            clientSideChatHistory,
            setClientSideChatHistory,
          );
          audioChunksRef.current = [];
        };
        mediaRecorderRef.current.start();
      })
      .catch((e) => console.error(e));
  };

  const stopRecording = () => {
    if (!recording || !mediaRecorderRef.current) {
      return; // If not recording or mediaRecorder isn't set, don't stop
    }
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <button
      className="record-button"
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={startRecording}
      onTouchEnd={stopRecording}
    >
      {recording ? "Recording..." : "Hold to Record"}
    </button>
  );
}
