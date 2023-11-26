import { useState, useRef } from "react";
import "./RecordButton.css";
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
    if (recording) return; // If already recording, don't start again
    setRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
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
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    startRecording();
    console.log("touch start");
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    stopRecording();
    console.log("touch end");
  };

  return (
    <button
      className="record-button"
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      Record
    </button>
  );
}
