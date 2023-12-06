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
          setClientSideChatHistory,
          setLoading,
          dispatch
        );
        audioChunksRef.current = [];
      };
      // Initialize the recorder to 'recording' state by calling start()
      mediaRecorderRef.current.start();
    })
    .catch((e) => console.error(e));
};