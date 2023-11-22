import "./App.css";
import ChatBox from "./Components/Chat/ChatBox";
import gptChatPrompt from "../Utilities/Gpt-chat-prompt";
import React, { useState } from "react";

export default function App() {
  // Backend chat history that includes the prompt
  const [serverSideChatHistory, setServerSideChatHistory] = useState(gptChatPrompt);
  // Frontend chat history that does not includes the prompt
  const [clientSideChatHistory, setClientSideChatHistory] = useState([]);
  return (
    <>
      <h1>CorBot 1.0</h1>
      <ChatBox
        serverSideChatHistory={serverSideChatHistory}
        setServerSideChatHistory={setServerSideChatHistory}
        clientSideChatHistory={clientSideChatHistory}
        setClientSideChatHistory={setClientSideChatHistory}
      />
    </>
  );
}

