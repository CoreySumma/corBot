import { useState, useRef, useEffect } from "react";
import "./RecordButton.css";
import speechToText from "../../../Utilities/Speech-to-text-api";
import { motion, useAnimation } from 'framer-motion';

export default function RecordButton({
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
}) {
  // Use refs when we need to access a DOM node or React element from a function component
  // or to persist a value between renders without triggering a re-render
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const buttonRef = useRef(null);

  // Framer Motion states 
  const [hover, setHover] = useState(false);
  const outerCircleAnimation = useAnimation();
  const innerCircleAnimation = useAnimation();

  const startRecording = () => {
    if (recording) return; // If already recording, don't start again
    setRecording(true);
    // Get the user's microphone
    navigator.mediaDevices
      // The getUserMedia() method prompts the user for permission to use a media input which produces a MediaStream with tracks containing the requested types of media.
      .getUserMedia({ audio: true })
      // The then() method returns a Promise. It takes up to two arguments: callback functions for the success and failure cases of the Promise.
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        // The ondataavailable event handler is called when the MediaRecorder has gathered data available for consumption.
        mediaRecorderRef.current.ondataavailable = (e) => {
          // The push() method adds one or more elements to the end of an array and returns the new length of the array.
          audioChunksRef.current.push(e.data);
        };
        // The onstop event handler is called when the recording is stopped either by calling MediaRecorder.stop() or when the requested timeslice has been reached.
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          // Call the speechToText function with the audioBlob and the chat history
          speechToText(
            audioBlob,
            serverSideChatHistory,
            setServerSideChatHistory,
            clientSideChatHistory,
            setClientSideChatHistory
          );
          // The current property of the useRef() hook returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component.
          audioChunksRef.current = [];
        };
        // Initialize the recorder to 'recording' state by calling start()
        mediaRecorderRef.current.start();
      })
      .catch((e) => console.error(e));
  };

  const stopRecording = () => {
    // Check if mediaRecorderRef.current is not null and is recording
    console.log("enetered stop recording");
    if (
      (mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording") ||
      recording
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
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

  useEffect(() => {
    const button = buttonRef.current;
    button.addEventListener("touchstart", handleTouchStart, false);
    button.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      button.removeEventListener("touchstart", handleTouchStart, false);
      button.removeEventListener("touchend", handleTouchEnd, false);
    };
  }, []);

  useEffect(() => {
    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [recording, mediaRecorderRef]);

  return (
    <>
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        className="record-button"
        ref={buttonRef}
      >
        Record
      </button>
    </>
  );
}
