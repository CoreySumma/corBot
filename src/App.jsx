import "./App.css";
import ChatBox from "./Components/Chat/ChatBox";
import RecordButton from "./Components/RecordButton/RecordButton";
import gptChatPrompt from "../Utilities/Gpt-chat-prompt";
import gptChatApi from "../Utilities/Gpt-chat-api";
import checkScreenSize from "../Utilities/Check-screen-size";
import React, { useState, useEffect } from "react";
import MobileVersion from "./Components/MobileVersion/MobileVersion";

export default function App() {
  // Check if user is on mobile or desktop
  const [width, setWidth] = useState(checkScreenSize());

  // State for blob audio playback
  const [audioIsReady, setAudioIsReady] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [blob, setBlob] = useState(null);

  console.log(width);
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

  useEffect(() => {
    // Check if the last message was from the user
    if (
      serverSideChatHistory.length > 0 &&
      serverSideChatHistory[serverSideChatHistory.length - 1].role === "user"
    ) {
      gptChatApi(
        serverSideChatHistory,
        setServerSideChatHistory,
        clientSideChatHistory,
        setClientSideChatHistory
      );
    }
  }, [serverSideChatHistory]);
  return (
    <>
      <h1>CorBot 2.0</h1>
      {width > 600 ? (
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
          />
        </>
      ) : (
        <MobileVersion
        serverSideChatHistory={serverSideChatHistory}
        setServerSideChatHistory={setServerSideChatHistory}
        clientSideChatHistory={clientSideChatHistory}
        setClientSideChatHistory={setClientSideChatHistory}
        audioIsReady={audioIsReady}
        setAudioIsReady={setAudioIsReady}
        audioUrl={audioUrl}
        setAudioUrl={setAudioUrl}
        blob={blob}
        setBlob={setBlob}
        />
      )}
    </>
  );
}
