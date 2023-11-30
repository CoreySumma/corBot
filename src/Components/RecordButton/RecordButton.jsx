import { useState, useRef, useEffect } from "react";
import "./RecordButton.css";
import speechToText from "../../../Utilities/Speech-to-text-api";
import { motion, useAnimation } from "framer-motion";

// Framer variants
const RED_COLOR = `#FF214D`;

const outerCircleVariants = {
  circle: {
    transform: "scale(1)",
    opacity: 0.5,
    boxShadow: `0px 0px 0px 10px ${RED_COLOR}`,
  },
  largeCircle: {
    transform: "scale(2)",
    opacity: 1,
    boxShadow: `0px 0px 0px 10px ${RED_COLOR}`,
  },
  pulseIn: {
    transform: "scale(2)",
    opacity: 1,
    boxShadow: `0px 0px 0px 20px ${RED_COLOR}`,
  },
  pulseOut: {
    transform: "scale(2)",
    opacity: 1,
    boxShadow: `0px 0px 0px 10px ${RED_COLOR}`,
  },
};

const innerCircleVariants = {
  circle: {
    transform: "scale(1)",
    borderRadius: "100%",
  },
  square: {
    transform: "scale(0.8)",
    borderRadius: "30%",
  },
  invisible: {
    transform: "scale(0)",
    borderRadius: "100%",
  },
};

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
  const [clicked, setClicked] = useState(false);
  const outerCircleAnimation = useAnimation();
  const innerCircleAnimation = useAnimation();

  // Click event to trigger animation
  const handleClick = () => {
    setClicked(!clicked);
  };

  // useEffect for outer circle animation hover
  useEffect(() => {
    (async () => {
      if (hover) {
        await outerCircleAnimation.start("largeCircle");
        await outerCircleAnimation.start(["pulseOut"], {
          repeat: Infinity,
          repeatType: "mirror",
        });
      } else {
        await outerCircleAnimation.start("circle");
      }
    })();
  }, [hover, outerCircleAnimation]);

  // useEffect for outer circle animation clicked
  useEffect(() => {
    (async () => {
      if (clicked) {
        await outerCircleAnimation.start("largeCircle");
        await outerCircleAnimation.start(["pulseOut", "pulseIn"], {
          repeat: Infinity,
          repeatType: "mirror",
        });
      } else {
        await outerCircleAnimation.start("circle");
      }
    })();
  }, [clicked, outerCircleAnimation]);

  // useEffect for inner circle animation clicked
  useEffect(() => {
    (async () => {
      if (clicked) {
        await innerCircleAnimation.start("square");
        await innerCircleAnimation.start("invisible");
      } else {
        await innerCircleAnimation.start("circle");
      }
    })();
  }, [clicked, innerCircleAnimation]);

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
    <div className="record-button-wrapper">
      <motion.div
        className="record-button-container"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseDown={() => {
          startRecording();
          handleClick();
        }}
        onMouseUp={() => {
          stopRecording();
          handleClick();
        }}
        ref={buttonRef}
      >
        <motion.div
          initial="circle"
          animate={outerCircleAnimation}
          variants={outerCircleVariants}
          className="outer-circle"
        />
        <motion.div
          initial="circle"
          animate={innerCircleAnimation}
          variants={innerCircleVariants}
          className="inner-circle"
        />
      </motion.div>
    </div>
  );
}
