// Built on top of Tensor Flow - easy to use light weight library for facial expression recognition
import * as faceapi from "face-api.js";

export default async function FaceAPI(videoStream) {
  console.log("FaceAPI enetered")
  // Load the models we need
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

  console.log('videoStream:', videoStream);

  // Create a new video element so we can analze the video
  const videoElement = document.createElement("video");
  videoElement.srcObject = videoStream;
  videoElement.autoplay = true;
  document.body.appendChild(videoElement);

// Hide the video element
videoElement.style.display = "none";

  // Create options for the facial expression detection
  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 512,
    scoreThreshold: 0.5,
  });

  // On play of the video, detect the facial expressiona and log them to the console
  videoElement.onloadedmetadata = async () => {
    // Start the analysis when the video stream is ready
    while (!videoElement.paused && !videoElement.ended) {
      const result = await faceapi
        .detectSingleFace(videoElement, options)
        .withFaceExpressions();
      if (result) {
        console.log(result.expressions); // Process expressions here
        // Implement your logic based on detected expressions
      }
      await faceapi.wait(1000); // Adjust time as needed
    }
  };
}
