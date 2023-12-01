import "./App.css";
import ChatBox from "./Components/Chat/ChatBox";
import RecordButton from "./Components/RecordButton/RecordButton";
import gptChatPrompt from "../Utilities/Gpt-chat-prompt";
import gptChatApi from "../Utilities/Gpt-chat-api";
import gptMobileChatApi from "../Utilities/Mobile/Gpt-chat-api-mobile";
import checkScreenSize from "../Utilities/Check-screen-size";
import React, { useState, useEffect, useRef } from "react";
import MobileVersion from "./Components/MobileVersion/MobileVersion";
import { useMediaQuery } from "react-responsive";

export default function App() {
  // Check if user is on mobile or desktop
  const width = checkScreenSize();

  const isDesktop = useMediaQuery({ minWidth: 601 });

  // State for blob audio playback
  const [audio, setAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [blob, setBlob] = useState(null);

  // State for loading animation
  const [loading, setLoading] = useState(false);

  // const supportedTypes = [
  //   "flac",
  //   "m4a",
  //   "mp3",
  //   "mp4",
  //   "mpeg",
  //   "mpga",
  //   "oga",
  //   "ogg",
  //   "wav",
  //   "webm",
  // ];
  // supportedTypes.forEach((type) => {
  //   console.log(
  //     type + " supported: ",
  //     MediaRecorder.isTypeSupported("audio/" + type)
  //   );
  // });

  // useEffect(() => {
  //   console.log("Audio state updated:", audio);
  // }, [audio]);

  // Intro message in chat box - customize it however you would like!
  const introMessage = {
    content:
      "Hi There! My Name is Corey and I am a Software Engineer based in Austin. Feel free to ask me anything 😊",
    role: "assistant",
  };
  // Backend chat history that includes the prompt
  const [serverSideChatHistory, setServerSideChatHistory] =
    useState(gptChatPrompt);
  // Frontend chat history that does not includes the prompt
  const [clientSideChatHistory, setClientSideChatHistory] = useState([
    introMessage,
  ]);
  // UseEffect to trigger desktop version of GPT chat API when the server-side chat history changes
  useEffect(() => {
    // Check if the last message was from the user
    if (
      serverSideChatHistory.length > 0 &&
      serverSideChatHistory[serverSideChatHistory.length - 1].role === "user" &&
      width > 600
    ) {
      gptChatApi(
        serverSideChatHistory,
        setServerSideChatHistory,
        clientSideChatHistory,
        setClientSideChatHistory,
        setLoading
      );
    }
  }, [serverSideChatHistory]);
// UseEffect to trigger mobile version of GPT chat API when the server-side chat history changes
  useEffect(() => {
    // Check if the last message was from the user
    if (
      width < 600 &&
      serverSideChatHistory[serverSideChatHistory.length - 1].role === "user" 
    ) {
      gptMobileChatApi(
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
      );
    }
  }, [serverSideChatHistory, audio, audioUrl, blob, width]);

  return (
    <>
      <h1>CorBot 2.0</h1>
      {isDesktop ? (
        <>
          <ChatBox
            serverSideChatHistory={serverSideChatHistory}
            setServerSideChatHistory={setServerSideChatHistory}
            clientSideChatHistory={clientSideChatHistory}
            setClientSideChatHistory={setClientSideChatHistory}
          />
          <RecordButton
            serverSideChatHistory={serverSideChatHistory}
            setServerSideChatHistory={setServerSideChatHistory}
            clientSideChatHistory={clientSideChatHistory}
            setClientSideChatHistory={setClientSideChatHistory}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      ) : (
        <MobileVersion
          serverSideChatHistory={serverSideChatHistory}
          setServerSideChatHistory={setServerSideChatHistory}
          clientSideChatHistory={clientSideChatHistory}
          setClientSideChatHistory={setClientSideChatHistory}
          audio={audio}
          setAudio={setAudio}
          audioUrl={audioUrl}
          setAudioUrl={setAudioUrl}
          blob={blob}
          setBlob={setBlob}
        />
      )}
    </>
  );
}
