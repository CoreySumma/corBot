import { useState, useRef, useEffect } from "react";
import "./RecordButton.css";
import { motion, useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import startMediaRecording from "../../../Utilities/Media-recorder";
import { updateRecordingState } from "../../actions";

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
  tinyLargeCircle: {
    transform: "scale(0.6)",
    opacity: 0.5,
    boxShadow: `0px 0px 0px 10px ${RED_COLOR}`,
  },
  loadingPulseIn: {
    transform: "scale(1)",
    opacity: 0.1,
    boxShadow: `0px 0px 0px 20px ${RED_COLOR}`,
  },
  loadingPulseOut: {
    transform: "scale(1)",
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
  loading: {
    transform: "scale(0.5)",
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
  triangle: {
    width: "80px", // Adjust the size as needed
    height: "80px", // Adjust the size as needed
    backgroundColor: `${RED_COLOR}`, // Set the color of your choice
    clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)", // Points the triangle to the right
    transform: "scale(0.8)", // Adjust scale if needed
    borderRadius: "0", // Ensures edges are straight
    position: "relative", // Allows for positioning
    // Additional properties for positioning or other styling if needed
  },
  loading: {
    transform: "scale(0)",
  },
};

export default function RecordButton({
  serverSideChatHistory,
  setServerSideChatHistory,
  clientSideChatHistory,
  setClientSideChatHistory,
  loading,
  setLoading,
  recording,
  setRecording,
  isRecording,
  isRecordingRef,
}) {
  // Request access to the microphone an video on component mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
  }, []); 

  // Use refs because I'm nervous about losing state - values
  // persist between renders without triggering a re-render
  const audioRecorderRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoChunksRef = useRef([]);
  const buttonRef = useRef(null);

  // Redux vars
  // const isRecording = useSelector((state) => state.stateData.recordingState);
  console.log("isRecording", isRecording);

  // Redux vars to pass as args
  const dispatch = useDispatch();

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
        // await innerCircleAnimation.start("triangle");
        // Set a timeout to wait for 2 seconds - elegant line I love it <3
        await new Promise((resolve) => setTimeout(resolve, 500));
        await innerCircleAnimation.start("invisible");
      } else {
        await innerCircleAnimation.start("circle");
      }
    })();
  }, [clicked, innerCircleAnimation]);

  // useEffect for loader animation
  useEffect(() => {
    (async () => {
      if (loading) {
        await innerCircleAnimation.start("loading");
        await outerCircleAnimation.start(
          ["loadingPulseOut", "loadingPulseIn"],
          {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1,
          }
        );
      } else {
        await innerCircleAnimation.start("circle");
        await outerCircleAnimation.start("circle");
      }
    })();
  }, [loading, innerCircleAnimation, outerCircleAnimation]);

  // If not loading or hover or clicked then set to circle
  useEffect(() => {
    if (!loading && !hover && !clicked) {
      innerCircleAnimation.start("circle");
      outerCircleAnimation.start("circle");
    }
  }, [loading, hover, clicked, innerCircleAnimation, outerCircleAnimation]);

  // Handler attached to function for media recording both video and audio
  const startRecording = () => {
    startMediaRecording(
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
    );
  };

  // Function to stop recording
  const stopRecording = () => {
    console.log("entered stop recording");
    if (
      (videoRecorderRef.current && audioRecorderRef.current)
    ) {
      setRecording(false);
      dispatch(updateRecordingState(false));
      console.log("recording stopped function", recording);
      audioRecorderRef.current.stop();
      videoRecorderRef.current.stop();
      console.log("video chunks", videoChunksRef.current);
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

  // I need to remove the events to stop chunk gathering form streams after recording
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
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  return (
    <div
      className={`record-button-wrapper ${loading ? "button-disabled" : ""}`}
    >
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
