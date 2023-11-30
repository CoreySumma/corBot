import { useState, useRef, useEffect } from "react";
import "./MobileVersion.css";
import speechToTextMobile from "../../../Utilities/Mobile/Speech-to-text-mobile-api";
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

export default function MobileVersion({
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
  audio,
  setAudio,
  audioUrl,
  setAudioUrl,
  blob,
  setBlob,
}) {
  // Use refs when we need to access a DOM node or React element from a function component
  // or to persist a value between renders without triggering a re-render
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const buttonRef = useRef(null);

  // Framer Motion states
  const [active, setActive] = useState(false);
  const outerCircleAnimation = useAnimation();
  const innerCircleAnimation = useAnimation();

  // Request access to the microphone on component load
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setMediaStream(stream);
        // You can set up the MediaRecorder here or keep it in startRecording
        // For example: mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/mp4" });
      })
      .catch(e => console.error("Error accessing microphone: ", e));
  }, []);
  
  

  // useEffect for outer circle animation for touch(active)
  useEffect(() => {
    (async () => {
      if (active) {
        await outerCircleAnimation.start("largeCircle");
        await outerCircleAnimation.start(["pulseOut", "pulseIn"], {
          repeat: Infinity,
          repeatType: "mirror",
        });
      } else {
        await outerCircleAnimation.start("circle");
      }
    })();
  }, [active, outerCircleAnimation]);

  // useEffect for inner circle animation for touch(active)
  useEffect(() => {
    (async () => {
      if (active) {
        await innerCircleAnimation.start("square");
        await innerCircleAnimation.start("invisible");
      } else {
        await innerCircleAnimation.start("circle");
      }
    })();
  }, [active, innerCircleAnimation]);

  // Logic for recording
  let stopTheChunks = true;

  const startRecording = () => {
    if (recording) return; // If already recording, don't start again
    setRecording(true);
    stopTheChunks = false;
    // Ask for permission to use the microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      // The then() method returns a Promise. It takes up to two arguments: callback functions for the success and failure cases of the Promise.
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/mp4",
        });
        console.log("New MediaRecorder instance:", mediaRecorderRef.current);
        // The ondataavailable event handler is called when the MediaRecorder has gathered data available
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (!stopTheChunks) {
            console.log("Data available: Chunk size", e.data.size);
            audioChunksRef.current.push(e.data);
          }
        };
        // The onstop event handler is called when the recording is stopped either by calling MediaRecorder.stop() or when the requested timeslice has been reached.
        mediaRecorderRef.current.onstop = () => {
          console.log(
            "Recording stopped. Total chunks: ",
            audioChunksRef.current.length
          );
          let audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/mp4",
          });
          console.log("Blob created. Blob size: ", audioBlob.size); // Log Blob size
          stopTheChunks = true;

          if (audioBlob.size > 0) {
            speechToTextMobile(
              audioBlob,
              serverSideChatHistory,
              setServerSideChatHistory,
              clientSideChatHistory,
              setClientSideChatHistory
            );
          } else {
            console.error("No audio data recorded");
          }
          audioChunksRef.current = [];
        };

        // This is the most important line.
        // Because mp4s are larger files, we need to record in chunks
        // The start() method of the MediaRecorder Interface starts recording
        // and pushes 1 second chunks to the audioChunksRef.current array
        mediaRecorderRef.current.start(500); // Start recording with a timeslice of 1000ms (1 second)
        console.log("Recording started");
      })
      .catch((e) => console.error("Error accessing microphone: ", e));
  };

  const stopRecording = () => {
    console.log("MediaRecorder state before stopping:", mediaRecorderRef.current?.state);
    // If there's an active MediaRecorder instance and it's recording, stop it
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      stopTheChunks = true;
    }
    // Immediately set recording state to false to prevent more chunks being added
    setRecording(false);
  };

  // // In the ondataavailable event
  // mediaRecorderRef.current.ondataavailable = (e) => {
  //   // Only add chunks if recording is true
  //   if (recording && e.data.size > 0) {
  //     console.log("Data available: Chunk size", e.data.size);
  //     audioChunksRef.current.push(e.data);
  //   }
  // };

  // const stopRecording = () => {
  //   // Check if mediaRecorderRef.current is not null and is recording
  //   console.log("enetered stop recording");
  //   if (
  //     (mediaRecorderRef.current &&
  //       mediaRecorderRef.current.state === "recording") ||
  //     recording
  //   ) {
  //     mediaRecorderRef.current.stop();
  //     setRecording(false);
  //   }
  // };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActive(true);
    startRecording();
    console.log("touch start");
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    // e.preventDefault();
    setActive(false);
    stopRecording();
    console.log("touch end");
  };
  // const handleTap = (e) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   setActive(!active);
  //   toggleRecording();
  // };

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

  // Logic for playing audio
  const handlePlay = () => {
    if (audioUrl) {
      let playAudio = new Audio(audioUrl);
      playAudio.play();
      setAudioUrl(null);
    }
  };

  const outerCircleClass =
    audioUrl !== null
      ? "play-button-outer-circle has-scale-animation"
      : "play-button-outer-circle";
  const outerCircleDelayedClass =
    audioUrl !== null
      ? "play-button-outer-circle has-scale-animation has-delay-short"
      : "play-button-outer-circle";

  return (
    <>
      <div className="record-button-wrapper">
        <motion.div
          className="record-button-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          // onTap={handleTap} // This doesnt work (yet)
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
      <div
        onTouchStart={handlePlay} // For touch screen devices
        onClick={handlePlay} // For non-touch devices (like desktop)
        className="play-button"
      >
        <a className="play-button-link">
          <div className={outerCircleClass}></div>
          <div className={outerCircleDelayedClass}></div>
          <div className="play-button-icon">
            <svg height="100%" width="100%" fill="#000000">
              <polygon
                className="play-button-triangle"
                points="5,0 30,15 5,30"
              />
              <path
                className="play-button-path"
                d="M5,0 L30,15 L5,30z"
                fill="none"
                stroke="#000000"
                strokeWidth="1"
              />
            </svg>
          </div>
        </a>
      </div>
    </>
  );
}
