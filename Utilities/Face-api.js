// Built on top of Tensor Flow - easy to use light weight library for facial expression recognition
import * as faceapi from "face-api.js";
import analyzeFacials from "./Analyze-facials";

export default async function FaceAPI(
  videoStream,
  recording,
  isRecordingRef,
  facialExpressionRef
) {
  console.log("FaceAPI enetered");
  // Load the models we need manuaslly from our file system (public/models)
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

  console.log("videoStream:", videoStream);
  console.log("recording:", recording);

  // Create a new video element so we can analze the video
  // We need a physical video element to analyze it in real time
  const videoElement = document.createElement("video");
  videoElement.srcObject = videoStream;
  videoElement.autoplay = true;
  document.body.appendChild(videoElement);

  // Hide the video element
  videoElement.style.display = "none";

  // Create options for the facial expression detection
  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 608, // Smaller = faster, but less accurate
    scoreThreshold: 0.7, // 0 - 1, the higher the number the more accurate, but less detections
    maxResults: 3, // How many emotions to detect
  });

  console.log(
    "======is recording var before entering the asunc function/loop:",
    isRecordingRef.current
  );
  // On play of the video, detect the facial expressiona and log them to the console
  videoElement.onloadedmetadata = async () => {
    // Start the analysis when the video stream is ready
    // console.log("=======is recording var before loop:", isRecording)
    while (
      !videoElement.paused &&
      !videoElement.ended &&
      isRecordingRef.current
    ) {
      // console.log("=======is recording var within loop:", isRecording)
      const response = await faceapi
        .detectSingleFace(videoElement, options)
        .withFaceExpressions();
      if (response) {
        console.log(response.expressions); // Process expressions here
        // Call the analyzeFacials function to determine the most dominant facial expression
        // and set the ref for the facial expression to be used in the chatbot
        facialExpressionRef.current = analyzeFacials(response.expressions);
        console.log("facialExpressionRef.current:", facialExpressionRef.current);
      }
      // Cleanup the video element when we arent recording
      // videoElement.srcObject = null;
      // document.body.removeChild(videoElement);
    }
  };
}
